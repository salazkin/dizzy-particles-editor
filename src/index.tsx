import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import allReducers from './reducers/allReducers';
import App from './components/App';

const store = createStore(
    allReducers,
    window["__REDUX_DEVTOOLS_EXTENSION__"] && window["__REDUX_DEVTOOLS_EXTENSION__"]()
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
