const defaultState = {
    error: null,
    load: false,
    data: '',
}

function getReducer(type, initialState) {
    return (state = initialState || defaultState, action) => {
        switch (action.type) {
            case type:
                return {
                    error: null,
                        load: true,
                        data: JSON.stringify(action.data.data),
                }
                case 'error_' + type:
                    return {
                        error: action.error,
                            load: true,
                            data: ''
                    }
                    case 'reset_' + type:
                        return {
                            ...state,
                            load: false
                        }
                        default:
                            return state
        }
    }
}


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    userList: getReducer('getUserList'),
    categoryList: getReducer('getCategoryList'),
		courseList: getReducer('getCourseList'),
		courseUserList: getReducer('getCourseUser'),
		topicCourse: getReducer('getTopicCourse'),
}