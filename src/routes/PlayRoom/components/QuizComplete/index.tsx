import React, { useState } from "react";
import { IUser, IScore } from "../../../../typings";
import { IUserScoreData } from "../Test";
import styles from "./QuizComplete.module.scss";
import SocialShare from "../../../../components/SocialShare";

export type IQuizCompleteProps = {
  userScoreData:IUserScoreData;
  isWinner:boolean;
}
const QuizComplete = ({
  userScoreData,
  isWinner
}:IQuizCompleteProps)=>{

  const { user, score } = userScoreData;
  const { avatar, coins, gems } = user;
  const title = isWinner ? "Congratulations" : "You lost!";

  const [showSocialButtons, setShowSocialButtons] = useState<boolean>(false)
  return (
    <div className={styles.quizComplete}>
      
      <img width="150px" src={avatar} />
      <h6>You got 99th position with a total score of: {score}</h6>
      <h1>{title}</h1>
      <div>{coins} coins</div>
      <div>{gems} gems</div>
      
      <button onClick={()=>setShowSocialButtons(true)}>Share Results</button>
      {
        showSocialButtons &&
        <SocialShare/>
      }
      <button onClick={()=>window.location.href = "/"}>Pick Another Quiz</button>
    </div>
  );
}

export default QuizComplete;