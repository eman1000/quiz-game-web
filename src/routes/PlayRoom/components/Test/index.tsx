import React, { useState, useEffect, useRef } from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import ErrorHandler from "../../../../components/ErrorHandler";
import gql from "graphql-tag";
import { IMatch, IUser, ITest } from "../../../../typings";
import QuizComplete from "../QuizComplete";
import { async } from "q";
import { number } from "prop-types";
import Answer from "../Answer";
import "../../../../styles/home.scss";

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
  let [count, setCount] = useState<number>(0);
  const [testPosition, setTestPosition] = useState<number>(0);
  const [questionResult, setQuestionResult] = useState({});

  const [showComplete, setShowComplete] = useState<boolean>(true);
  const [userScoreData, setUserScoreData] = useState<IUserScoreData | null>(
    null
  );
  const [isGemsCheat, setGemsCheat] = useState<boolean>(false);
  const [isCoinsCheat, setCoinsCheat] = useState<boolean>(false);

  const testObj = matchObj.test || {};
  const test = testObj.testQuestions[testPosition];

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
    if (isGemsCheat) {
      setGemsCheat(false);
    }
    const result = await saveQuestionResult();
    const data = result.data.saveQuestionResult;
    setQuestionResult({
      ...questionResult,
      [`q${data.questionId}a${data.answerId}`]: data.isCorrect
    });
    setTimeout(() => {
      handleNext();
    }, 2000);
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

    console.log("WINNER", winner);
  };
  const handleNext = () => {
    setCount(0);
    if (isGemsCheat) {
      setGemsCheat(false);
    }
    if (isCoinsCheat) {
      setCoinsCheat(false);
    }
    //@ts-ignore
    if (testPosition + 1 < matchObj.test.testQuestions.length) {
      setTestPosition(testPosition + 1);
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
          setGemsCheat(true);
        }
        if (key === "coins") {
          setCoinsCheat(true);
        }
      }
      return deduct;
    } catch (err) {
      alert(err.message);
      throw err;
    }
  };
  useInterval(() => {
    if (matchObj.status === "complete") {
      clearInterval(timer);
    }
    if (count === 10) {
      handleNext();
    } else {
      setCount(count + 1);
    }
    //@ts-ignore
    if (
      testPosition + 1 == matchObj.test.testQuestions.length &&
      count === 10
    ) {
      clearInterval(timer);
    }
  }, 200000000);

  useEffect(() => {
    if (matchObj.status === "complete") {
      handleGetScores();
    }
    return () => console.log("clear");
  }, []);
  const answers = test.question.answers;
  const correctAnswerIndex = answers.findIndex(ans => ans.isCorrect === true);
  const filterdAnswers = !isCoinsCheat
    ? answers
    : answers.filter(
        (ans, index) =>
          ans.isCorrect === true ||
          index === getRandomInt(answers.length, correctAnswerIndex)
      );
  return (
    <div>
      {userScoreData && matchObj.status === "complete" && (
        <QuizComplete
          userScoreData={userScoreData}
          isWinner={matchObj.winnerId == user.id ? true : false}
        />
      )}
      {matchObj.test && (
        <div>
          <div>
            <div className={"question"}>
            <div className={"header"}>
                    <div className={"profile"}>

                      <div className={"profile__user"}>
                        <img src="" className={"user__img"} />
                        <div className={"profile-points"}>
                        <div className={"profile-points-title"}>Your total points</div>
                        <div className={"profile-points-qty"}>24,800</div>
                        </div>
                      </div>
                      <div className={"profile-gains"}>
                      <div className={"profile__coins"}>12</div>
                      <div className={"profile__germs"}>12</div>
                      </div>
                    </div>
                  </div>

                  <div className={"question__image"}>

</div>

              <div className={"question__count-down"}>{count}</div>

              <div className={"question__counter"}>Question {testPosition + 1}/{testObj.testQuestions.length}</div>

              <div className={"question__title"}>
                <h3>{test.question.description}</h3>
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
            {filterdAnswers.map((answer, index) => {
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
                        isGemsCheat={isGemsCheat}
                        saveAnswerLoading={loading}
                      />
                    );
                  }}
                </Mutation>
              );
            })}
          </ul>

          <div className={"footer cheats"}>
            <button 
            
              onClick={() => cheat(user.id, 8, "gems")}
              className={"btn darkbluegradient grenade"}
            >
              Grenade
              <span>X8 Coins</span>
            </button>

            <button
              onClick={() => cheat(user.id, 8, "coins")}
              className={"btn orangegradient cheat"}
            >
              Cheat
              <span>X8 Coins</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withApollo(Test);
