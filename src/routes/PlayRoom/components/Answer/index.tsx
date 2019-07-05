import React, { useState, useEffect } from "react";
import { ITest, IQuestion } from "../../../../typings";
import "../../../../styles/home.scss";
import { props } from "bluebird";

export type IAnswer = {
  answer:any,
  isCorrect:boolean,
  saveQuestionResult:IAnswer,
  testObj:ITest,
  handleSaveQuestion:({saveQuestionResult:IAnswer, testObj:ITest})=>void,
  isGemsCheat:boolean,
  saveAnswerLoading: boolean
}
const Answer = ({
  answer,
  isCorrect,
  saveQuestionResult,
  testObj,
  handleSaveQuestion,
  isGemsCheat,
  saveAnswerLoading

}:IAnswer)=>{
  useEffect(()=>{
    if(isGemsCheat){
      handleSaveQuestion({saveQuestionResult, testObj});
    }
  })
  return(
    <div>
      <button className={saveAnswerLoading ? "loading btn btn-outline option"  : "btn btn-outline option" }
        onClick={()=>handleSaveQuestion({saveQuestionResult, testObj})}
        // style={{backgroundColor: (isCorrect !== undefined) ? (isCorrect ? "green" : "red" ) : ""}}
      >
        {answer.description}
      </button>
    </div>
  )
}

export default Answer;