import React, { Fragment } from "react";
import { ICategory } from "../../typings";
import ScrollItem from "../ScrollItem";
import styles from "./Banner.module.scss";

type IBanner = {
  title: string;
  description: string;
  bgImage: string;
};
export default ({ title, description, bgImage }: IBanner) => {
  return (
    <div >
      <div className={"modal-header"}>
        <h1>{title}</h1>
        
      </div>
      <div className={"category-banner"}>
      <p>{description}</p>
      </div>
      </div>
    
    
  );
};
