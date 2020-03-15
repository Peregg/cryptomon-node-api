// @flow

import { validationResult } from 'express-validator';
import type { $Response, NextFunction } from 'express';
import type { ReqType } from 'types/request';

import { User } from 'models/User';

export const registerUser = (req: ReqType<{ address: string, nickname: string }, null>, res: $Response, next: NextFunction) => {
  const {
    body: {
      address,
      nickname,
    },
  } = req;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.error = new Error(errors.array()[0].msg);
    return next();
  }

  const user = new User({ address, nickname });

	user.save(error => {
		if (error) {
      req.error = error;
      return next();
    };
    req.data = user;
    return next();
	});
};

export const getUser = async (req: ReqType<null, { address: string }>, res: $Response, next: NextFunction) => {
  const {
    query: {
      address,
    },
  } = req;

  try {
    const userDoc = await User.findOne({ address }, (err, user) => {
      if (err || !user) {
        req.error = new Error('User not found');
        return next();
      }
      return user;
    });

    const user = userDoc.toObject();
    req.data = user;
    return next();
  } catch (error) {
    req.error = error;
    return next();
  }
};

export const updateUser = async (req: ReqType<{ address: string, nickname: string}, null>, res: $Response, next: NextFunction) => {
  const {
    body: {
      address,
      nickname,
    }
  } = req;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.error = new Error(errors.array()[0].msg);
    return next();
  }

  const userUpdatedDoc = await User.findOneAndUpdate(
    { address },
    { $set: { nickname } },
    { new: true },
    (err, doc) => {
      if (err || !doc) {
        req.error = new Error('User not found');
        return next();
      }
      return doc;
    });

  const user = userUpdatedDoc.toObject();
  req.data = user;
  return next();
};
