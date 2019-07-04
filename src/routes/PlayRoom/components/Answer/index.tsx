import React, { useState, useEffect } from "react";
import { ITest, IQuestion } from "../../../../typings";
import "../../../../styles/home.scss";

export type IAnswer = {
  answer:any,
  isCorrect:boolean,
  saveQuestionResult:IAnswer,
  testObj:ITest,
  handleSaveQuestion:({saveQuestionResult:IAnswer, testObj:ITest})=>void,
  isGemsCheat:boolean,
}
const Answer = ({
  answer,
  isCorrect,
  saveQuestionResult,
  testObj,
  handleSaveQuestion,
  isGemsCheat
}:IAnswer)=>{
  useEffect(()=>{
    if(isGemsCheat){
      handleSaveQuestion({saveQuestionResult, testObj});
    }
  })
  return(
    <li>
      <button className={" btn btn-outline option "}
        onClick={()=>handleSaveQuestion({saveQuestionResult, testObj})}
        style={{backgroundColor: (isCorrect !== undefined) ? (isCorrect ? "green" : "red" ) : "#eee"}}
      >
        {answer.description}
      </button>
    </li>
  )
}

export default Answer;