import React from 'react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import './index.css';
import ViewWarranty from './pages/ViewWarranty';

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <ViewWarranty />
    </AppProvider>
  );
}

export default App; 