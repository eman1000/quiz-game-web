import * as Sequelize from 'sequelize';
// import { CommentAttributes, CommentInstance } from 'models/Comment';
// import { PostAttributes, PostInstance } from 'models/Post';
import { UserAttributes, UserInstance } from '../../models/user';
import { MessageAttributes, MessageInstance } from '../../models/message';

export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  // Comment: Sequelize.Model<CommentInstance, CommentAttributes>;
  // Post: Sequelize.Model<PostInstance, PostAttributes>;
  User: Sequelize.Model<UserInstance, UserAttributes>;
  Message: Sequelize.Model<MessageInstance, MessageAttributes>;
}
