// src/App.js
import { LangProvider } from './context/LangContext';
import { AppProvider, useApp } from './context/AppContext';
import Navbar   from './components/Navbar';
import { Toast } from './components/UI';
import Home     from './pages/Home';
import Upload   from './pages/Upload';
import History  from './pages/History';
import Profile  from './pages/Profile';
import { Login, Register } from './pages/Auth';

function Router() {
  const { page, user, navigate } = useApp();

  const guard = (pg, Component) => {
    if (['upload','history','profile'].includes(pg) && !user) {
      navigate('login');
      return null;
    }
    return <Component />;
  };

  return (
    <>
      {page === 'home'     && <Home />}
      {page === 'upload'   && guard('upload',  Upload)}
      {page === 'history'  && guard('history', History)}
      {page === 'profile'  && guard('profile', Profile)}
      {page === 'login'    && <Login />}
      {page === 'register' && <Register />}
    </>
  );
}

export default function App() {
  const AppLayout = () => {
    return (
      <>
        <Navbar />
        <Router />
        <Toast />
      </>
    );
  };

  return (
    <LangProvider>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </LangProvider>
  );
}

