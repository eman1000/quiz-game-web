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
    const result = await saveQuestionResult();
    const data = result.data.saveQuestionResult;
    setQuestionResult({
      ...questionResult,
      [`q${data.questionId}a${data.answerId}`]:data.isCorrect
    })
    setTimeout(() => {
      handleNext()
    }, 5000);
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
    //@ts-ignore
    if((testPosition + 1) < matchObj.test.testQuestions.length){
      setTestPosition(testPosition + 1)
    }else{
      markAsDone({matchId, status:"complete"})
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
    }, 1000);
  
    useEffect(()=>{
      if(matchObj.status === "complete"){
        handleGetScores();
      }
      return ()=>console.log("clear")
    },[0])

  return (
      <div>
        {
          userScoreData && matchObj.status === "complete" &&
          <QuizComplete
            userScoreData={userScoreData}
            isWinner={(matchObj.winnerId == user.id) ? true : false}
          />
        }
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
              let isCorrect = questionResult[`q${test.questionId}a${answer.id}`]
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
                      <li>
                        <button
                          onClick={()=>handleSaveQuestion({saveQuestionResult, testObj})}
                          style={{backgroundColor: (isCorrect !== undefined) ? (isCorrect ? "green" : "red" ) : "#eee"}}
                        >
                          {answer.description}
                        </button>
                      </li>
                    )
                  }}
                </Mutation>
              )
            })
          }

        </ul>
      }}
    </div>
  );
}



export default withApollo(Test);
