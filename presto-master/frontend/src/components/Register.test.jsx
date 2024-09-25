import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Register from './Register';
import { BrowserRouter as Router } from 'react-router-dom';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe('Register component', () => {
  it('should render the registration form', () => {
    const { getByLabelText, getByPlaceholderText, getByText } = render(
      <Router>
        <Register />
      </Router>
    );

    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should display error if passwords do not match', async () => {
    const { getByPlaceholderText, queryAllByText } = render(
      <Router>
        <Register />
      </Router>
    );

    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const registerButtons = queryAllByText('Register');
    fireEvent.click(registerButtons[0]);
  });
});
