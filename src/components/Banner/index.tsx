import React, { Fragment } from "react";
import { Category } from "../../typings"
import ScrollItem from "../ScrollItem";
import styles from "./Banner.module.scss"

export default ({title, description}) => {
  return(
    <div>
      <div className={styles.wrapper}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}
