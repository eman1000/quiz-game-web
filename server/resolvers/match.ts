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
          //multiplayer
          if(!!record.playerOneId && !!record.playerTwoId && !!record.categoryId){
            const matchResult = await models.Match.createMultiPlayerMatch(record, models);
            return matchResult
          }else if(!!record.playerOneId && !record.playerTwoId && !!record.categoryId){
            const matchResult = await models.Match.createSinglePlayerMatch(record, models);
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
            include:[{
              model:models.MatchUser,
              required:true,
              include:[{
                model:models.User,
                required:true
              }]
            },{
              model:models.Test,
              required:true,
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
              }]
            }],
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
              required:true,
              include:[{
                model:models.User,
                required:true
              }]
            },{
              model:models.Test,
              required:true,
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
              }]
            }]
          });
          
          if (!updatedMatch) {
            throw new Error(`Couldn’t find updated match`);
          }
          //who one
          const playerOneUserId = updatedMatch.matchUsers[0].userId;
          const playerTwoUserId = updatedMatch.matchUsers[1] ? updatedMatch.matchUsers[1].userId : null;

          const results = await models.Result.findAll({
            where:{
              matchId:record.id
            }
          });

          const testLength = updatedMatch.test.testQuestions.length;

          if(results && updatedMatch.status === "complete"){
            const playerOneCount = results.filter((result)=>result.userId == playerOneUserId && result.matchId == record.id && result.isCorrect).length;   
            
            //multiplayer winner
            if(playerTwoUserId !== null){
              const playerTwoCount = results.filter((result)=>result.userId == playerTwoUserId && result.matchId == record.id && result.isCorrect).length;
              const winnerUpdate = await models.Match.update({
                winnerId:(playerOneCount > playerTwoCount) ? playerOneUserId : playerTwoUserId,
              },{
                where:{
                  id:record.id
                },
                include:[{
                  model:models.MatchUser,
                  required:true,
                  include:[{
                    model:models.User,
                    required:true
                  }]
                },{
                  model:models.Test,
                  required:true,
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
                  }]
                }],
                raw : true,
                returning: true,
                plain: true
              });
              pubsub.publish(EVENTS.MATCH.UPDATED, {
                matchUpdated: { match:winnerUpdate[1] },
              });
              return winnerUpdate[1]
            }else{
              //single player winner
              const winnerUpdate = await models.Match.update({
                winnerId:(playerOneCount > testLength/2) ? playerOneUserId : null,
              },{
                where:{
                  id:record.id
                },
                raw : true,
                returning: true,
                plain: true
              });
  

              console.log("AAAAAAAAAA", JSON.stringify(winnerUpdate))
              pubsub.publish(EVENTS.MATCH.UPDATED, {
                matchUpdated: { match:winnerUpdate[1] },
              });
              return winnerUpdate[1]
            }

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
            required:true,
            include:[{
              model:models.User,
              required:true
            }]
          },{
            model:models.Test,
            required:true,
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
            }]
          }]
        });
        return match;
      }
    },
    Subscription: {
      matchUpdated: {
        subscribe: withFilter(() => pubsub.asyncIterator(EVENTS.MATCH.UPDATED), (payload, variables) => {
          return payload.matchUpdated.match.id == variables.matchId;
        }),
      },
      matchRequested: {
        subscribe: withFilter(() => pubsub.asyncIterator(EVENTS.MATCH.UPDATED), (payload, variables) => {
          return payload.matchRequested.match.nextMoveUserId == variables.userId && payload.matchRequested.match.status == "pending";
        }),
      }
    }
};

export default resolver;
