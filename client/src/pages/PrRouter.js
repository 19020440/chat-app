import React, {useEffect} from 'react';
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
import {observer} from 'mobx-react-lite';
import {useStore} from '../hook'
import _ from 'lodash'
import CallVideo from '../components/CallVideo/CallVideo';
const routes = [
    {

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
        name: "Home",
        component: Home,
    },
  //   {
  //     exact: true,
  //     path: ROUTE.callvideo,
  //     name: "CallVideo",
  //     component: CallVideo,
  // },
    
  ];

  

const PrRouter = observer((props) => {
  const ActionStore = useStore('ActionStore')
  const AuthStore = useStore('AuthStore')
 

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

}) 

export default PrRouter;