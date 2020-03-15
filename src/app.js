// @flow

'use-strict';
import "@babel/polyfill";

import express from 'express';
import http from 'http';
import Web3 from 'web3';
import cors from 'cors';
import mongoose from 'mongoose';

import router from 'routers/index';
import CryptomonContractDefinition from 'contracts/CryptomonContract';

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const contractAddress = '0xDe23f8448123a4273834c92BA5024BfE15E84116';

const CryptomonContract = new web3.eth.Contract(CryptomonContractDefinition.abi, contractAddress);
const MONGODB_PATH = 'mongodb://127.0.0.1:27017/cryptomonsDB';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(MONGODB_PATH, { useNewUrlParser: true });
const db = mongoose.connection;
const dbError = () => {
	throw new Error('Unable to connect to database');
};
db.on('error', dbError);
db.once('open', () => console.log('cc mongo'));
app.use(router);
const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
	// const user = new User({ address: accounts[0], nickname: 'Peregg' });
	// user.save(err => {
	// 	if (err) throw err;
	// 	console.log(user);

	// });
  const rawCryptomons = await CryptomonContract.methods.getMyCryptomons().call({ from: accounts[0] });
	const cmons = rawCryptomons.reduce((acc, [id, name, type]) => [ ...acc, { id, name, type }], []);
  console.log(accounts, cmons);
};
getAccount();

http
  .createServer(app)
  .listen(HTTP_PORT, () => console.log(`Server listening on ${HTTP_PORT}`)); //eslint-disable-line no-console
