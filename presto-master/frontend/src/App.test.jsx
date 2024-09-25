import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock root element
const mockRoot = document.createElement('div');
mockRoot.id = 'root';
document.body.appendChild(mockRoot);

// test('renders login page by default', () => {
//   render(<App />);
//   const loginHeader = screen.getByText(/login/i);
//   expect(loginHeader).toBeInTheDocument();

test('navigates to register page when link is clicked', () => {
  render(<App />);
  const registerLink = screen.getByRole('link', { name: /register/i });
  userEvent.click(registerLink);
  const registerHeader = screen.getByText(/register/i);
  expect(registerHeader).toBeInTheDocument();
});

test('navigates to dashboard after successful login', () => {
  render(<App />);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: /login/i });

  userEvent.type(emailInput, 'test@example.com');
  userEvent.type(passwordInput, 'password123');
  userEvent.click(loginButton);

  const dashboardHeader = screen.getByText(/dashboard/i);
  expect(dashboardHeader).toBeInTheDocument();
});
