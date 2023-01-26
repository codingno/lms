import getData from '../getData'

const path = `/category`
export const typeDefault = {
  userList: 'getCategoryList'
}

export function getCategoryList(type, params) {

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