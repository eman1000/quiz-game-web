import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface ScoreAttributes {
  readonly id?: number;
  userId: number;
  categoryId:number;
  score: number;
}

export interface ScoreInstance extends Sequelize.Instance<ScoreAttributes>, ScoreAttributes {
}

const score = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<ScoreInstance, ScoreAttributes> => {
  const attributes: SequelizeAttributes<ScoreAttributes> = {
    userId: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    score: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const Score = sequelize.define<ScoreInstance, ScoreAttributes>('score', attributes);

  // @ts-ignore
  Score.associate = models => {
    Score.belongsTo(models.User);
    Score.belongsTo(models.Category);
  };


  //@ts-ignore
  Score.updateScore = async  ({ userId, categoryId })=>{
    const score = await Score.findOne({ where:{
      userId,
      categoryId
    } });
    if (!score) {
      const scoreCreateResult = await Score.create({
        userId,
        categoryId,
        score: 1
      });
      return scoreCreateResult[0];
    }

    const result = await Score.update({
      score: score.score + 1
    },{
      where:{
        userId,
        categoryId
      },
      returning: true
    });
    return result[1];
  };


  return Score;
};

export default score;