import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface ResultAttributes {
  readonly id?: number;
  matchId: number;
  userId:number;
  questionId:number;
  answerId:number;
  isCorrect:boolean;
}



export interface ResultInstance extends Sequelize.Instance<ResultAttributes>, ResultAttributes {
}

const result = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<ResultInstance, ResultAttributes> => {
  const attributes: SequelizeAttributes<ResultAttributes> = {
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    answerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const Result = sequelize.define<ResultInstance, ResultAttributes>('results', attributes);

  // @ts-ignore





  return Result;
};

export default result;