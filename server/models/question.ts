import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface QuestionAttributes {
  readonly id?: number;
  description: string;
  imageUrl:string;
  categoryId;
}

export interface QuestionInstance extends Sequelize.Instance<QuestionAttributes>, QuestionAttributes {
}

const question = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<QuestionInstance, QuestionAttributes> => {
  const attributes: SequelizeAttributes<QuestionAttributes> = {
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const Question = sequelize.define<QuestionInstance, QuestionAttributes>('questions', attributes);

  // @ts-ignore
  Question.associate = models => {

    Question.hasMany(models.Answer, {
        onDelete: 'CASCADE',
        foreignKey: 'questionId'
    });
   models.Answer.belongsTo(Question, {foreignKey: 'questionId'})

   Question.hasMany(models.TestQuestion, {
    onDelete: 'CASCADE',
    foreignKey: 'questionId'
  });
  Question.hasMany(models.Result, { 
    onDelete: 'CASCADE',
    foreignKey: 'questionId'
  });
  models.Result.belongsTo(Question, {foreignKey: 'questionId'})
  models.TestQuestion.belongsTo(Question, {foreignKey: 'questionId'})
  // @ts-ignore
  // Question.findByTestId = async testId => {
  //   let question = await Question.findAll({
  //     where: { testId: testId },
  //     include: [{
  //       model: models.Answer,
  //       required: true
  //     }]
  //   });
  //   return question;
  // };

    };


  return Question;
};

export default question;