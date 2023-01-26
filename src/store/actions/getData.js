import axios from 'axios'

// eslint-disable-next-line no-undef
const domain = process.env.DOMAIN || '/api'
function objectToUrlParams(params) {
    let urlParams = '?'
    const urlKeys = Object.keys(params)
		if(urlKeys.length == 0)
			return ""
    // eslint-disable-next-line array-callback-return
    urlKeys.map((item, index) => {
        if(index !== 0)
            urlParams += '&'
        urlParams += `${item}=${params[item]}`
    })
    return urlParams
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function(path , type , params )  {
    const paramsString = params ? objectToUrlParams(params) : ''
    const url = `${domain}${path}${paramsString}`
    const reducerType = type[Object.keys(type)[0]]
    return async dispatch => {
      try {
        const data = await axios.get(url)
        dispatch({ type : reducerType, data : data.data})
      }
      catch (error) {
        dispatch({ type : 'error_' + reducerType, error })
      }
    }
}