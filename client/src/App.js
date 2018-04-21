import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import AddCollection from "./pages/AddCollection";
// import Collection from "./pages/Collection";
// import Dashboard from "./pages/Dashboard";
// import HomePage from "./pages/HomePage";
// import Profile from "./pages/Profile";
// import Search from "./pages/Search";
// import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
// import UpdateCollection from "./pages/UpdateCollection";
// import Footer from "./components/Footer";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={SignIn} />
      </Switch>
    </div>
  </Router>
);

export default App;
