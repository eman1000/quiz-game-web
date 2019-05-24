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

          console.log("RECORD", record)
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
          if (!result) {
            throw new Error(`Couldn’t update match`);
          }
          const updatedMatch = await models.Match.findOne({ 
            where:{id:record.id},
            include:[{
              model:models.MatchUser,
              required:true
            },{
              model:models.Result,
              required:true
            }]
          });
          if (!updatedMatch) {
            throw new Error(`Couldn’t update match`);
          }
          //who one
          const playerOneUserId = updatedMatch.matchUsers[0].userId;
          const playerTwoUserId = updatedMatch.matchUsers[1].userId || null;

          const results = updatedMatch.results;
          if(results && updatedMatch.status === "complete"){
            const playerOneCount = results.filter((result)=>result.userId == playerOneUserId && result.matchId == record.id && result.isCorrect).length;
            const playerTwoCount = results.filter((result)=>result.userId == playerTwoUserId && result.matchId == record.id && result.isCorrect).length || 0
            
            console.table([{playerOneCount, playerTwoCount}])
            const winnerUpdate = await models.Match.update({
              winnerId:(playerOneCount > playerTwoCount) ? playerOneUserId : playerTwoUserId,
            },{
              where:{
                id:record.id
              },
              raw : true,
              returning: true,
              plain: true
            });

            console.log("winnerUpdate", winnerUpdate[1]);
            pubsub.publish(EVENTS.MATCH.UPDATED, {
              matchUpdated: { match:winnerUpdate[1] },
            });
            return winnerUpdate[1]
          }
         
          //console.log("updatedMatch", JSON.stringify(updatedMatch));
          pubsub.publish(EVENTS.MATCH.UPDATED, {
            matchUpdated: { match:updatedMatch },
          });
          return updatedMatch;
        }
      )
    },
    Query: {
      getMatch: async (parent, { matchId }, { models }) => {
        
        // const match = await models.Match.findOne({ 
        //   where:{id:matchId},
        //   include:[{
        //     model:models.MatchUser,
        //     required:true
        //   },{
        //     model:models.Result,
        //     required:true
        //   }]
        // });
        const match = await models.Match.findOne({ 
          where:{id:matchId},
          include:[{
            model:models.MatchUser,
            required:true
          }]
        });
        console.log("MATCH", JSON.stringify(match))
        return match;
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
