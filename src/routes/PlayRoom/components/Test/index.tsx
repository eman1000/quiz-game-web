import React, { useState, useEffect, useRef } from 'react';
import {  Query, Mutation, withApollo } from 'react-apollo';
import ErrorHandler from '../../../../components/ErrorHandler';
import gql from 'graphql-tag';
import { IMatch, IUser, ITest } from '../../../../typings';
import QuizComplete from '../QuizComplete';
import { async } from 'q';



type ITestProps = {
  matchId:number;
  matchObj:{
    test:ITest;
    status:string;
    winnerId:number;
  };
  user:IUser;
  opponent?:IUser;
  client: any;
};

type GetTestQuery = {
  getTestWithQuestions:ITest
}

type GetTestVariables = {
  testId:number;
}

export type IUserScoreData = {
  userId:number;
  score:number;
  user:IUser;
}
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
  const {matchId, matchObj, user, opponent, client} = props;
  let [count, setCount] = useState(0);
  const [testPosition, setTestPosition] = useState(0);
  const [questionResult, setQuestionResult] = useState({});

  const [showComplete, setShowComplete] = useState(true);
  const [userScoreData, setUserScoreData] = useState<IUserScoreData | null>(null)
  const [isGemsCheat, setGemsCheat] = useState<boolean>(false);

  const testObj  = matchObj.test || {};
  const test = testObj.testQuestions[testPosition];


  const handleGetScores = async()=>{
    const getScores = await client.query({
      query:GET_SCORE,
      variables:{
        categoryId:matchObj.test.categoryId,
        userId:user.id
      },
    })
    if(getScores){
      const {getUserScore} = getScores.data;
      setUserScoreData(getUserScore);
    }
  }
  const handleSaveQuestion = async({saveQuestionResult, testObj})=>{
    if(isGemsCheat){
      setGemsCheat(false);
    }
    const result = await saveQuestionResult();
    const data = result.data.saveQuestionResult;
    setQuestionResult({
      ...questionResult,
      [`q${data.questionId}a${data.answerId}`]:data.isCorrect
    })
    setTimeout(() => {
      handleNext()
    }, 2000);
  }
  const markAsDone = async({matchId, status}) =>{
    console.table([{matchId, status}])
    const winner = await client.mutate({
      mutation:UPDATE_MATCH,
      variables:{
        id:matchId,
        status
      },
    })


    const test = await client.mutate({
      mutation:UPDATE_MATCH,
      variables:{
        id:matchId,
        status
      },
    })

    const getScores = await client.query({
      query:GET_SCORE,
      variables:{
        categoryId:matchObj.test.categoryId,
        userId:user.id
      },
    })
    if(getScores){
      const {getUserScore} = getScores.data;
      setUserScoreData(getUserScore);
    }
    const winnerData = winner.data.updateMatch;
    if(winnerData.winnerId === user.id){
      //show Quiz complete modal
      setShowComplete(true);
    }else{
      //show Quiz complete modal
      setShowComplete(true);
    }

    console.log("WINNER",winner)
  }
  const handleNext = ()=>{
    setCount(0);
    if(isGemsCheat){
      setGemsCheat(false);
    }
    //@ts-ignore
    if((testPosition + 1) < matchObj.test.testQuestions.length){
      setTestPosition(testPosition + 1)
    }else{
      markAsDone({matchId, status:"complete"})
    }
  }
    const cheat = async (id:number, amount:number, key:string)=>{
      try{
        const deduct =  await client.mutate({
          mutation:DEDUCT_REWARD,
          variables:{
            id,
            key,
            amount
          },
        })
        if(deduct){
          if(key === "gems"){
            setGemsCheat(true);
          }
        }
        return deduct;
      }
      catch(err){
        alert(err.message)
        throw err;
      
      }
  }
  useInterval(() => {
    if(matchObj.status === "complete"){ 
      clearInterval(timer);
    }
    if(count === 10){
      handleNext()
    }else{
      setCount(count + 1);
    }
    //@ts-ignore
    if((testPosition + 1) == matchObj.test.testQuestions.length && count === 10){
      clearInterval(timer)
    }
  }, 10000);
  
  useEffect(()=>{
    if(matchObj.status === "complete"){
      handleGetScores();
    }
    return ()=>console.log("clear")
  },[]);

  const Answer = ({
    answer,
    isCorrect,
    saveQuestionResult,
    testObj,
    handleSaveQuestion,
    isGemsCheat
  })=>{
    useEffect(()=>{
      if(isGemsCheat){
        handleSaveQuestion({saveQuestionResult, testObj});
      }
    })
    return(
      <li>
        <button
          onClick={()=>handleSaveQuestion({saveQuestionResult, testObj})}
          style={{backgroundColor: (isCorrect !== undefined) ? (isCorrect ? "green" : "red" ) : "#eee"}}
        >
          {answer.description}
        </button>
      </li>
    )
  }
  return (
      <div>
        {
          userScoreData && matchObj.status === "complete" &&
          <QuizComplete
            userScoreData={userScoreData}
            isWinner={(matchObj.winnerId == user.id) ? true : false}
          />
        }
        {matchObj.test &&
        <div>
          <div style={{
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-between"
          }}>
            <div>
              <img style={{width:"100px"}} src={user.avatar}/>
            </div>
            <div>
              
            </div>
            {
              opponent &&
            
              <div>
                <img style={{width:"100px"}} src={opponent.avatar}/>
              </div>
            }
          </div>
          <h1>{count}</h1>
          <h6>{testPosition + 1}/{testObj.testQuestions.length}</h6>
          <h3>{test.question.description}</h3>
          <ul>
            {
              test.question.answers.map((answer, index)=>{
                let isCorrect = questionResult[`q${test.questionId}a${answer.id}`];

                return(
                  <Mutation
                    key={index}
                    mutation={SAVE_QUESTION_RESULT}
                    variables={{
                      matchId,
                      userId:user.id,
                      answerId:answer.id,
                      questionId:test.question.id,
                      categoryId:matchObj.test.categoryId,
                      isCorrect:(answer.isCorrect !== null) ? answer.isCorrect : false
                    }}
                  >
                    {(saveQuestionResult, { loading }) => {
                      if (loading) return "Loading...";
                      return(
                        <Answer
                          handleSaveQuestion={handleSaveQuestion}
                          saveQuestionResult={saveQuestionResult}
                          isCorrect={isCorrect}
                          testObj={testObj}
                          answer={answer}
                          isGemsCheat={isGemsCheat}
                        />
                      )
                    }}
                  </Mutation>
                )
              })
            }

          </ul>

          <button onClick={()=>cheat(user.id, 8, "gems")}>Grenade X8 Gems</button>
          <button onClick={()=>cheat(user.id, 8, "coins")}>Cheat X8 Coins</button>
      </div>
      }
    </div>
  );
}



export default withApollo(Test);
