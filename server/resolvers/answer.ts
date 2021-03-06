import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Query: {

        getAnswer: async (parent, { id }, { models }) => {
          return await models.Answer.findByPk(id);
        }
    }
};

export default resolver;
