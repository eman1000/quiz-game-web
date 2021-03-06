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
  role?:string;
  facebookId?:string;
  avatar?:string;
  lastSeen?:Date;
  coins?:number;
  gems?:number;
}

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
  generatePasswordHash:()=>string
}

const user = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<UserInstance, UserAttributes> => {
  const attributes: SequelizeAttributes<UserAttributes> = {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        notEmpty: false,
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
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false,
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
      allowNull: true,
      validate: {
        notEmpty: false,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
    facebookId:{
      type: DataTypes.STRING,
    },
    avatar:{
      type: DataTypes.TEXT,
    },
    lastSeen:{
      type: DataTypes.DATE,
    },
    coins: {
      type: DataTypes.INTEGER,
      defaultValue:0,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gems: {
      type: DataTypes.INTEGER,
      defaultValue:0,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };
  
  const User = sequelize.define<UserInstance, UserAttributes>('users', attributes);

  // @ts-ignore
  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };
  User.associate = models => {
    User.hasMany(models.Score, { onDelete: 'CASCADE' });
    User.hasMany(models.Result, { 
      onDelete: 'CASCADE',
      foreignKey: 'userId'
    });
    models.Result.belongsTo(User, {foreignKey: 'userId'})
    User.hasMany(models.MatchUser, { 
      onDelete: 'CASCADE',
      foreignKey: 'userId'
    });
    models.MatchUser.belongsTo(User, {foreignKey: 'userId'})
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
  // @ts-ignore
  User.upsertFbUser = async  ({ accessToken, refreshToken, profile })=>{
      let user = await User.findOne({
        where: { facebookId: profile.id },
      });

      // no user was found, lets create a new one
      if (!user) {
        
        const newUser = await User.create({
          username:null,
          firstName:profile.name.givenName,
          lastName:profile.name.familyName,
          email: profile.emails[0].value,
          gender:null,
          age:null,
          password:null,
          facebookId:profile.id,
          avatar:profile.photos[0].value
        });
        return newUser;
      }
    return user;
  };
  //@ts-ignore
  User.addToRewards = async  ({ id, points })=>{
    const user = await User.findOne({ where:{id} });
    if (!user) {
      throw new Error(`Couldn’t find user to reward with id ${id}`);
    }

    const gems = ((user.coins % 20 === 0)) ?  1 : null
    const result = await User.update({
      coins: user.coins + 2,
      gems: gems ? (user.gems + gems) : user.gems,
    },{
      where:{
        id
      },
      returning: true
    });
    return result[1];
  };
  User.beforeCreate(async user => {
    if(user.password){
      user.password = await user.generatePasswordHash();
    }
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