import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type User {
      id: ID
      username: String
      firstame: String !
      lastName: String
      gender: Gender
      age: Int
      email: String
      role: String
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
    }

    type Token {
      token: String!
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