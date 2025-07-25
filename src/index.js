import "./polyfills";
import React, { useState } from "react";
import { createRoot } from 'react-dom/client';
import * as serviceWorker from "./serviceWorker";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import "./assets/base.scss";
import Register from "./Register";
import UserPosts from "./UserProfile";
import Main from "./DemoPages/Main";
import Login from "./Login";
import Home from "./HomePage";
import configureStore from "./config/configureStore";
import { Provider } from "react-redux";
import Ticket from "./Ticket";
import PaymentForm from "./Payment";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";

const store = configureStore();
const rootElement = document.getElementById("root");

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Provider store={store}>
    <HashRouter>
    <Switch>
        <Route path="/register" component={Register} />
        <Route path="/user" component={UserPosts} />
        <Route path="/ticket" component={Ticket} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/payment-failure" component={PaymentFailure} />
        <Route path="/payment" component={PaymentForm} />
       
       
        <Route exact path="/default" component={Home} /> 
         
        

        <Route path="/"  >   {isLoggedIn ? <Main onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} </Route>

        
        

        

       
        
      </Switch>
    </HashRouter>
  </Provider>
  );
};

createRoot(rootElement).render(<App />);

serviceWorker.unregister();
