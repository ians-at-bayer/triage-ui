import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from "./AppContainer";
import {Provider} from "react-redux";
import store from "./store";
import phoenixNavBar from '@monsantoit/phoenix-navbar'
import {BrowserRouter, Route, Switch} from "react-router-dom";

function loadPhoenixNavBar() {
    return phoenixNavBar.install({
        element: document.querySelector('#nav'),
        suiteId: 'velocity',
        productId: 'support-triage-manager',
        cookie: 'support-triage-ui-cc',
    })
}

const loadAppController = (
      <Provider store={store}>
          <BrowserRouter basename="/support-triage-manager">
                <Route render={() => <AppContainer/>} />
          </BrowserRouter>
      </Provider>
)

loadPhoenixNavBar()
    .then(() => ReactDOM.render(loadAppController, document.getElementById('root')))
    .catch(err => console.error('Failed to load Phoenix nav bar', err))
