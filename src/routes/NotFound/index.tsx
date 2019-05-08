import React from "react";
import Page from "../../components/Page";

export default () => (
  <Page
    id="not-found"
    title="Not Found"
    description="This is embarrassing."
    noCrawl
  >
    <div className="row">
      <div className="col-md-12 mx-auto">
        <h3 style={{textAlign:"center", margingTop:"60px"}}>404</h3>
        <h1 style={{textAlign:"center"}}>Super embarrassing.</h1>
      </div>
    </div>
    
  </Page>
);
