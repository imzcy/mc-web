import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const history = createBrowserHistory();

const store = createStore(
    connectRouter(history)(rootReducer), // new root reducer with router state
    {},
    applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        thunk
    )
);

window.rootReducer = rootReducer;

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();