import { combineReducers } from 'redux';
import { Framework } from './framework/reducer';
import { User } from './user/reducer';

export default combineReducers({
  user: User,
  framework: Framework,
});
