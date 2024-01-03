// AuthForm.js
import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

import classes from './Auth.module.css';
// import AuthContext from '../../store/auth-context';
import { authActions } from '../store/auth';


// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     isLoggedIn: false,
//     userId: null,
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     login(state, action) {
//       state.isLoggedIn = true;
//       state.userId = action.payload.userId;
//     },
//     logout(state) {
//       state.isLoggedIn = false;
//       state.userId = null;
//     },
//     setLoading(state, action) {
//       state.isLoading = action.payload;
//     },
//     setError(state, action) {
//       state.error = action.payload;
//     },
//     clearError(state) {
//       state.error = null;
//     },
//   },
// });

// export const { login, logout, setLoading, setError, clearError } = authSlice.actions;
// export default authSlice.reducer;

const Auth = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  // const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    dispatch(authActions.setLoading(true));
    try {
      let url;
      if (isLogin) {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDqvvVLUwvItKAYIAGjJUhOh1Enr7eDdI4';
      } else {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDqvvVLUwvItKAYIAGjJUhOh1Enr7eDdI4';
      }

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error.message || 'Authentication failed');
      }

      dispatch(authActions.login({ userId: data.localId , token: data.idToken}));
      history.replace('/');
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    } finally {
      dispatch(authActions.setLoading(false));
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDqvvVLUwvItKAYIAGjJUhOh1Enr7eDdI4', {
      method: 'POST',
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: enteredEmail,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Update failed');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Update successful:', data);
      })
      .catch((error) => {
        console.error('Update failed:', error.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div>
          <button onClick={handleForgotPassword}>Forgot Password</button>
        </div>
        <div className={classes.actions}>
          {!authState.isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {authState.isLoading && <p>Sending Requests...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Auth;
