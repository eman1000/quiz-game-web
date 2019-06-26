import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
import { async } from 'q';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Query: {
      getScores: async (parent, { cursor, limit = 100, categoryId }, { models }) => {
          const cursorOptions = cursor
          ? {
              where: {
                createdAt: {
                  [Sequelize.Op.lt]: cursor,
                },
                categoryId:categoryId
              },
            }
          : {
            where: {
              categoryId:categoryId
            }
          };
          const scores = await models.Score.findAll({
            order: [['createdAt', 'DESC']],
            limit: limit + 1, 
            include:[{ 
              model:models.User,   
              required:false
            },{ 
              model:models.Category,   
              required:false
            }],     
            ...cursorOptions
          });


          const hasNextPage = scores.length > limit;
          const edges = hasNextPage ? scores.slice(0, -1) : scores;
          
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
      getScore: async (parent, { id }, { models }) => {
        return await models.Score.findByPk(id);
      },
      getUserScore: async (parent, { userId, categoryId }, { models }) => {
        const score = await models.Score.findOne({
          where:{
            categoryId,
            userId
          },
          include:[{ 
            model:models.User,   
            required:false
          }]
        });
        return score;
      }

    }
};

export default resolver;
