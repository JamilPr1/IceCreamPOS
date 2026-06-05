import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {reducer as AdminReducer} from "../Redux/Admin/reducer";
import {reducer as CustomerReducer} from "../Redux/Customer/reducer";

const combinedReducer = combineReducers({AdminReducer, CustomerReducer});


export const store = legacy_createStore(combinedReducer ,applyMiddleware(thunk));