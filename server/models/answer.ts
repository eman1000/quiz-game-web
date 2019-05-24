import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface AnswerAttributes {
  readonly id?: number;
  description: string;
  imageUrl:string;
  isCorrect:boolean;
  questionId;
}

export interface AnswerInstance extends Sequelize.Instance<AnswerAttributes>, AnswerAttributes {
}

const answer = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<AnswerInstance, AnswerAttributes> => {
  const attributes: SequelizeAttributes<AnswerAttributes> = {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const Answer = sequelize.define<AnswerInstance, AnswerAttributes>('answers', attributes);

  // @ts-ignore
  Answer.associate = models => {
    Answer.hasMany(models.Result, { 
      onDelete: 'CASCADE',
      foreignKey: 'answerId'
    });
    models.Result.belongsTo(Answer, {foreignKey: 'answerId'})
  };




  return Answer;
};

export default answer;