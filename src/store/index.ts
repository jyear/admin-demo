import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from '@/middlewares/promise';
import reduces from '@/store/reducers';

const middlewareList = [promiseMiddleware, thunkMiddleware];

const store = createStore(reduces, applyMiddleware(...middlewareList));

export default store;
