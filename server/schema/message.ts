import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    extend type Query {
      getMessages(cursor: String, limit: Int): MessageConnection!
      getMessage(id: ID!): Message!
    }
    extend type Mutation {
      createMessage(text: String!): Message!
      deleteMessage(id: ID!): Boolean!
    }
    type MessageConnection {
      edges: [Message!]!
      pageInfo: PageInfo!
    }
  
    type PageInfo {
      hasNextPage: Boolean!
      endCursor: String!
    }
  
    type Message {
      id: ID!
      text: String!
      createdAt: Date!
      user: User!
    }
    extend type Subscription {
      messageCreated: MessageCreated!
    }
  
    type MessageCreated {
      message: Message!
    }
`)

export default schema;