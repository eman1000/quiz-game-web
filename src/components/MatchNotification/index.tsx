import React from "react";
import styles from "./MatchNotification.module.scss"

export default () => {
  return(
    <div className={styles.matchModal}>
      <div className={styles.container}>
        <h1>New challenge!</h1>
        <button>Accept Match</button>
      </div>
    </div>
  )
}
