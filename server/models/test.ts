import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface TestAttributes {
  readonly id?: number;
  name: string;
  categoryId;
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
  };




  return Test;
};

export default test;