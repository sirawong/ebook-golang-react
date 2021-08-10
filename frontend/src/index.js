import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import store from './store/store';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
