import React from 'react';
import EditPresentation from './EditPresentation';
import { render, fireEvent } from '@testing-library/react';

// Mock the react-router-dom module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('EditPresentation component', () => {
  // Helper function to set up the localStorage mock
  const setupLocalStorage = (presentations) => {
    global.localStorage = {
      getItem: jest.fn(() => JSON.stringify({ store: { presentations: [] } })),
      setItem: jest.fn(),
    };
  };

  it('adds a new slide when the button is clicked', () => {
    // Arrange
    const presentations = [{ id: 1, slides: [{ id: 1, background: 'white' }] }];
    setupLocalStorage(presentations);
    const { getByAltText } = render(<EditPresentation />);
    // const { getByText } = render(<EditPresentation />);
    const addSlideButton = getByAltText('Edit');

    // Act
    fireEvent.click(addSlideButton);

    // Assert
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
