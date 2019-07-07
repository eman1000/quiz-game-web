import React, { Fragment, useState, useEffect } from "react";
import { ITest, IQuestion } from "../../../../typings";
import "../../../../styles/home.scss";
import { props } from "bluebird";

export type IAnswer = {
  answer: any;
  isCorrect: boolean;
  saveQuestionResult: IAnswer;
  testObj: ITest;
  handleSaveQuestion: ({ saveQuestionResult: IAnswer, testObj: ITest }) => void;
  isGemsCheat: boolean;
  saveAnswerLoading: boolean;
};
const Answer = ({
  answer,
  isCorrect,
  saveQuestionResult,
  testObj,
  handleSaveQuestion,
  isGemsCheat,
  saveAnswerLoading
}: IAnswer) => {
  useEffect(() => {
    if (isGemsCheat) {
      handleSaveQuestion({ saveQuestionResult, testObj });
    }
  });
  return (
    <Fragment>
      <button
        className={
          saveAnswerLoading
            ? "btn btn-outline option"
            : "btn btn-outline option"
        }
        onClick={() => handleSaveQuestion({ saveQuestionResult, testObj })}
        // style={{backgroundColor: (isCorrect !== undefined) ? (isCorrect ? "green" : "red" ) : ""}}
      >
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
        </div>
        {answer.description}
      </button>
    </Fragment>
  );
};

export default Answer;
