import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Query: {
        getCategories: async (parent, { cursor, limit = 100 }, { models }) => {
          const cursorOptions = cursor
          ? {
              where: {
                createdAt: {
                  [Sequelize.Op.lt]: cursor,
                },
              },
            }
          : {};
          const categories = await models.Category.findAll({
            order: [['createdAt', 'DESC']],
            limit: limit + 1,
            ...cursorOptions
          });


          const hasNextPage = categories.length > limit;
          const edges = hasNextPage ? categories.slice(0, -1) : categories;
          
          return {
            edges,
            pageInfo: {                  
              hasNextPage,
              endCursor: toCursorHash(
                edges[edges.length - 1].createdAt.toString(),
              )
            },
          };
        },
        getCategory: async (parent, { id }, { models }) => {
          return await models.Category.findByPk(id);
        },
        getCategoryWithScores: async (parent, { id }, { models }) => {
          return await models.Category.findByIdWithScore(id);
        }
    }
};

export default resolver;
