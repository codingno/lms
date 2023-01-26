import * as getReducer from './getReducer'
import userReducer from './userReducer'
import refreshReducer from './refreshReducer'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    user: userReducer,
		refresh: refreshReducer,
    ...getReducer.default,
}