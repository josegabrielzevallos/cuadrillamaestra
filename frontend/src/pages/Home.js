import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BoltIcon from '@mui/icons-material/Bolt';
import HandshakeIcon from '@mui/icons-material/Handshake';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import GridViewIcon from '@mui/icons-material/GridView';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { catalogAPI } from '../api/endpoints';
import { POPULAR_SEARCHES } from '../utils/constants';
import './Home.css';

const CATEGORY_ICONS = {
  plumbing: <PlumbingIcon sx={{ fontSize: 40 }} />,
  electrical: <ElectricalServicesIcon sx={{ fontSize: 40 }} />,
  paint: <FormatPaintIcon sx={{ fontSize: 40 }} />,
  bricks: <HomeRepairServiceIcon sx={{ fontSize: 40 }} />,
  tiles: <GridViewIcon sx={{ fontSize: 40 }} />,
  remodel: <EngineeringIcon sx={{ fontSize: 40 }} />,
  handyman: <HomeRepairServiceIcon sx={{ fontSize: 40 }} />,
};

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    catalogAPI
      .categories()
      .then((r) => setCategories(r.data.results ?? r.data))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    navigate(`/buscar?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <span className="hero-badge">
            <VerifiedUserIcon sx={{ fontSize: 16 }} /> Maestros y obreros verificados
          </span>
          <h1>
            Encuentra al maestro de obra ideal para tu proyecto
          </h1>
          <p>
            Gasfiteros, electricistas, albañiles, pintores y más. Profesionales
            confiables, con experiencia comprobada y reseñas reales.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-field">
              <SearchIcon sx={{ color: '#6b7280' }} />
              <input
                type="text"
                placeholder="¿Qué servicio necesitas? Ej: gasfitero, mayólica, albañil..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="hero-search-btn">
              <SearchIcon sx={{ fontSize: 20 }} /> Buscar
            </button>
          </form>

          <div className="hero-popular">
            <span>Populares:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link key={term} to={`/buscar?query=${encodeURIComponent(term)}`}>
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Confianza */}
      <section className="features container">
        <div className="feature-card">
          <div className="feature-icon"><VerifiedUserIcon sx={{ fontSize: 40 }} /></div>
          <h3>Servicios verificados</h3>
          <p>Cada maestro pasa por una evaluación interna de Cuadrilla Maestra.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><BoltIcon sx={{ fontSize: 40 }} /></div>
          <h3>Rápido y directo</h3>
          <p>Contacta por WhatsApp o solicita una cotización en minutos.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><HandshakeIcon sx={{ fontSize: 40 }} /></div>
          <h3>Confianza real</h3>
          <p>Reseñas de clientes y proyectos reales con fotos del antes y después.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><GppGoodIcon sx={{ fontSize: 40 }} /></div>
          <h3>Trabajo seguro</h3>
          <p>Evaluamos puntualidad, calidad, limpieza, seguridad y trato al cliente.</p>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories container">
        <div className="section-head">
          <h2>Categorías de servicios</h2>
          <p>Elige el oficio que necesitas para tu hogar o proyecto.</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/buscar?category=${cat.id}`}
              className="category-card"
            >
              <div className="category-icon">
                {CATEGORY_ICONS[cat.icon] || <HomeRepairServiceIcon sx={{ fontSize: 40 }} />}
              </div>
              <h4>{cat.name}</h4>
              <span>{cat.workers_count} profesionales</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta-inner container">
          <div>
            <h2>¿Eres maestro de obra u obrero?</h2>
            <p>Publica tu perfil, muestra tus proyectos y consigue más clientes.</p>
          </div>
          <Link to="/registro" className="btn btn-primary home-cta-btn">
            Únete a Cuadrilla Maestra
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
