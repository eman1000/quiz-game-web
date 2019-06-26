import React from "react";
import {
  FacebookShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareCount,
  TumblrShareCount,

  FacebookIcon
} from 'react-share';

const SocialShare = ()=>{
  return(
    <div>
      <FacebookShareButton url={"http://c1.ouisys.com/WEJBYg"}>
      <FacebookIcon
        size={32}
        round />
      </FacebookShareButton>
    </div>
  )
}


export default SocialShare;