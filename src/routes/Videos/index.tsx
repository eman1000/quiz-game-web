import React, { Component, useState } from "react";

import Page from "../../components/Page";
import Loader from "../../components/Loader";
import "./VideosStyles.scss";
import { Link, withRouter } from "react-router-dom";
import MainMenu from "../MainMenu";
import PlayHeader from "../../components/PlayHeader";
import YouTube from 'react-youtube';


export type IVideos = {
  title:string;
  id:string;
  category:string;
}
const Games = ({}) => {

  const [filteredVideos, setFilterdVideos] = useState<Array<IVideos> | undefined>();
  const videos:Array<IVideos> = [{
    title:"Cute and Funny Cat Videos to Keep You Smiling! 🐱",
    id:"tpiyEe_CqB4",
    category:"funny"
  },{
    title:"Sintel 2010 720p",
    id:"fsC_wGBn_dg",
    category:"movie"
  },{
    title:"big buck bunny 1080p stereo",
    id:"vuwfYoyxGis",
    category:"movie"
  },{
    title:"FathersLittleDividend1951 512kb",
    id:"oXSyCF5pyR4",
    category:"movie"
  },{
    title:"1947BlowUps 512kb",
    id:"_vilvh-9b24",
    category:"movie"
  },{
    title:"Return of the Kung Fu Dragon 512kb",
    id:"6OYpz5IGrW4",
    category:"movie"
  }]


  const handleFilterVideos = (searchString:string)=>{
    if(searchString != ""){
      const f = videos.filter((obj)=>{
        return JSON.stringify(obj).toLowerCase().includes(searchString.toLowerCase())
      });

      console.log(f)

      setFilterdVideos(f)
    }else{
      setFilterdVideos(videos);
    }
  }

  return (
    <Page id="vidos" title="Games">
      <PlayHeader/>
      <div className="vcontent">
        
        <h1>Videos</h1>
        <div className="search">
          <input onChange={(ev)=>handleFilterVideos(ev.target.value)} type="text" placeholder="Search Videos"/>
        </div>
        <div className="vlist">
          
          {
            (filteredVideos ? filteredVideos : videos).map((obj, index)=>{
              return <div key={index} className="vitem">

                  <div className="vtop">
                    <h2>{obj.title}</h2>
                  </div>
                  <YouTube
                  videoId={obj.id}  
                  opts={
                    {
                      playerVars: {
                        // https://developers.google.com/youtube/player_parameters
                        color:"white",
                        modestbranding:1,
                        showinfo:0
                      },
                    }
                  }       
                />
              </div>
            })
          }
        </div>

      {
        filteredVideos && filteredVideos.length > 0 &&

        <div className="others">
          <hr/>
          <h1>Other Videos</h1>
          <div className="vlist">
            
            {
              videos.map((obj, index)=>{
                return <div key={index} className="vitem">

                    <div className="vtop">
                      <h2>{obj.title}</h2>
                    </div>
                    <YouTube
                    videoId={obj.id}  
                    opts={
                      {
                        playerVars: {
                          // https://developers.google.com/youtube/player_parameters
                          color:"white",
                          modestbranding:1,
                          showinfo:0
                        },
                      }
                    }       
                  />
                </div>
              })
            }
          </div>
        </div>
      }
      </div>
    </Page>
  );
};

export default withRouter(Games);
