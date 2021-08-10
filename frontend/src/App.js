import { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Nav from './components/Nav/nav';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Profile from './pages/profile';

import Dashboard from './pages/dashboard';
import Book from './pages/book';
import Shop from './pages/shop';
import index from './pages/index';

var retrievedLevel = localStorage.getItem('l_user');
var retrievedUser = localStorage.getItem('c_user');

function AuthApp() {
  return (
    <Switch>
      {retrievedLevel === 'admin' && <Route path="/dashboard" component={Dashboard} />}
      <Route path="/me" component={Profile} />
      <Route path="/Shop" component={Shop} />
      <Route path="/book/:id" component={Book} />
      <Route path="/" component={index} />
    </Switch>
  );
}

function UnAuthApp() {
  return (
    <Switch>
      <Route path="/auth/signup" component={Signup} />
      <Route path="/auth/signin" component={Signin} />
      <Route path="/Shop" component={Shop} />
      <Route path="/book/:id" component={Book} />
      <Route path="/" component={index} />
    </Switch>
  );
}

function App() {
  const { user } = useSelector((state) => state.auth);

  const history = useHistory();

  useEffect(() => {
    history.push('/');
  }, [user, retrievedUser, history]);

  return (
    <div>
      <Nav />
      {!user && !retrievedUser ? <UnAuthApp /> : <AuthApp />}
    </div>
  );
}

export default App;
