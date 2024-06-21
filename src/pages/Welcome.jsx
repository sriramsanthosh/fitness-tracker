import React, { useState } from 'react'
import { GoogleProvider, auth } from '../config/firebase'
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import FullScreenLoader from '../components/FullScreenLoader';


export default function Welcome() {
  const Navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoader(true);
      const result = await signInWithPopup(auth, GoogleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const response = await Axios.post(`${import.meta.env.VITE_SERVER}/register`, {
        credential: credential,
        user: result.user
      });

      if (response.status === 200) {
        message.success("Sign-in successful!");
        localStorage.setItem("token", response.data.token);
        const user = response.data.user;
        console.log(user);
        localStorage.setItem("name", user.displayName);
        localStorage.setItem("email", user.email);
        localStorage.setItem("photoURL", user.photoURL);
        Navigate("/dashboard");
      } else {
        message.error(response.data.message || "Failed to register user.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      message.error(error.message || "An error occurred during sign-in.");
    }
    setLoader(false);
  }
  return (
    <div className="text-center">
      {loader && <FullScreenLoader />}
      <h1 className="fsh">Weight Tracker</h1>
      <p>Track your Weight from today</p>
      <button onClick={handleSignIn} className='signinWithButton' type="button" >
        <i className="fa-brands fa-google"></i> Sign in with Google
      </button>
    </div>
  )
}


