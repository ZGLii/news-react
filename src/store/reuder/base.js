import * as TYPES from '../action-types';
import _ from '@/assets/utils';
// 存储登录信息
let initial = {
  info: null
};

export default function baseReducer(state = initial, action) {
  state = _.clone(state);
  switch (action.type) {
    // 更新登录着信息
    case TYPES.BASE_INFO:
      state.info = action.info;
      break;
    default:
  }
  return state;
}