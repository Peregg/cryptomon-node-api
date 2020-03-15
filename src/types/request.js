// @flow

export type ReqType<BodyType, QueryType> = { body: BodyType, query: QueryType, error?: Error, data?: Object };
