import React from "react";

const PlayButtons = ({setFindPlayer, setSinglePlayer})=>{

  return (
    <div className={"play-buttons-container"}>
      
      {/* <button className={"  btn greengradient"} onClick={()=>setFindPlayer(true)}>Random Player</button> */}
      
      <button className={" btn btn-outline"} onClick={()=>setSinglePlayer(true)}>Single Player</button>
    </div>
  );
}

export default PlayButtons;