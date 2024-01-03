
import classes from './StartingPage.module.css';
import Auth from './Auth';
import { useDispatch, useSelector } from 'react-redux';

const StartingPageContent = () => {
  const token = useSelector((state)=> state.auth.token);

   const handleVerifyEmail = (e) => {
    e.preventDefault();

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDqvvVLUwvItKAYIAGjJUhOh1Enr7eDdI4', {
      method: 'POST',
      body: JSON.stringify({
        requestType: "VERIFY_EMAIL",
        idToken: token
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Update failed');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Email Verified:', data);
       
      })
      .catch((error) => {
        console.error('Verification Failed:', error.message);
      });
  }

  return (
    <section className={classes.starting}>
      <h1>Welcome on Board!</h1>
      <form>
        <button onClick={handleVerifyEmail}>Verify Email</button>
      </form>
    </section>
  );
};

export default StartingPageContent;
