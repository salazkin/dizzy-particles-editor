
import configReducer from "./configReducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
    config: configReducer
});

export default allReducers;
