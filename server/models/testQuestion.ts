import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface TestQuestionAttributes {
  readonly id?: number;
  questionId: number;
  testId:number;
}

export interface TestQuestionInstance extends Sequelize.Instance<TestQuestionAttributes>, TestQuestionAttributes {
}

const testQuestion = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<TestQuestionInstance, TestQuestionAttributes> => {
  const attributes: SequelizeAttributes<TestQuestionAttributes> = {
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const TestQuestion = sequelize.define<TestQuestionInstance,TestQuestionAttributes>('testQuestions', attributes);
  // @ts-ignore
  return TestQuestion;
};

export default testQuestion;