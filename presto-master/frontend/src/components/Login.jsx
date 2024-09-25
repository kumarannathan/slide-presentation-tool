import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BackgroundStyle = { backgroundImage: 'linear-gradient(to right bottom, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)', minHeight: '100vh' }

function loginUser (email, password) {
  return fetch('http://localhost:5005/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    });
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    loginUser(email, password)
      .then(data => {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        alert('Login successful!');
      })
      .catch(error => {
        alert(`Login failed: ${error.message}`);
      });
  };

  if (isLoggedIn) {
    navigate('/dashboard');
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={BackgroundStyle}>
      <div className="card p-4" style={{ width: '22rem' }}>
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Login</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-primary" onClick={handleLogin}>Sign in</button>
              <button type="button" className="btn btn-link" onClick={() => navigate('/register')}>Register User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
