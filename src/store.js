import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import reducer from "./reducer";

// extension to debug on Chrome browser
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// See README-thunk.md for how/why we use redux-thunk
const storeWithMiddleware = applyMiddleware(thunk)

const store = createStore(
    reducer,
    storeEnhancers(storeWithMiddleware)
)

export default store