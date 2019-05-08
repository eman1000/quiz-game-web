import * as express from "express";
import * as http from 'http';
import * as bodyParser from "body-parser";
import * as path from "path";
import * as cors from "cors";
import * as graphqlHTTP from "express-graphql";
import { AuthenticationError } from 'apollo-server';
import * as DataLoader from 'dataloader';

import * as jwt from 'jsonwebtoken';

import { ApolloServer, IResolvers } from 'apollo-server-express';
import schema from "./schema";
import resolvers from "./resolvers";
import createModels, { sequelize } from './models';

import "dotenv/config"

const batchUsers = async (keys, models) => {
  const users = await models.User.findAll({
    where: {
      id: {
        $in: keys,
      },
    },
  });

  return keys.map(key => users.find(user => user.id === key));
};

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};
const db = createModels();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function(req, res) {
  console.log(req.path)
  console.log(req.method)
  console.log(res.type("json"))
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


const server = new ApolloServer({
  typeDefs: schema,
  resolvers:resolvers as any,
  //@ts-ignore
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models:db,
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models:db,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys => batchUsers(keys, db)),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// app.use("/graphql", graphqlHTTP({
//   schema:schema,
//   rootValue:resolvers,
//   graphiql: true
// }))

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log('Apollo Server on http://localhost:5000/graphql');
  });
});

const createUsersWithMessages = async date => {
  await db.User.create(
    {
      username: 'doe',
      firstName: 'John',
      lastName: 'Doe',
      email:'doe@gmail.com',
      gender:'MALE',
      role: 'ADMIN',
      age:20,
      password:'1234567',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
      ],
    },
    {
      include: [db.Message],
    },
  );

  await db.User.create(
    {
      username: 'eman',
      firstName: 'Emmancipate',
      lastName: 'Musemwa',
      email:'eman@gmail.com',
      gender:'MALE',
      age:20,
      password:'1234567',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
      ],
    },
    {
      include: [db.Message],
    },
  );
};
