import React, { PureComponent } from "react";
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import { Redirect } from "react-router";
import CategoryDetails from "../../../CategoryDetails/components/CategoryDetails";


export const CREATE_MATCH = gql(`
  mutation($categoryId:ID!, $matchType:MatchType!, $playerOneId: ID!, $playerTwoId:ID){
    createMatch(categoryId:$categoryId, matchType:$matchType, playerOneId:$playerOneId, playerTwoId:$playerTwoId){
      id
      testId
      status
      nextMoveUserId
      matchType
    }
  }
`);

class CreateMatch extends PureComponent<{
  category:any,
  playerOne:any, 
  playerTwo:any
},{
  match:{
    id?:string
  }
}>{

  constructor(props){
    super(props)
    this.state ={
      match:{}
    }
  }

  handleSinglePlayer(match){
    window.location.href = `/play-room/${match.id}`;
  }

  handleMultipPlayer(match){
    console.log("No multiplayer logic yet")
  }
  handleCreateMatch = () => {
    const { category, playerOne, playerTwo } = this.props;

    console.table({ category, playerOne, playerTwo })
    //@ts-ignore
    this.props.client.mutate({
      variables: {
        categoryId:category.id,
        matchType: playerTwo ? "MULTI_PLAYER" : "SINGLE_PLAYER",
        playerOneId:playerOne.id,
        playerTwoId: playerTwo ? playerTwo.id : null,
      },
      mutation:CREATE_MATCH
    })
    .then( res => {
      this.setState({match:res.data.createMatch})
      if(res.data){
        const { createMatch  } = res.data;
        switch (createMatch.matchType) {
          case "SINGLE_PLAYER":
            this.handleSinglePlayer(createMatch);
            break;
          case "MULTI_PLAYER":
            this.handleMultipPlayer(createMatch);
            break;
          default:
            this.handleSinglePlayer(createMatch);
            break;
        }
      }
    })
    .catch((err)=>{
      throw err;
      
    })
  }

  componentDidMount(){
    this.handleCreateMatch()
  }
  render(){
    const { category, playerOne, playerTwo } = this.props;
    return(
      <div>
        {/* {
          this.state.match.hasOwnProperty("id") &&
          <Redirect to={`/play-room/${this.state.match.id}`} />

        } */}
        {
          playerTwo &&
        
          <div>
            <img src={category.thumbnail}/>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <div>
              <div>
                <h5>{playerOne.firstName}</h5>
                <img src={playerOne.avatar} />
              </div>
              <div>
                VS
              </div>
              <div>
                <h5>{playerTwo.firstName}</h5>
                <img src={playerTwo.avatar} />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

//@ts-ignore
const CreateMatchWithApollo =  withApollo(CreateMatch);

export default CreateMatchWithApollo;
