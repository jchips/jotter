import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';
import './assets/sass/App.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ChakraProvider>
  </StrictMode>
);
