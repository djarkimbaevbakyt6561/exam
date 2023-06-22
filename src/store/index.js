import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { checkoutSlice } from './checkout'

const rootReducer = combineReducers({
    checkout: checkoutSlice.reducer,
})
export const store = createStore(rootReducer, applyMiddleware(thunk))
