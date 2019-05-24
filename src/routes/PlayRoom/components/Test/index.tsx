import React, { useState, useEffect, useRef } from 'react';
import {  Query, Mutation, withApollo } from 'react-apollo';
import ErrorHandler from '../../../../components/ErrorHandler';
import gql from 'graphql-tag';



export const GET_TEST = gql(`
  query($testId:ID !) {
    getTestWithQuestions(testId: $testId) {
      id
      name
      categoryId
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
  mutation($matchId:ID!, $userId:ID!, $questionId:ID!,$answerId:ID!, $isCorrect:Boolean) {
    saveQuestionResult(matchId:$matchId, userId:$userId, questionId:$questionId,answerId:$answerId, isCorrect:$isCorrect) {
      matchId
      userId
      answerId
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
const Test = (props) => {
  const {testId, matchId, matchObj, user, opponent, client} = props;
  let [count, setCount] = useState(0);
  const [testPosition, setTestPosition] = useState(0);
  const [questionResult, setQuestionResult] = useState({});
  const [myTest, setMyTest] = useState({});
  const handleSaveQuestion = async({saveQuestionResult, testObj})=>{
    const result = await saveQuestionResult();
    console.log("THERESULT", result)
    const data = result.data.saveQuestionResult;
    console.log("data", data)
    setQuestionResult({
      ...questionResult,
      [`q${data.questionId}a${data.answerId}`]:data.isCorrect
    })
    setTimeout(() => {
      handleNext()
    }, 1000);
  }
  console.log("propstttt", props)
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
    const winnerData = winner.data.updateMatch;
    if(winnerData.winnerId === user.userId){
      //won
      //Popup with rewards

    }else{
      //lost
      //Popup with loss
    }

    console.log("WINNER",winner)
  }
  const handleNext = ()=>{
    setCount(0);
    //@ts-ignore
    if((testPosition + 1) < myTest.testQuestions.length){
      setTestPosition(testPosition + 1)
      console.log("testPosition", testPosition)
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
      if((testPosition + 1) == myTest.testQuestions.length && count === 10){
        clearInterval(timer)
      }
      console.log("test", matchObj);
    }, 1000);
  


  return (
    <Query
        query={GET_TEST}
        variables={{
          testId
        }}
      >
      {({ loading, error, data }) =>{
      if (loading) return "Loading...";
      if (error){     
        return <ErrorHandler error={error}/>;
      } 
      
        const testObj  = data.getTestWithQuestions || {};
        const test = testObj.testQuestions[testPosition];
        setMyTest(testObj);

        return(
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
              <div>
                <img style={{width:"100px"}} src={opponent.avatar}/>
              </div>
            </div>
            <h1>{count}</h1>
            <h6>{testPosition + 1}/{testObj.testQuestions.length}</h6>
            <h3>{test.question.description}</h3>
            <ul>
              {
                test.question.answers.map((answer, index)=>{
                  let isCorrect = questionResult[`q${test.questionId}a${answer.id}`]
                  console.log("questionResult", questionResult)
                  return(
                    <Mutation
                      key={index}
                      mutation={SAVE_QUESTION_RESULT}
                      variables={{
                        matchId,
                        userId:user.id,
                        answerId:answer.id,
                        questionId:test.question.id,
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
          </div>
        )
      }}
    </Query>
  );
}



export default withApollo(Test);
