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

        getTest: async (parent, { id }, { models }) => {
          return await models.Test.findByPk(id);
        },
        getRandomTest: async (parent, {  }, { models }) => {

          const test = await models.Test.findAll({
        
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

          //const finalTest = test.testQuestions.map((q)=>q.question);

          console.log("TEST", JSON.stringify(test))
          return test[0]
        }
    }
};

export default resolver;
