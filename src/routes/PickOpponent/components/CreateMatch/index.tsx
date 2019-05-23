import React, { PureComponent } from "react";
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import { Redirect } from "react-router";


export const CREATE_MATCH = gql(`
  mutation($categoryId:ID!, $playerOneId: ID!, $playerTwoId:ID){
    createMatch(categoryId:$categoryId, playerOneId:$playerOneId, playerTwoId:$playerTwoId){
      id
      testId
      status
      nextMoveUserId
    }
  }
`);
class CreateMatch extends PureComponent<{
  categoryId:string,
  playerOneId:string, 
  playerTwoId:string
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

  handleCreateMatch = () => {
    const { categoryId, playerOneId, playerTwoId } = this.props;
    //@ts-ignore
    this.props.client.mutate({
      variables: {categoryId, playerOneId, playerTwoId},
      mutation:CREATE_MATCH
    })
    .then( res => {
      this.setState({match:res.data.createMatch})
      console.log(res)
    });
  }

  componentDidMount(){
    this.handleCreateMatch()
  }
  render(){
    return(
      <div>
        {
          this.state.match.hasOwnProperty("id") &&
          <Redirect to={`/play-room/${this.state.match.id}`} />

        }
      </div>
    )
  }
}

//@ts-ignore
const CreateMatchWithApollo =  withApollo(CreateMatch);

export default CreateMatchWithApollo;
