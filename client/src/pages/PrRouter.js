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

  

const PrRouter = observer((props) => {
  const ActionStore = useStore('ActionStore')
  const AuthStore = useStore('AuthStore')
  useEffect(() => {
    const getConversations = async () => {
      if(!_.isEmpty(AuthStore.user) && _.isEmpty(ActionStore.conversations)) {
        try {
          // const res = await axios.get("/conversations/" + user._id);
          const res = await ActionStore.action_getConversation(AuthStore.user?._id);
          // ActionStore.action_setLastText(res);
        } catch (err) {
          console.log(err);
        } 
      }
      
    };
    getConversations();
  }, []);

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