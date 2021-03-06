import React, { Fragment } from "react";

import { ICategory } from "../../typings"
import ScrollItem from "../ScrollItem";
import styles from "./HorizontalScroll.module.scss"

export default ({data, title, className}:{data:Array<ICategory>, title?:string,className?:string}) => {
  return(
    <Fragment>
      {
        title &&
        <div>
        <h4>{title}</h4>
        <p>a small iorn sword description</p>
        </div>
      }
      <div className={"categories"}>
        {
          //UNCOMMENT THIS TO SHOW ALL CATEGORIES AND COMMENT LINE BELOW 
          data.map((category:ICategory, index:number)=>{
          //data.filter((c)=>c.id == 1).map((category:ICategory, index:number)=>{
            return(
              <ScrollItem
                key={index}
                category={category}
              />
            );
          })
        }
      </div>
    </Fragment>
  )
}
