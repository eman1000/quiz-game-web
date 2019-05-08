import React from "react";
import LoaderComponent from "react-loaders"
import "./Loader.scss";

const Loader = () =>{

  return (
    <div className="wrapper">
      <LoaderComponent active type="ball-clip-rotate" />
    </div>

  );
};

export default Loader;
