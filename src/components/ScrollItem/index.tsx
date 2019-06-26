import React, { Component, Fragment } from "react";
import styles from "./ScrollItem.module.scss";
import { isImage } from "../../utils";
import { Link } from "react-router-dom";
import { ICategory } from "../../typings";

type IScrollProps = {
  category:ICategory
}
export default ({category}:IScrollProps)=>{
  return(
    <Link to={`/category-details/${category.id}`}>
      <div className={styles.thumbnail}>
      {
        category.thumbnail && isImage(category.thumbnail) &&
        <img src={category.thumbnail}/>
      }
        
      </div>
      <span>{category.name}</span>
    </Link>
  )
};
