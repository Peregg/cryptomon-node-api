// @flow
import { check } from 'express-validator';
import { isEthereumAddress } from 'validator';

import { User } from 'models/User';

const isEthAddress = (address: string) => {
  if (!isEthereumAddress(address)) throw new Error('Invalid Ethereum address');
  return true;
};

const checkAddressInDb = async (address: string) => {
  const alreadyExists = await User.find({ address });

  if (alreadyExists.length) {
    throw new Error('Address already registered in DB');
  };
  return true;
};

const checkNicknameInDb = async (nickname: string) => {
  const sameNicknames = await User.find({ nickname }, (err, docs) => {
    if (err || !docs) throw new Error('User Not Found');
    return docs;
  });

  const alreadyExists = sameNicknames.reduce((acc, doc) => {
    const { nickname: userNickname } = doc.toObject();
    return userNickname !== '' && userNickname === nickname;
  }, false);

  if (alreadyExists) {
    throw new Error('Nickname already taken !');
  };
  return true;
};

export const registerValidators = [
  check('address')
    .exists()
    .notEmpty()
    .custom(isEthAddress)
    .custom(checkAddressInDb),
  check('nickname')
    .custom(checkNicknameInDb)
];

export const updateValidators = [
  check('address')
    .exists()
    .notEmpty()
    .custom(isEthAddress),
];
