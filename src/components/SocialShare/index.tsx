import React from "react";
import {
  FacebookShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareCount,
  TumblrShareCount,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon
} from 'react-share';

const SocialShare = ()=>{
  return(
    <div>
      <FacebookShareButton
        url={"http://c1.ouisys.com/VUJXTQ"}
      >
      <FacebookIcon
        size={32}
        round />
      </FacebookShareButton>

      <WhatsappShareButton
        url={"http://c1.ouisys.com/VUJXTQ"}
      >
      <WhatsappIcon
        size={32}
        round />
      </WhatsappShareButton>
      
    </div>
  )
}


export default SocialShare;