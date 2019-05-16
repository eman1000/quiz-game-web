import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Query: {
        getQuestionWithAnswers: async (parent, { testId }, { models }) => {
          const q = await models.Question.findByTestId(testId);
          console.log("q", q[0].dataValues.answers[0])
          return await q;
        },
        getQuestion: async (parent, { id }, { models }) => {
          return await models.Question.findByPk(id);
        }
    },
    Mutation: {
      createQuestion: async (
        parent,
        { 
          description,
          imageUrl,
          categoryId,
          testId
        },
        { models },
      ) => {
        const question = await models.Question.create({
          description,
          imageUrl,
          categoryId,
          testId
        });
  
        return question;
      }
    }
};

export default resolver;
