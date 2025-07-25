// Register.js

import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth,db } from './firebase';
import {setDoc,doc} from "firebase/firestore";
import { toast } from 'react-toastify';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister =async (e) => {
    e.preventDefault();
      try {
       await createUserWithEmailAndPassword( auth,email,password);
        const user = auth.currentUser;
        console.log(user);
        if(user){
          await setDoc (doc(db,"Users",user.uid),{
            email : user.email,
            username: username,
            password:password,
          });
        }
        console.log(user);
        console.log('uses is registerd succesfully');
        toast.success("user registered succesfully!!! ",{
          position : "top-center",
        });
      } catch (error) {
        console.log(error.message);
        toast.success("user registered succesfully!!! ",{
          position : "top-center",
        });
      } };


  const styles = {
    container: {
      display: 'flex',
      backgroundColor: '#69D9DD',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      maxWidth: '500px',
      margin: '140px auto',
      border: '1px solid #ddd',
      borderRadius: '30px',
      boxShadow: '1px 1px 10px 0px #4A4E4E'
    },
    heading: {
      marginBottom: '20px',
      fontSize: '24px',
      color: '#333',
    },
    form: {
      width: '100%',
      borderRadius: '30px',
    },
    formGroup: {
      marginBottom: '15px',
      borderRadius: '30px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '14px',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '40px',
      boxSizing: 'border-box',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007BFF',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '30px',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Username:</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={styles.button} type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
