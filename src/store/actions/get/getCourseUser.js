import getData from '../getData'

const path = `/course/user`
export const typeDefault = {
  courseUserList: 'getCourseUser'
}

export function getCourseUser(type, params) {

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