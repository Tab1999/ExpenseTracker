import React, { useState } from 'react';
import classes from './Header.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { authActions } from '../store/auth';
import ProfileForm from './ProfileForm';

const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isLoggedIn);

 

  const logoutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <header className={classes.header}>
      <Link to='/'><h1>Expense-Tracker</h1></Link>
      {/* <h1>Expense-Tracker</h1> */}
      {isAuth && (
        <nav>
          <ul>
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
            <li>
              <Link to='/expense'>Expenses</Link>
            </li>
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          </ul>
        </nav>
      )}
      {/* {showProfileForm && <ProfileForm />} */}
    </header>
  );
};

export default Header;
