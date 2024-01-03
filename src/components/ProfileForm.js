import React, { useRef, useState, useEffect } from 'react';
import classes from './ProfileForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
// import { authActions } from '../../store/authSlice';
import { authActions } from '../store/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const ProfileForm = () => {
  const newNameInputRef = useRef();
  const newUrlInputRef = useRef();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  const [userData, setUserData] = useState({
    displayName: '',
    photoUrl: '',
  });

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    const userDocRef = doc(db, 'users', userId);

    try {
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const user = userSnapshot.data();
        setUserData({
          displayName: user.displayName || '',
          photoUrl: user.photoUrl || '',
        });
      }
    } catch (error) {
      console.error('User data retrieval failed:', error.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredNewName = newNameInputRef.current.value;
    const enteredNewUrl = newUrlInputRef.current.value;

    const userDocRef = doc(db, 'users', userId);

    try {
      await setDoc(userDocRef, {
        displayName: enteredNewName,
        photoUrl: enteredNewUrl,
      });

      console.log('Update successful');
      fetchUserData();
      newNameInputRef.current.value = '';
      newUrlInputRef.current.value = '';
    } catch (error) {
      console.error('Update failed:', error.message);
    }
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setUserData({ ...userData, displayName: e.target.value });
  };

  const handleUrlChange = (e) => {
    e.preventDefault();
    setUserData({ ...userData, photoUrl: e.target.value });
  };

  return (
    <>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='new-name'>User name</label>
          <input type='text' id='new-name' ref={newNameInputRef} value={userData.displayName} onChange={handleNameChange} />
        </div>
        <div className={classes.control}>
          <label htmlFor='new-name'>Profile Url</label>
          <input type='text' id='new-url' ref={newUrlInputRef} value={userData.photoUrl} onChange={handleUrlChange} />
        </div>
        <div className={classes.action}>
          <button>Update</button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
