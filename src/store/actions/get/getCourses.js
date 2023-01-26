import getData from '../getData'

const path = `/course`
export const typeDefault = {
  userList: 'getCourseList'
}

export function getCourseList(type, params) {

    let defaultParams =  { 
      }
    if(!type)
      type = typeDefault

		
    if(params)
      defaultParams = {        
        ...defaultParams,
        ...params,
      }

    return getData(path, type, defaultParams)
}