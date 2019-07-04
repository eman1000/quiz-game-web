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
    <Link className="category" to={`/category-details/${category.id}`}>
      <div className={"thumbnail"}>
      {
        category.thumbnail && isImage(category.thumbnail) &&
        <img src={category.thumbnail}/>

      }

    <div className={"category__icon  sport"}></div>
              <div className={"category__name"}>Sport</div>

      </div>
      <span>{category.name}</span>
    </Link>
  )
};
