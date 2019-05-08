import { IResolvers } from "graphql-tools";
import * as jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};


const resolver:IResolvers = {
    Query: {
        getUsers: async (parent, args, { models }) => {
          return await models.User.findAll();
        },
        getUser: async (parent, { id }, { models }) => {
          return await models.User.findByPk(id);
        },
        getMe: async (parent, args, { models, me }) => {
          if (!me) {
            return null;
          }
    
          return await models.User.findByPk(me.id);
        }
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
  
        return { token: createToken(user, secret, '30m') };
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
