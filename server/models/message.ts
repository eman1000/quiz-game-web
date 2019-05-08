import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';



export interface MessageAttributes{
  id?: number;
  text:string;
  user?:any;
}


export interface MessageInstance extends Sequelize.Instance<MessageAttributes>, MessageAttributes {
  
}

const message = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<MessageInstance, MessageAttributes> => {
  const attributes: SequelizeAttributes<MessageAttributes> = {
    text: {
      type: DataTypes.STRING,
      validate: { notEmpty: {
        args: true,
          msg: 'A message has to have a text.',
      } }
    }
  };
  
  const Message = sequelize.define<MessageInstance, MessageAttributes>('messages', attributes);

  // @ts-ignore
  Message.associate = models => {
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;