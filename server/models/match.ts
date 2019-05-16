import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface MatchAttributes {
  readonly id?: number;
  testId: number;
  status:string;
  nextMoveUserId:number;
  winnerId:number;
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




  return Match;
};

export default match;