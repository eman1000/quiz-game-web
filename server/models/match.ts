import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface MatchAttributes {
  readonly id?: number;
  testId: number;
  status:string;
  nextMoveUserId:number;
  winnerId?:number;
  matchType:MatchType;
}

enum MatchType {
  "MULTI_PLAYER",
  "SINGLE_PLAYER"
}


export interface MatchInstance extends Sequelize.Instance<MatchAttributes>, MatchAttributes {

}

const match = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<MatchInstance, MatchAttributes> => {
  const attributes: SequelizeAttributes<MatchAttributes> = {
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nextMoveUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    matchType: {
      type: DataTypes.ENUM,
      values:["MULTI_PLAYER", "SINGLE_PLAYER"], 
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    winnerId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    }
  };
  
  const Match = sequelize.define<MatchInstance, MatchAttributes>('matches', attributes);

  // @ts-ignore
  Match.associate = models => {
    Match.hasMany(models.MatchUser, { 
      onDelete: 'CASCADE',
      foreignKey: 'matchId'
    });
    models.MatchUser.belongsTo(Match, {foreignKey: 'matchId'})
    Match.hasMany(models.Result, { 
      onDelete: 'CASCADE',
      foreignKey: 'matchId'
    });
    models.Result.belongsTo(Match, {foreignKey: 'matchId'})
  };

  // @ts-ignore
  Match.createMultiPlayerMatch = async (record, models) => {
    const test = await models.Test.getRandomTestByCategory({categoryId:record.categoryId, models})
    if (!test) {
      throw new Error(`Unable to get a test`);
    }
    const matchResult = await models.Match.create({
      testId:test.id,
      status:"pending",
      nextMoveUserId:record.playerOneId,
      matchType: record.matchType
    });
    if (!matchResult) {
      throw new Error(`Unable to create a match`);
    }
    const userMatch = await models.MatchUser.bulkCreate([{
      matchId:matchResult.id,
      userId:record.playerOneId
    },{
      matchId:matchResult.id,
      userId:record.playerTwoId
    }]);
    if (!userMatch) {
      throw new Error(`Unable to create  test question`);
    }
    return matchResult
  };
 // @ts-ignore
  Match.createSinglePlayerMatch = async (record, models) => {
    const test = await models.Test.getRandomTestByCategory({categoryId:record.categoryId, models})
    if (!test) {
      throw new Error(`Unable to get a test`);
    }
    const matchResult = await models.Match.create({
      testId:test.id,
      status:"pending",
      nextMoveUserId:record.playerOneId,
      matchType: record.matchType
    });
    if (!matchResult) {
      throw new Error(`Unable to create a match`);
    }
    const userMatch = await models.MatchUser.bulkCreate([{
      matchId:matchResult.id,
      userId:record.playerOneId
    }]);
    if (!userMatch) {
      throw new Error(`Unable to create  test question`);
    }
    return matchResult
  };
  return Match;
};

export default match;