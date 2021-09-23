import React from 'react';
import {ROUTE} from '../helper/constant'
import Home from "../pages/home/Home";
import Profile from "./profile/Profile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Messenger from "./messenger/Messenger";

const routes = [
    {
      exact: true,
      path: ROUTE.messenger,
      name: "Messenger",
      component: Messenger,
    },
    {
        exact: true,
        path: ROUTE.profile,
        name: "Profile",
        component: Profile,
    },
    {
        exact: true,
        path: ROUTE.home,
        name: "Profile",
        component: Home,
    },
    
  ];

function PrRouter(props) {
    return (
        <Switch>
            {routes.map((route, idx) => {
                return (
                    route.component && (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          render={(props) => <route.component {...props} />}
                        />
                      )
                    );
            })}

        </Switch>
    );
}

export default PrRouter;