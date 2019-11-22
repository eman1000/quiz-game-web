import React, { useState, useEffect, useRef } from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import ErrorHandler from "../../../../components/ErrorHandler";
import gql from "graphql-tag";
import { IMatch, IUser, ITest } from "../../../../typings";
import QuizComplete from "../QuizComplete";
import { async } from "q";
import { number } from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Answer from "../Answer";
import "../../../../styles/home.scss";
const Entities = require('html-entities').AllHtmlEntities;
function shuffle(arra1) {
  var ctr = arra1.length, temp, index;

// While there are elements in the array
  while (ctr > 0) {
// Pick a random index
      index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
      ctr--;
// And swap the last element with it
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
  }
  return arra1;
} 
const entities = new Entities();
type ITestProps = {
  matchId: number;
  matchObj: {
    test: ITest;
    status: string;
    winnerId: number;
  };
  user: IUser;
  opponent?: IUser;
  client: any;
};

type GetTestQuery = {
  getTestWithQuestions: ITest;
};

type GetTestVariables = {
  testId: number;
};

export type IUserScoreData = {
  userId: number;
  score: number;
  user: IUser;
};
export const GET_TEST = gql(`
  query($testId:ID !) {
    getTestWithQuestions(testId: $testId) {
      id
      name
      categoryId
      pointsPerAnswer
     	testQuestions{
        id
        questionId
        question{
          id
          description
          imageUrl
          categoryId
          answers{
            id
            description
            imageUrl
            isCorrect
          }
        }
      }
    }
  }
`);

export const SAVE_QUESTION_RESULT = gql(`
  mutation($matchId:ID!, $userId:ID!, $questionId:ID!,$answerId:ID!, $categoryId:ID!, $isCorrect:Boolean) {
    saveQuestionResult(matchId:$matchId, userId:$userId, questionId:$questionId,answerId:$answerId, categoryId:$categoryId,isCorrect:$isCorrect) {
      matchId
      userId
      answerId
      categoryId
      questionId
      isCorrect
    }
  }
`);

export const UPDATE_MATCH = gql(`
  mutation($id:ID!, $status:String){
    updateMatch(id:$id, status:$status){
      id
      status
      winnerId
    }
  }
`);

export const GET_SCORE = gql(`
  query($userId:ID!, $categoryId:ID!){
    getUserScore(userId:$userId, categoryId:$categoryId){
      userId
      score
      user{
        avatar
        coins
        gems
      }
    }
  }
`);

export const DEDUCT_REWARD = gql(`
  mutation($id:ID!, $key:DeductKey!, $amount: Int!){
    deductReward(id: $id, key: $key, amount: $amount){
      id
      coins
      gems
    }
  }
`);

var timer;

const getRandomInt = (max, correctIndex) => {
  const num = Math.floor(Math.random() * Math.floor(max));
  return correctIndex === num ? getRandomInt(max, correctIndex) : num;
};
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      //@ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      timer = setInterval(tick, delay);
      return () => clearInterval(timer);
    }
  }, [delay]);
}
const Test = (props: ITestProps) => {
  const { matchId, matchObj, user, opponent, client } = props;
  let [count, setCount] = useState<number>(10);
  const [testPosition, setTestPosition] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [questionResult, setQuestionResult] = useState({});
  const [answers, setAnswers] = useState();
  

  const [showComplete, setShowComplete] = useState<boolean>(true);
  const [userScoreData, setUserScoreData] = useState<IUserScoreData | null>(
    null
  );

  const testObj = matchObj.test || {};
  const [test, setTest] = useState(testObj.testQuestions[testPosition]);


  const handleGetScores = async () => {
    const getScores = await client.query({
      query: GET_SCORE,
      variables: {
        categoryId: matchObj.test.categoryId,
        userId: user.id
      }
    });
    if (getScores) {
      const { getUserScore } = getScores.data;
      setUserScoreData(getUserScore);
    }
  };
  const handleSaveQuestion = async ({ saveQuestionResult, testObj }) => {
    setTimeout(() => {
      handleNext();
    }, 1500);
    const result = await saveQuestionResult();
    const data = result.data.saveQuestionResult;
    setQuestionResult({
      ...questionResult,
      [`q${data.questionId}a${data.answerId}`]: data.isCorrect
    });

  };
  const markAsDone = async ({ matchId, status }) => {
    console.table([{ matchId, status }]);
    const winner = await client.mutate({
      mutation: UPDATE_MATCH,
      variables: {
        id: matchId,
        status
      }
    });

    const test = await client.mutate({
      mutation: UPDATE_MATCH,
      variables: {
        id: matchId,
        status
      }
    });

    const getScores = await client.query({
      query: GET_SCORE,
      variables: {
        categoryId: matchObj.test.categoryId,
        userId: user.id
      }
    });
    if (getScores) {
      const { getUserScore } = getScores.data;
      setUserScoreData(getUserScore);
    }
    const winnerData = winner.data.updateMatch;
    if (winnerData.winnerId === user.id) {
      //show Quiz complete modal
      setShowComplete(true);
    } else {
      //show Quiz complete modal
      setShowComplete(true);
    }

    //num games played
    if(typeof window != "undefined"){
      const theNumGamesPlayed = window.localStorage.getItem("numGamesPlayed");
      if(theNumGamesPlayed != null){
        const newNum = parseInt(theNumGamesPlayed) + 1;
        window.localStorage.setItem("numGamesPlayed", newNum.toString());
      }else{
        window.localStorage.setItem("numGamesPlayed", "1");
      }
    }
    console.log("WINNER", winner);
  };
  const handleNext = () => {
    setCount(10);
    setFilterdAnswers(null);

    //@ts-ignore
    if (testPosition + 1 < matchObj.test.testQuestions.length) {
      setTestPosition(testPosition + 1);
      setTest(testObj.testQuestions[testPosition + 1]);
      setAnswers(shuffle(testObj.testQuestions[testPosition + 1].question.answers));
    } else {
      markAsDone({ matchId, status: "complete" });
    }
  };
  const cheat = async (id: number, amount: number, key: string) => {
    try {
      const deduct = await client.mutate({
        mutation: DEDUCT_REWARD,
        variables: {
          id,
          key,
          amount
        }
      });
      if (deduct) {
        if (key === "gems") {
          const newFiltered = answers.filter(
            (ans, index) =>
              ans.isCorrect === true
          );
          const incorrectAnswers = answers.filter((ans, index)=>ans.isCorrect !== true);
          const randomFromAnswers = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];


          setFilterdAnswers(shuffle([...newFiltered, ...[randomFromAnswers]]));
        }
        if (key === "coins") {
          setFilterdAnswers(answers.filter(
            (ans, index) =>
              ans.isCorrect === true
          ));
        }
      }
      return deduct;
    } catch (err) {
      setIsError(true)
      setErrMsg(err.graphQLErrors[0].message);
      setTimeout(() => {
        setIsError(false)
      }, 1000);
      //alert(err.message);
      throw err;
    }
  };
  useInterval(() => {
    if (matchObj.status === "complete") {
      clearInterval(timer);  
    }
    if (count === 0) {
      handleNext();
    } else {
      setCount(count - 1);
    }
    //@ts-ignore
    if (
      testPosition + 1 == matchObj.test.testQuestions.length &&
      count === 0
    ) {
      clearInterval(timer);
    }
  }, 1000);

  useEffect(() => {
    if (matchObj.status === "complete") {
      handleGetScores();
    }
    setAnswers(shuffle(test.question.answers));
    return () => console.log("clear");
  }, []);
 // const answers = ;
  //const correctAnswerIndex = answers.findIndex(ans => ans.isCorrect === true);
  // const filterdAnswers = !isCoinsCheat
  //   ? answers
  //   : answers.filter(
  //       (ans, index) =>
  //         ans.isCorrect === true
  //     );
  

  const [filterdAnswers, setFilterdAnswers] = useState();

  return (
    <div>
      {userScoreData && matchObj.status === "complete" && (
        <QuizComplete
          userScoreData={userScoreData}
          isWinner={matchObj.winnerId == user.id ? true : false}
        />
      )}
      <TransitionGroup>
        <CSSTransition
          key={testPosition}
          timeout={1000}
          classNames="messageout"
        >
          {matchObj.test && (
            <div className={"questions"}>
              <div className={"question-wrapper"}>
                
                <div className={"question"}>

                      <div className={"question__image"}>

    </div>

                  <div className={"question__count-down"}>{count}</div>

                  <div className={"question__counter"}>Question {testPosition + 1}/{testObj.testQuestions.length}</div>

                  <div className={"question__title"}>
                    <h3>{entities.decode(test.question.description)}</h3>
                  </div>

    <div className={"footer cheats"}>
                <button 
                
                  onClick={() => cheat(user.id, 8, "gems")}
                  className={"btn grenade"}
                >
                  50/50
                  <span>8 </span>
                </button>

                <button
                  onClick={() => cheat(user.id, 8, "coins")}
                  className={"btn cheat"}
                >
                  Cheat
                  <span>8 </span>
                </button>
              </div>

                </div>

                <div />
                <div />
                {opponent && (
                  <div>
                    <img style={{ width: "100px" }} src={opponent.avatar} />
                  </div>
                )}
              </div>

              <ul className={"question__options"}>
                {answers && (filterdAnswers ? filterdAnswers : answers).map((answer, index) => {
                  let isCorrect =
                    questionResult[`q${test.questionId}a${answer.id}`];

                  return (
                    <Mutation
                      key={index}
                      mutation={SAVE_QUESTION_RESULT}
                      variables={{
                        matchId,
                        userId: user.id,
                        answerId: answer.id,
                        questionId: test.question.id,
                        categoryId: matchObj.test.categoryId,
                        isCorrect:
                          answer.isCorrect !== null ? answer.isCorrect : false
                      }}
                    >
                      {(saveQuestionResult, { loading }) => {
                        // if (loading) return "Loading...";
                        return (
                          <Answer
                            handleSaveQuestion={handleSaveQuestion}
                            saveQuestionResult={saveQuestionResult}
                            isCorrect={isCorrect}
                            testObj={testObj}
                            answer={answer}
                            saveAnswerLoading={loading}
                          />
                        );
                      }}
                    </Mutation>
                  );
                })}
              </ul>

            
            </div>
          )}
        </CSSTransition>
      </TransitionGroup>

      {
        isError &&
        <div className="err-modal">
          {errMsg}
          {/* <a className="btn" onClick={()=>setIsError(false)}>Close</a> */}
        </div>
      }
    </div>
  );
};

export default withApollo(Test);
