// @flow

import type { $Response } from 'express';

export const responseMiddleware = (req: { data?: Object, error?: Object }, res: $Response) => {
  const {
    data = null,
    error = null,
  } = req;

  if (data) {
    return res.send({
      success: true,
      payload: data,
    });
  };

  if (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  };
};
