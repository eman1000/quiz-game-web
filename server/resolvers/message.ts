import uuidv4 from 'uuid/v4';
import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { combineResolvers } from 'graphql-resolvers';
import pubsub, { EVENTS } from '../subscription';

import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

const resolver:IResolvers = {
    Query: {
        getMessages: async (parent, { cursor, limit = 100 }, { models }) => {
          const cursorOptions = cursor
          ? {
              where: {
                createdAt: {
                  [Sequelize.Op.lt]: cursor,
                },
              },
            }
          : {};
          const messages = await models.Message.findAll({
            order: [['createdAt', 'DESC']],
            limit: limit + 1,
            ...cursorOptions
          });

          const hasNextPage = messages.length > limit;
          const edges = hasNextPage ? messages.slice(0, -1) : messages;
          
          return {
            edges: messages,
            pageInfo: {                  
              hasNextPage,
              endCursor: toCursorHash(
                edges[edges.length - 1].createdAt.toString(),
              )
            },
          };
        },
        getMessage: async (parent, { id }, { models }) => {
          return await models.Message.findByPk(id);
        }
    },
    Mutation: {
      createMessage: combineResolvers(
        isAuthenticated,
        async (parent, { text }, { models, me }) => {
          const message = await models.Message.create({
            text,
            userId: me.id,
          });
  
          pubsub.publish(EVENTS.MESSAGE.CREATED, {
            messageCreated: { message },
          });
  
          return message;
        },
      ),
  
      deleteMessage: combineResolvers(
        isAuthenticated,
        isMessageOwner,
        async (parent, { id }, { models }) => {
          return await models.Message.destroy({ where: { id } });
        }
      ),
    },
    Message: {
      user: async (message, args, { loaders }) => {
        return await loaders.user.load(message.userId);
      },
    },
    Subscription: {
      messageCreated: {
        subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
      },
    }  
    
};

export default resolver;