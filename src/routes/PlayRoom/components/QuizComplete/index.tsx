import React, { useState } from "react";
import { IUser, IScore } from "../../../../typings";
import { IUserScoreData } from "../Test";
import styles from "./QuizComplete.module.scss";
import SocialShare from "../../../../components/SocialShare";
// import "../../../../styles/home.scss";

export type IQuizCompleteProps = {
  userScoreData: IUserScoreData;
  isWinner: boolean;
};
const QuizComplete = ({ userScoreData, isWinner }: IQuizCompleteProps) => {
  const { user, score } = userScoreData;
  const { avatar, coins, gems } = user;
  const title = isWinner ? "Congratulations" : "You lost!";

  const [showSocialButtons, setShowSocialButtons] = useState<boolean>(false);

  return (
    <div className={"result-container "}>
      <div className={"modal"}>
        <div className={"modal-header "}><h1>Quiz completed</h1></div>
        <div className={"modal-body"}>
      <div className={"result"}>
        <div className={"profile__user"}>
          <div>
            <img className={"user__img"} src={avatar} />
          </div>
        </div>

        <div className={"result__title"}>
          <span>{title}</span>
        </div>

        <div className={"winner-reward"}>
          <h3>
            Your total score of:
            <span> {score} pts</span>
          </h3>
          <div className={"reward-wrap"}>
            <div className={"reward reward--gem"}>{gems}</div>

            <div className={"reward reward--coin"}>{coins}</div>
          </div>
        </div>

        <div className={"result--action"}>
          <button
            className={"btn greengradient"}
            onClick={() => setShowSocialButtons(true)}
          >
            Share Results
          </button>
          {showSocialButtons && <SocialShare />}
          <button
            className={"btn btn-outline"}
            onClick={() => (window.location.href = "/")}
          >
            Pick Another Quiz
          </button>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default QuizComplete;
