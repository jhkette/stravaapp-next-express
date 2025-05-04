import React from 'react';
// import { act } from 'react-dom/test-utils';
import ReactDOMClient from 'react-dom/client';
import App from '../App';
jest.mock('chartjs-adapter-date-fns');
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOMClient.createRoot(div).render(<App />);
});