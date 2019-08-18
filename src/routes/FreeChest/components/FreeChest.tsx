import React, { Component, Fragment, useEffect, useState } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { graphql, withApollo } from "react-apollo";
import moment from "moment";
import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll";
import Loader from "../../../components/Loader";
import { Transition } from 'react-transition-group';

//import { Category } from "typings";

import "../../../styles/home.scss";
import { ICategory, IUser } from "../../../typings";
import { isAbsolute } from "path";
import { Link } from "react-router-dom";

type IFreeChestProps = {
  user:IUser
};



export const UPDATE_USER_REWARDS = gql(`
  mutation($id:ID!, $coins:Int!, $gems: Int!){
    updateUser(id:$id, coins:$coins, gems:$gems){
      id
      firstName
      lastName
      coins
      gems
    }
  }
`);

const FreeChest: React.FunctionComponent<IFreeChestProps> = (props: IFreeChestProps) => {

  const [isChestOpen, setChestOpen] = useState<boolean>(false);
  const [hoursLeft, setHoursLeft] = useState<string>();
  const updateCoinsAndGems = ()=>{
    console.log("props", props)
    if(typeof window != "undefined"){
      const freeChestCountDate = window.localStorage.getItem("freeChestCountDate");
      
      if(freeChestCountDate != null){
        setHoursLeft(moment(freeChestCountDate).fromNow())
        //@ts-ignore
        const isActive = moment(freeChestCountDate) < moment();
        if(isActive){
          //@ts-ignore
          props.client.mutate({
            variables: {
              id:props.user.id,
              coins: props.user.coins + 4,
              gems:props.user.gems + 12
            },
            mutation:UPDATE_USER_REWARDS
          })
          .then( res => {
            setChestOpen(true);
            window.localStorage.setItem("freeChestCountDate", moment(Date.now()).add(24, 'hours').toString());
          })
          .catch((err)=>{
            throw err;
          })
        }
      }else{
        setChestOpen(false)
      }
    }
  }
  useEffect(()=>{
    updateCoinsAndGems();
  },[])
  return (
    <Page className={"game-chest"} title="Game chest">
    <div className={"modal reward-bg"}>
     <div className={"modal-header"}>
       <h1>New Chest Unlocked</h1>
     </div>
     <div className={"modal-body"}>

   <div className={"chest-reward-container"}>

   </div>
    {
      isChestOpen &&

      <div className={"chest-rewards"}>
        <div className={"chest-reward gems"}>
          <h1>4</h1>
          <span>Coins Awarded</span>
        </div>
        <div className={"chest-reward coins"}>
          <h1>12</h1>
          <span>Germs Awarded</span>
        </div>
      </div>
      ||
      <span>Chest Will unlock {hoursLeft}</span>
    }

      <button onClick={()=>window.location.href = "/"} className={"btn "}>Continue</button>
     </div>
   </div>
 </Page>
  );
};

//@ts-ignore
const FreeChestWithApollo =  withApollo(FreeChest);

export default FreeChestWithApollo;