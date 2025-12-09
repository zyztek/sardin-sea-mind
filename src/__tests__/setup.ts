import '@testing-library/jest-dom';

// Mock de navigator.geolocation
const mockGeolocation = {
   getCurrentPosition: vi.fn((success) => {
      success({
         coords: {
            latitude: 42.3601,
            longitude: -71.0589,
            accuracy: 100,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
         },
         timestamp: Date.now(),
      });
   }),
   watchPosition: vi.fn(),
   clearWatch: vi.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
   value: mockGeolocation,
   writable: true,
});

// Mock de fetch global
global.fetch = vi.fn();

// Mock de console.error para tests más limpios
const originalError = console.error;
beforeAll(() => {
   console.error = (...args: any[]) => {
      if (
         typeof args[0] === 'string' &&
         args[0].includes('Warning: ReactDOM.render')
      ) {
         return;
      }
      originalError.call(console, ...args);
   };
});

afterAll(() => {
   console.error = originalError;
});
