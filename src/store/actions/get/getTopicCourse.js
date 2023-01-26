import getData from '../getData'

const path = `/topic/list`
export const typeDefault = {
  topicCourse: 'getTopicCourse'
}

export function getTopicCourse(type, params) {

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