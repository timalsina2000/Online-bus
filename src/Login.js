// src/Login.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { toast } from 'react-toastify';

const Login = ({onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async(e) => {
    e.preventDefault();
       
    try {
      await signInWithEmailAndPassword(auth,email,password);
      console.log("user login succesfully ");
      toast.success("user login succesfully!!! ",{
        position : "top-center",
      });
      onLogin();
      
      
    } catch (error) {
      console.log(error.message);
      
    }
  };
  const handleRegister = () => {
    history.push('/register'); 
  };
  const handleUser = () => {
    history.push('/default')
  }

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '20px',
      backgroundColor: '#69D9DD',
      marginTop: '200px',
      boxShadow: '1px 1px 10px 0px #4A4E4E'

    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      marginBottom: '5px',
      display: 'block',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      borderRadius: '20px',
      padding: '8px',
      boxSizing: 'border-box',
      marginBottom: '5px'
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize:'20px',
      borderRadius: '60px',
      marginTop: '25px'
      
    },
    link: {
      width: '100%',
      padding: '10px',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize:'20px',
      marginTop: '25px'
      
    },
    password: {
      
      width: '100%',
      padding: '10px',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize:'20px',
      marginTop: '25px'
      
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login to get access to the Admin page</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.formGroup}>
          <label style={styles.label} >email:</label>
          <input style={styles.input} type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Password:</label>
          <input style={styles.input} type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button style={styles.button} type="submit">Login</button>
      </form>
       <a onClick={handleRegister} style={styles.link}>Register </a>
       <a onClick={handleUser} style={styles.link}>Ticket booking </a>
       
       

    </div>
  );
};

export default Login;


























// import React from "react";

// const Login = ({ onLogin }) => {
//   const handleLogin = () => {
    
//     onLogin();
//   };

//   return (
//     <div>
//       <h2>Login Page</h2>
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;
