import React, { Fragment } from "react";
import { ICategory } from "../../typings"
import ScrollItem from "../ScrollItem";
import styles from "./Banner.module.scss"

type IBanner = {
  title: string;
  description: string;
  bgImage:string;
}
export default ({title, description, bgImage}:IBanner) => {
  return(
    <div>
      <div style={{backgroundImage:`url(${bgImage})`}} className={styles.wrapper}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}
