import { IResolvers } from "graphql-tools";
import * as jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from './authorization';
import { authenticateFacebook } from "../passport";

export type IUser = {
  id:string,
  username:string,
  password:string,
  firstName:string,
  lastName:string,
  gender: "MALE" | "FEMALE",
  age:number,
  email:string,
  role?:string,
  facebookId?:string,
  avatar?:string,
  lastSeen?:string
}
const createToken = async (user, secret, expiresIn) => {


  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, secret, {
    expiresIn,
  });
};

const resolver:IResolvers = {
    Query: {
        getUsers: combineResolvers(
          isAuthenticated,
          async (parent, args, { models }) => {
          return await models.User.findAll();
        }),
        getUser: combineResolvers(
          isAuthenticated,
          async (parent, { id }, { models }) => {
          return await models.User.findByPk(id);
        }),
        getMe: combineResolvers(
          async (parent, args, { models, me }) => {
          if (!me) {
            return null;
          }
  
          return await models.User.findByPk(me.id);
        }),
        getRandomUserByLastSeen: combineResolvers(
          //isAuthenticated,
          async (parent, {userId}, { models }) => {
            const user = await models.User.findOne({ 
              where:{
                lastSeen:{
                  $gt: models.sequelize.literal("NOW()- '00:00:10'::interval")
                },
                id:{
                  $ne: userId
                }
              } 
              });
            if (!user) {
              throw new Error(`Couldn’t find user`);
            }
            console.log("opponent", JSON.stringify(user))
            return {opponent:user};
          }
        ),
        getOpponent: async (parent, { userId }, { models }) => {
          const opponent = await models.User.findOne({
            where:{
              id:userId
            }
          });
          return {opponent}
        },
    },
    Mutation: {
      signUp: async (
        parent,
        { 
          username,
          firstName,
          lastName,
          email,
          gender,
          age,
          password
        },
        { models, secret },
      ) => {
        const user = await models.User.create({
          username,
          firstName,
          lastName,
          email,
          gender,
          age,
          password
        });
  
        return { token: createToken(user, secret, '1y') };
      },
      signIn: async (
        parent,
        { login, password },
        { models, secret },
      ) => {
        const user = await models.User.findByLogin(login);
  
        if (!user) {
          throw new UserInputError(
            'No user found with this login credentials.',
          );
        }
  
        const isValid = await user.validatePassword(password);
  
        if (!isValid) {
          throw new AuthenticationError('Invalid password.');
        }
        return { token: createToken(user, secret, '30m') };
      },
      signInFacebook: async (
        parent,
        { facebookToken },
        { models, secret, req, res }
      ) => {
        req.body = {
          ...req.body,
          access_token: facebookToken,
        };
        try {
          // data contains the accessToken, refreshToken and profile from passport
          //@ts-ignore
          const { data, info } = await authenticateFacebook(req, res);
  
          if (data) {
            const user = await models.User.upsertFbUser(data);
    
            if (user) {
              return { token: createToken(user, secret, '30m'), user:user.dataValues };
            }
          }
          if (info) {
            switch (info.code) {
              case 'ETIMEDOUT':
                return (new Error('Failed to reach Facebook: Try Again'));
              default:
                return (new Error('something went wrong'));
            }
          }
          return (Error('server error'));
        } catch (error) {
          return error;
        }
      },
      updateUser: combineResolvers(
        isAuthenticated,
        async (parent, record:IUser, { models }) => {
          const user = await models.User.findOne({ where:{id:record.id} });
          if (!user) {
            throw new Error(`Couldn’t find author with id ${record.id}`);
          }
          const result = await models.User.update({
            ...record,
          },{
            where:{
              id:record.id
            },
            raw : true,
            returning: true,
            plain: true
          });
          return result[1];
        }
      ),
      deductReward: combineResolvers(
        isAuthenticated,
        async (parent, {id, key, amount}, { models }) => {
          const user = await models.User.findOne({ where:{id:id} });
          if (!user) {
            throw new Error(`Couldn’t find user with id ${id}`);
          }
          const result = await models.User.update({
            [key]:user[key] - amount,
          },{
            where:{
              id:id
            },
            raw : true,
            returning: true,
            plain: true
          });
          return result[1];
        }
      ),
      deleteUser: combineResolvers(
        isAdmin,
        async (parent, { id }, { models }) => {
          return await models.User.destroy({
            where: { id },
          });
        }
      )
    },
    User: {
      messages: async (user, args, { models }) => {
        return await models.Message.findAll({
          where: {
            userId: user.id,
          },
        });
      },
    }
};

export default resolver;
