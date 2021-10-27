// import style from "./App.module.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Manager from "./components/Manager/Manager";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./components/ResetPassword";
import User from "./components/User/User";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/reset_password/:token" component={ResetPassword} exact />
        <PrivateRoute path="/manager" component={Manager} exact />
        <PrivateRoute path="/user" component={User} exact />
      </Switch>
    </Router>
  );
};

export default App;
