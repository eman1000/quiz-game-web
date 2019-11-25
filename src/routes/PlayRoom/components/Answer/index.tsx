import React, { Fragment, useState, useEffect } from "react";
import { ITest, IQuestion } from "../../../../typings";
import "../../../../styles/home.scss";
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
export type IAnswer = {
  answer: any;
  isCorrect: boolean;
  saveQuestionResult: IAnswer;
  testObj: ITest;
  handleSaveQuestion: ({ saveQuestionResult: IAnswer, testObj: ITest }) => void;
  saveAnswerLoading: boolean;
  isDisabledOtherAnswers:boolean;
};
const Answer = ({
  answer,
  isCorrect,
  saveQuestionResult,
  testObj,
  handleSaveQuestion,
  saveAnswerLoading,
  isDisabledOtherAnswers
}: IAnswer) => {
  // useEffect(() => {
  //   if (isGemsCheat) {
  //     handleSaveQuestion({ saveQuestionResult, testObj });
  //   }
  // });

  return (
    <Fragment>
      <button
        disabled={isDisabledOtherAnswers}
        className={`
          ${saveAnswerLoading
            ? "btn btn-outline option"
            : "btn btn-outline option"}
          ${(isCorrect !== undefined) ? (isCorrect ? "correct" : "wrong" ) : ""}
          
        `}
        onClick={() => handleSaveQuestion({ saveQuestionResult, testObj })}
      >
        {isDisabledOtherAnswers && saveAnswerLoading &&
        <div className={"fading-circle"}>
          <div className={"circle1 sk-circle"} />
          <div className={"circle2 sk-circle"} />
          <div className={"circle3 sk-circle"} />
          <div className={"circle4 sk-circle"} />
          <div className={"circle5 sk-circle"} />
          <div className={"circle6 sk-circle"} />
          <div className={"circle7 sk-circle"} />
          <div className={"circle8 sk-circle"} />
          <div className={"circle9 sk-circle"} />
          <div className={"circle10 sk-circle"} />
          <div className={"circle11 sk-circle"} />
          <div className={"circle12 sk-circle"} />
        </div>}
        {entities.decode(answer.description)}

      
      </button>
      {/* {
           isDisabledOtherAnswers && isCorrect &&
          <div style={{position:"absolute", zIndex:99999}} className="response response--correct">
            <div className="response__img"></div>
            <div className="response__msg">Yes you got that right</div>
          </div>
        }

        {
          !isCorrect &&
        
          <div style={{position:"absolute", zIndex:99999}} className="response response--wrong">
            <div className="response__img"></div>
            <div className="response__msg">Ooops not correct there</div>
          </div>
        }  */}
    </Fragment>
  );
};

export default Answer;
