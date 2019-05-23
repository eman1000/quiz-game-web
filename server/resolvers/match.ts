import * as Sequelize from 'sequelize';
import { IResolvers } from "graphql-tools";
import { toCursorHash } from "../utils";
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isAuthenticated } from './authorization';
import { withFilter } from 'graphql-subscriptions';
import pubsub, { EVENTS } from '../subscription';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

// import { isAdmin } from './authorization';
// import { authenticateFacebook } from "../passport";


const resolver:IResolvers = {
    Mutation:{
      createMatch: combineResolvers(
        //isAuthenticated,
        async (parent, record, { models }) => {
          console.log("RECORD", record)
          if(!!record.playerOneId && !!record.playerTwoId && !!record.categoryId){
            console.log("record", record)
            const test = await models.Test.getRandomTestByCategory({categoryId:record.categoryId, models})
            if (!test) {
              throw new Error(`Unable to get a test`);
            }
            const matchResult = await models.Match.create({
              testId:test.id,
              status:"pending",
              nextMoveUserId:record.playerOneId
            });
            if (!matchResult) {
              throw new Error(`Unable to create a match`);
            }
            const userMatch = await models.MatchUser.bulkCreate([{
              matchId:matchResult.id,
              userId:record.playerOneId
            },{
              matchId:matchResult.id,
              userId:record.playerTwoId
            }]);
            if (!userMatch) {
              throw new Error(`Unable to create  test question`);
            }
            return matchResult
          }else{
            throw new Error(`Unable to create a match`)
          }
        }
      ),
      updateMatch: combineResolvers(
        //isAuthenticated,
        async (parent, record, { models }) => {
          const match = await models.Match.findOne({ where:{id:record.id} });
          if (!match) {
            throw new Error(`Couldn’t find match with id ${record.id}`);
          }
          const result = await models.Match.update({
            ...record,
          },{
            where:{
              id:record.id
            },
            raw : true,
            returning: true,
            plain: true
          });
          pubsub.publish(EVENTS.MATCH.UPDATED, {
            matchUpdated: { match:result[1] },
          });
          return result[1];
        }
      )
    },
    Query: {
      getMatch: async (parent, { matchId }, { models }) => {
        return await models.Match.findByPk(matchId);
      }
    },
    Subscription: {
      matchUpdated: {
        subscribe: withFilter(() => pubsub.asyncIterator(EVENTS.MATCH.UPDATED), (payload, variables) => {
          return payload.matchUpdated.match.id == variables.matchId;
        }),
      }
    }
};

export default resolver;
