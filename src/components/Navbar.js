// src/components/Navbar.js
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import ArhafLogo from './ArhafLogo';

export default function Navbar() {
  const { t, toggleLang } = useLang();
  const { user, logout, page, navigate } = useApp();

  const links = [
    { key: 'home', label: t.home },
    { key: 'upload', label: t.analyze },
    { key: 'history', label: t.history },
    { key: 'profile', label: t.profile },
  ];

  const handleNav = (key) => {
    if (['upload', 'history', 'profile'].includes(key) && !user) {
      navigate('login');
    } else {
      navigate(key);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate('home')}>
        <div className="logo-ball">
          <ArhafLogo size={40} />
        </div>
        <span className="logo-txt grad2">{t.appName}</span>
      </div>

      {/* Links */}
      <div className="nav-links">
        {links.map(({ key, label }) => (
          <button
            key={key}
            className={`nl${page === key ? ' active' : ''}`}
            onClick={() => handleNav(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right controls */}
      <div className="nav-right">
        <button className="lang-btn" onClick={toggleLang}>
          {t.langToggle}
        </button>

        {user ? (
          <>
            <span className="nav-user">{t.welcome}, {user.name}</span>
            <button className="btn bg bsm" onClick={logout}>{t.logout}</button>
          </>
        ) : (
          <>
            <button className="btn bg bsm" onClick={() => navigate('login')}>{t.login}</button>
            <button className="btn bp bsm" onClick={() => navigate('register')}>{t.register}</button>
          </>
        )}
      </div>
    </nav>
  );
}