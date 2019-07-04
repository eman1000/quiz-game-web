import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface CategoryAttributes {
  readonly id?: number;
  name: string;
  description: string;
  thumbnail: string;
  backgroundImageUrl:string;
  catKey:string;
}

export interface CategoryInstance extends Sequelize.Instance<CategoryAttributes>, CategoryAttributes {
  generatePasswordHash:()=>string
}

const category = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<CategoryInstance, CategoryAttributes> => {
  const attributes: SequelizeAttributes<CategoryAttributes> = {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    backgroundImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    catKey: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const Category = sequelize.define<CategoryInstance, CategoryAttributes>('categories', attributes);

  // @ts-ignore
  // @ts-ignore
  Category.associate = models => {
    Category.hasMany(models.Score, {
       onDelete: 'CASCADE',
       foreignKey: 'categoryId'
    });
    models.Score.belongsTo(Category, {foreignKey: 'categoryId'})
    
  Category.hasMany(models.Question, {
      onDelete: 'CASCADE',
      foreignKey: 'categoryId'
   });
   models.Test.belongsTo(Category, {foreignKey: 'categoryId'})
    // @ts-ignore
    Category.findByIdWithScore = async id => {
      let category = await Category.findOne({
        where: { id: id },
        include: [{
          model: models.Score,
          required: true
         }]
      });
      return category;
    };
  };

  return Category;
};

export default category;