
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';


import { Navigation } from './Navbar';
import { Spinner } from 'react-bootstrap';
import { Home } from './Home';
import { Create } from './Create';
import { MyListedItems } from './MyListedItems';
import { MyPurchases } from './MyPurchases';
import { useApp } from '../hooks/useApp';
import { AppContext } from '../context';
import { Outlet } from 'react-router-dom';

function App() {
  const {
    loading,
    context
  } = useApp();
console.log('loading', loading);
  return (
      <AppContext.Provider value={context}>
        <div className="App">
          <Navigation />
          {loading ? <Loading /> :
            <Outlet />
          }
        </div>
      </AppContext.Provider>
  );
}

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" className="d-flex" />

      <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
    </div>
  );
}

export default App;
