import { ApiProviders } from '@/api';
import App from '@/App';
import store from '@/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ApiProviders>
        <App />
      </ApiProviders>
    </Provider>
  </StrictMode>,
);
