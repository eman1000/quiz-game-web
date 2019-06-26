import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface TestAttributes {
  readonly id?: number;
  name: string;
  categoryId;
  pointsPerAnswer:number;
}

export interface TestInstance extends Sequelize.Instance<TestAttributes>, TestAttributes {
}

const test = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<TestInstance, TestAttributes> => {
  const attributes: SequelizeAttributes<TestAttributes> = {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
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
    },
    pointsPerAnswer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false,
      },
    }
  };
  
  const Test = sequelize.define<TestInstance, TestAttributes>('tests', attributes);

  // @ts-ignore
  // @ts-ignore
  Test.associate = models => {
    Test.hasMany(models.TestQuestion, {
      onDelete: 'CASCADE',
      foreignKey: 'testId'
    });
    models.TestQuestion.belongsTo(Test, {foreignKey: 'testId'})
    Test.hasMany(models.Match, { 
      onDelete: 'CASCADE',
      foreignKey: 'testId'
    });
    models.Match.belongsTo(Test, {foreignKey: 'testId'})
  };


  // @ts-ignore
  Test.getRandomTestByCategory = async  ({ categoryId, models })=>{

    console.log("CAT", categoryId)
    const test = await models.Test.findAll({
          
      where:{
        categoryId:categoryId
      },
      include: [{
        model: models.TestQuestion,
        required: true,
      include: [{
        model: models.Question,
        required: true,
        include: [{
          model: models.Answer,
          required: true
        }]
      }]
      }],
      order:sequelize.random()
    });
    //const finalTest = test.testQuestions.map((q)=>q.question);
    return test[0]
  }

  //@ts-ignore
  Test.getTestWithQuestionsById = async  ({ testId, models })=>{

    const test = await models.Test.findAll({
          
      where:{
        id:testId
      },
      include: [{
        model: models.TestQuestion,
        required: true,
      include: [{
        model: models.Question,
        required: true,
        include: [{
          model: models.Answer,
          required: true
        }]
      }]
      }]
    });
    //const finalTest = test.testQuestions.map((q)=>q.question);
    return test[0]
  }

  return Test;
};

export default test;