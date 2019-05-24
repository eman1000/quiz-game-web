import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Query: {

        getResult: async (parent, { id }, { models }) => {
          return await models.Result.findByPk(id);
        }
    },
    Mutation:{
      saveQuestionResult: async (
        parent,
        { 
          matchId,
          userId,
          questionId,
          answerId,
          isCorrect
        },
        { models, secret },
      ) => {
        const result = await models.Result.create({
          matchId,
          userId,
          questionId,
          answerId,
          isCorrect
        });
  
        return result;
      }
    }
};

export default resolver;
