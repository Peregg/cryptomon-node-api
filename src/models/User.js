// @flow

import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  address: String,
  nickname: String,
});

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};

UserSchema.options.toObject.transform = (doc, { _id: id, nickname, address }) => {
  console.log('cc user schema', { id, nickname });

  return { id, nickname, address };
};

export const User = model('User', UserSchema);
