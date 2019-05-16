import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export default(error) => {
  return(
    <div>
      {
        error.error.graphQLErrors.map((err)=>{
          const {code} = err.extensions;
          if(err.message.includes("Cannot read property")){
            return <div/>
          }
          return(
            <div>
              {err.message}
            </div>
          )
        })
      }
    </div>
  )
};
