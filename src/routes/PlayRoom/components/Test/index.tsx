import React from 'react';
import {  Query } from 'react-apollo';
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
          }
        }
      }
    }
  }
`);
const Test = ({testId}) => {

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
      
        const test  = data.getTestWithQuestions || {};
        console.log("TEST", test)
        return(
          <div></div>
        )
      }}
    </Query>
  );
}



export default Test;
