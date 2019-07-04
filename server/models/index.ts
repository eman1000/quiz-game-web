// // let users = {
// //   1:{
// //       username: "doe",
// //       firstName: "John",
// //       lastName: "Doe",
// //       gender: "MALE",
// //       age: 20,
// //       email: "emanzoelife@gmail.com"
// //   },
// //   2:{

// //       username: "alex45",
// //       firstName: "Alex",
// //       lastName: "Johnas",
// //       gender: "MALE",
// //       age: 56,
// //       email: "alex@gmail.com"
// //   }
// // }
// // let messages = {
// //   1: {
// //     id: '1',
// //     text: 'Hello World',
// //     userId: '1',
// //   },
// //   2: {
// //     id: '2',
// //     text: 'By World',
// //     userId: '2',
// //   },
// // };

// // export default {
// //   users,
// //   messages,
// // };

// import {Sequelize} from 'sequelize';
// // import initMessage from "./message";
// // import initUser from "./user";

// const sequelize = new Sequelize(
//   process.env.DATABASE,
//   process.env.DATABASE_USER,
//   process.env.DATABASE_PASSWORD,
//   {
//     dialect: 'postgres',
//   },
// );

// const models = {
//   User: sequelize.import('./user'),
//   Message: sequelize.import('./message'),
// };

// Object.values(models).forEach((model: any) => {
//   if (model.associate) {
//     model.associate(models);
//   }
// });

// export { sequelize };

// export default models;

import * as Sequelize from 'sequelize';
import { DbInterface } from'../typings/DbInterface';
import UserFactory  from './user';
import MessageFactory  from './message';
import CategoryFactory  from './category';
import ScoreFactory  from './score';
import TestFactory  from './test';
import QuestionFactory  from './question';
import AnswerFactory  from './answer';
import MatchFactory  from './match';
import MatchUserFactory from './matchUser';
import ResultFactory from './result';
import TestQuestionFactory from './testQuestion'

//const sequelize = new Sequelize("postgresql://emanmw:P%40ssw0rd@localhost/quiz_game",
const sequelize = new Sequelize("postgresql://zkidswvtkidbjy:43566099b719ee19acbfa045691549e3dc55c4628f469216d10778213dbc7dda@ec2-54-221-198-156.compute-1.amazonaws.com/d3q6hgtl7jc29v",
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    }
  },
);
const createModels = (): DbInterface => {
  //const { database, username, password, params } = sequelizeConfig;

  const db: DbInterface = {
    sequelize,
    Sequelize,
    User: UserFactory(sequelize, Sequelize),
    Message: MessageFactory(sequelize, Sequelize),
    Category: CategoryFactory(sequelize, Sequelize),
    Score: ScoreFactory(sequelize, Sequelize),
    Test: TestFactory(sequelize, Sequelize),
    Question: QuestionFactory(sequelize, Sequelize),
    Answer: AnswerFactory(sequelize, Sequelize),
    Match: MatchFactory(sequelize, Sequelize),
    MatchUser: MatchUserFactory(sequelize, Sequelize),
    Result: ResultFactory(sequelize, Sequelize),
    TestQuestion:TestQuestionFactory(sequelize, Sequelize)

  };

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};

export { sequelize };

export default createModels;

