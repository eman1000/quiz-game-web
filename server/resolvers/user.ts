import { IResolvers } from "graphql-tools";
import * as jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from './authorization';
import { authenticateFacebook } from "../passport";
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
          isAuthenticated,
          async (parent, args, { models, me }) => {
          if (!me) {
            return null;
          }
    
          return await models.User.findByPk(me.id);
        })
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
              console.log("userTTT", user.dataValues)
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
