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


const sequelize = new Sequelize("postgresql://emanmw:P%40ssw0rd@localhost/quiz_game",
  {
    dialect: 'postgres',
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

