jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const mockPresentationData = {
  name: 'Mock Presentation',
  slides: [
    {
      id: 1,
      background: 'white',
    },
  ],
};

beforeEach(() => {
  localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPresentationData));
});

test('renders PresentationPreview component', () => {
//   render(<PresentationPreview />);
//   expect(localStorageMock.getItem).toHaveBeenCalledTimes(1);
//   expect(localStorageMock.getItem).toHaveBeenCalledWith('thisPresentation');
});
