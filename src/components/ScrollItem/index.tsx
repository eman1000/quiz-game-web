import React, { Component, Fragment } from "react";
import styles from "./ScrollItem.module.scss";
import { isImage } from "../../utils";
import { Link } from "react-router-dom";
import { ICategory } from "../../typings";

type IScrollProps = {
  category:ICategory,
}
export default ({category}:IScrollProps)=>{

  console.log("category key", category.catKey)
  return(
    <Link className="category" to={`/category-details/${category.id}`}>
  
  <div className={`${category.catKey} category__icon `}></div>

      <div className={"category__name"}>{category.name}</div>
    </Link>
  )
};
