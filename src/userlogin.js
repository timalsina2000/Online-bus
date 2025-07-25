// src/UserLogin.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { toast } from 'react-toastify';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const UserLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!', { position: 'top-center' });
      onLogin(); // Call onLogin to update login state
      history.push('/user-posts'); // Redirect to user posts page after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Error logging in.', { position: 'top-center' });
    }
  };


  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">Login</Button>
       
      </Form>
    </Container>
  );
};

export default UserLogin;
