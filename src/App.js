
import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './components/Auth';
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import ProfileForm from './components/ProfileForm';
import ExpenseForm from './components/ExpenseForm';
import StartingPageContent from './components/StartingPage';

function App() {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Router>
      <Header />
      <Switch>
       <Route path='/' exact>
          {isAuth &&  <StartingPageContent/>}
        </Route>
        <Route path='/profile'>
          {isAuth && <ProfileForm />}
        </Route>
        <Route path='/expense'>
          {isAuth && <ExpenseForm/>}
        </Route>
      </Switch>
      {!isAuth && <Auth />}
      
    </Router>
  );
}

export default App;

