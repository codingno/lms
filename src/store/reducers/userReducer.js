const initialState = {
	load : false,
	isLogin : false,
	data : '',
	error : false,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action)  => {
	switch(action.type) {
		case 'getUserInfo':
			return {
				load : true,
				isLogin : true,
				data : action.data,
			}
		case 'error_getUserInfo':
			return {
				load : true,
				isLogin : false,
				data : '',
        error: action.error,
			}			
		case 'logout':
			return {
				load : false,
				isLogin : false,
				data : '',
        error: false,
			}			
		default:
			return state
	}
}