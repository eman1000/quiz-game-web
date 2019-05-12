import React, { Fragment } from "react";
import { Category } from "../../typings"
import ScrollItem from "../ScrollItem";
import styles from "./HorizontalScroll.module.scss"

export default ({data, title, className}:{data:Array<Category>, title?:string,className?:string}) => {
  return(
    <div>
      {
        title &&
        <h4>{title}</h4>
      }
      <div className={styles.wrapper}>
        {
          data.map((category:Category, index:number)=>{
            return(
              <ScrollItem
                key={index}
                category={category}
              />
            );
          })
        }
      </div>
    </div>
  )
}
