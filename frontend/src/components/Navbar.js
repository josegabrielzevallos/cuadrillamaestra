import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();

  const isHome = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?query=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <EngineeringIcon sx={{ fontSize: 32, color: '#f5b301' }} />
          <span>
            Cuadrilla<strong>Maestra</strong>
          </span>
        </Link>

        {/* Buscador central (no en home, que ya tiene el suyo) */}
        {!isHome && (
          <form className="navbar-search" onSubmit={handleSearch}>
            <SearchIcon className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Busca: gasfitero, albañil, pintor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        )}

        <button
          className="navbar-burger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menú"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/buscar" onClick={() => setMobileOpen(false)}>
            Buscar servicios
          </Link>
          <Link to="/subir-proyecto" onClick={() => setMobileOpen(false)}>
            Publicar proyecto
          </Link>
          {token ? (
            <>
              <Link to="/admin" className="navbar-user" onClick={() => setMobileOpen(false)}>
                <AccountCircleIcon sx={{ fontSize: 20 }} />
                {user?.first_name || user?.username || 'Mi cuenta'}
              </Link>
              <button className="navbar-logout" onClick={handleLogout}>
                <LogoutIcon sx={{ fontSize: 18 }} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="btn btn-primary navbar-cta"
                onClick={() => setMobileOpen(false)}
              >
                Únete como maestro
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
