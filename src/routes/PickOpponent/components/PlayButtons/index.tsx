import React from "react";

const PlayButtons = ({setFindPlayer, setSinglePlayer})=>{

  return (
    <div>
      <h1>Pick Opponent</h1>
      <button onClick={()=>setFindPlayer(true)}>Random Player</button>
      <br/><br/>
      <button onClick={()=>setSinglePlayer(true)}>Single Player</button>
    </div>
  );
}

export default PlayButtons;