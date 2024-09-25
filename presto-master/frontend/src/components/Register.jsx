import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function registerUser (email, name, password) {
  return fetch('http://localhost:5005/admin/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, name, password })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    });
}

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: 'linear-gradient(to right bottom, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)', minHeight: '100vh' };
  const cardStyle = { width: '22rem', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    registerUser(email, name, password)
      .then(() => {
        setIsRegistered(true);
        alert(`User: ${name} registered successfully!`);
      })
      .catch(error => {
        alert(`Registration failed: ${error.message}`);
      });
  };

  if (isRegistered) {
    navigate('/login');
  }

  return (
    <div style={centerStyle}>
      <div className="card" style={cardStyle}>
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Register</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email</label>
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
            <div className="mb-3">
              <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPasswordInput"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordsMatch(true);
                }}
              />
              {!passwordsMatch && <div className="text-danger">Passwords do not match</div>}
            </div>
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRegister}
                disabled={!name || !email || !password || !confirmPassword}
              >
                Register
              </button>
              <button type="button" className="btn btn-link" onClick={() => navigate('/login')}>Cancel</button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
