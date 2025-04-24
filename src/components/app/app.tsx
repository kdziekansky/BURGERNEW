import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppContent } from '../app-content';
import { Provider } from 'react-redux';
import store from '../../services/store';
import '../../index.css';
import styles from './app.module.css';

const App: FC = () => (
  <div className={styles.app}>
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  </div>
);

export default App;
