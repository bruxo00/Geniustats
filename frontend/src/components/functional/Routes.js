import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import ShowStats from '../pages/ShowStats';

const Routes = (props) => {
    const location = useLocation();

    const loggedOutRouting = (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/stats" component={ShowStats} />
        </Switch>
    );

    return loggedOutRouting;
}

export default Routes;