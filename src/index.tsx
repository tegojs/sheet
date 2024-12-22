import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactSheet from './sheet/ReactSheet';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ReactSheet />
    </React.StrictMode>,
  );
}
