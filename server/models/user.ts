import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';
import * as bcrypt from 'bcrypt';

export interface UserAttributes {
  readonly id?: number;
  username: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  age: number;
  email: string;
  password:string;
  messages?: Array<any>;
  role?:string
}

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
  generatePasswordHash:()=>string
}

const user = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<UserInstance, UserAttributes> => {
  const attributes: SequelizeAttributes<UserAttributes> = {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    }
  };
  
  const User = sequelize.define<UserInstance, UserAttributes>('users', attributes);

  // @ts-ignore
  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };
  // @ts-ignore
  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }
    return user;
  };
  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  });
  // @ts-ignore
  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };
  // @ts-ignore
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;