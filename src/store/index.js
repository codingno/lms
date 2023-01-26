import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import * as reducers from './reducers'

// eslint-disable-next-line import/no-anonymous-default-export
export default (preloadState) =>  {
    if(preloadState)    
     return createStore(combineReducers(reducers.default), preloadState, applyMiddleware(thunk))    
    return createStore(combineReducers(reducers.default), applyMiddleware(thunk))
};