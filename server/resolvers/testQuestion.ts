import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Query: {
      getRandomTestQuestion: async (parent, { id }, { models }) => {

        const test = await models.TestQuestion.findAll({
          //order: sequelize.random(),
          where:{
            //categoryId:1
            testId:1
          }
        })

        console.log("test", test)
        return test
      },
      getTestQuestion: async (parent, { id }, { models }) => {
          return await models.TestQuestion.findByPk(id);
        }
    }
};

export default resolver;
