import React from "react";

const PlayButtons = ({setFindPlayer})=>{

  return (
    <div>
      <h1>Pick Opponent</h1>
      <button onClick={()=>setFindPlayer(true)}>Random Player</button>
      <br/><br/>
      <button>Single Player</button>
    </div>
  );
}

export default PlayButtons;