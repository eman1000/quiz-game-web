import React, { Fragment } from "react";
import { Category } from "../../typings"
import ScrollItem from "../ScrollItem";
import styles from "./Banner.module.scss"

export default ({title, description, bgImage}) => {
  return(
    <div>
      <div style={{backgroundImage:`url(${bgImage})`}} className={styles.wrapper}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}
