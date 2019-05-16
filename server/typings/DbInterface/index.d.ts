import * as Sequelize from 'sequelize';
// import { CommentAttributes, CommentInstance } from 'models/Comment';
// import { PostAttributes, PostInstance } from 'models/Post';
import { UserAttributes, UserInstance } from '../../models/user';
import { MessageAttributes, MessageInstance } from '../../models/message';
import { CategoryAttributes, CategoryInstance } from '../../models/category';
import { ScoreAttributes, ScoreInstance } from '../../models/score';
import { TestAttributes, TestInstance } from '../../models/test';
import { QuestionAttributes, QuestionInstance } from '../../models/question';
import { AnswerAttributes, AnswerInstance } from '../../models/answer';
import { MatchAttributes, MatchInstance } from '../../models/match';
import { MatchUserAttributes, MatchUserInstance} from '../../models/matchUser';
import { ResultAttributes, ResultInstance} from '../../models/result';
import { TestQuestionAttributes, TestQuestionInstance} from '../../models/testQuestion';


export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  // Comment: Sequelize.Model<CommentInstance, CommentAttributes>;
  // Post: Sequelize.Model<PostInstance, PostAttributes>;
  User: Sequelize.Model<UserInstance, UserAttributes>;
  Message: Sequelize.Model<MessageInstance, MessageAttributes>;
  Category: Sequelize.Model<CategoryInstance, CategoryAttributes>;
  Score: Sequelize.Model<ScoreInstance, ScoreAttributes>;
  Test: Sequelize.Model<TestInstance, TestAttributes>;
  Question: Sequelize.Model<QuestionInstance, QuestionAttributes>;
  Answer: Sequelize.Model<AnswerInstance, AnswerAttributes>;
  Match: Sequelize.Model<MatchInstance, MatchAttributes>;
  MatchUser: Sequelize.Model<MatchUserInstance, MatchUserAttributes>;
  Result: Sequelize.Model<ResultInstance, ResultAttributes>;
  TestQuestion: Sequelize.Model<TestQuestionInstance, TestQuestionAttributes>;
}
