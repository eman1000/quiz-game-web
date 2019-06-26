import React from "react";
import { IUser, IScore } from "../../../../typings";
import { IUserScoreData } from "../Test";
import styles from "./QuizComplete.module.scss";
import SocialShare from "../../../../components/SocialShare";

export type IQuizCompleteProps = {
  userScoreData:IUserScoreData;
}
const QuizComplete = ({
  userScoreData
}:IQuizCompleteProps)=>{

  const { user, score } = userScoreData;
  const { avatar, coins, gems } = user;

  return (
    <div className={styles.quizComplete}>
      
      <img width="150px" src={avatar} />
      <h6>You got 99th position with a total score of: {score}</h6>
      <h1>Congratulations</h1>
      <div>{coins} coins</div>
      <div>{gems} gems</div>
      <SocialShare/>
      <button>Share Results</button>
      <button>Pick Another Quiz</button>
    </div>
  );
}

export default QuizComplete;