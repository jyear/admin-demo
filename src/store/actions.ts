import store from '@/store';
import * as Framework from './framework/action';
import * as User from './user/action';

const files = {
  user: User,
  framework: Framework,
};
const actObjs = {};

Object.keys(files).forEach(name => {
  if (!actObjs[name]) {
    actObjs[name] = {};
  }
  Object.keys(files[name]).forEach(cname => {
    actObjs[name][cname] = params => {
      return store.dispatch(files[name][cname](params));
    };
  });
});

export default actObjs as Store.Action;
