import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
import { sequelize } from '../models';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Query: {

        getTest: async (parent, { testId }, { models }) => {
          return await models.Test.findByPk(testId);
        },
        getTestWithQuestions: async (parent, { testId }, { models }) => {
          return await models.Test.getTestWithQuestionsById({testId, models});
        },
        getRandomTestByCategory: async (parent, { categoryId }, { models }) => {

          const test = await models.Test.findAll({
            
            where:{
              categoryId:categoryId
            },
            include: [{
              model: models.TestQuestion,
              required: true,
            include: [{
              model: models.Question,
              required: true,
              include: [{
                model: models.Answer,
                required: true
              }]
            }]
            }],
            order:sequelize.random()
          });

          console.log("test", test)
          //const finalTest = test.testQuestions.map((q)=>q.question);
          return test[0]
        }
    }
};

export default resolver;
