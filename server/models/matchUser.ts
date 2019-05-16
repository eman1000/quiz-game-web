import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface MatchUserAttributes {
  readonly id?: number;
  userId: number;
  matchId:string;
}

export interface MatchUserInstance extends Sequelize.Instance<MatchUserAttributes>, MatchUserAttributes {
}

const matchUser = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<MatchUserInstance, MatchUserAttributes> => {
  const attributes: SequelizeAttributes<MatchUserAttributes> = {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const MatchUser = sequelize.define<MatchUserInstance,MatchUserAttributes>('matchUsers', attributes);

  // @ts-ignore
  return MatchUser;
};

export default matchUser;