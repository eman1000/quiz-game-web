import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type User {
      id: ID
      username: String
      firstName: String !
      lastName: String !
      gender: Gender
      age: Int
      email: String
      role: String
      facebookId: String
      avatar: String
      isOnline: Boolean
      messages: [Message!]
    }

    enum Gender {
      MALE
      FEMALE
    }
    extend type Query {
      getUser(id: ID): User
      getUsers: [User!]
      getMe: User
    }

    extend type Mutation{
      signUp(
        username: String!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        email: String!
        gender: String!
        age: String!
        password: String!
      ): Token!
      signIn(login: String!, password: String!): Token!
      deleteUser(id: ID!): Boolean!
      signInFacebook(facebookToken :String!): Token!
    }

    type Token {
      token: String!
      user:User!
    }

    input UserInput{
      id: ID
      username: String
      firstName: String !
      lastName: String
      gender: Gender
      age: Int
      email: String
    }
`)

export default schema;