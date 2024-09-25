import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

test('renders switch theme button', () => {
  render(<Dashboard />);
  const switchThemeButton = screen.getByText(/Switch Theme/i);
  expect(switchThemeButton).toBeInTheDocument();
});

test('renders new presentation button', () => {
  render(<Dashboard />);
  const newPresentationButton = screen.getByText(/New Presentation/i);
  expect(newPresentationButton).toBeInTheDocument();
});

test('renders logout button', () => {
  render(<Dashboard />);
  const logoutButton = screen.getByText(/Logout/i);
  expect(logoutButton).toBeInTheDocument();
});

// test('renders presentation cards', () => {
//     // Mock presentations data
//     const presentations = [
//       { id: 1, name: 'Presentation 1', description: 'Description 1', slides: [] },
//       { id: 2, name: 'Presentation 2', description: 'Description 2', slides: [] },
//     ];

//     render(
//         <Dashboard presentations={presentations} />
//     );
//     presentations.forEach(presentation => {
//     const presentationName = screen.getByText((content, node) => {
//       const hasText = node => node.textContent === presentation.name;
//       const nodeHasText = hasText(node);
//       const childrenDontHaveText = Array.from(node.children).every(
//         child => !hasText(child)
//       );

//       return nodeHasText && childrenDontHaveText;
//       })

//     });
// });
