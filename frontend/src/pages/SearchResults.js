import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import TuneIcon from '@mui/icons-material/Tune';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import WorkerCard from '../components/WorkerCard';
import { workerAPI, catalogAPI } from '../api/endpoints';
import { WORK_ZONES } from '../utils/constants';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const filters = {
    query: searchParams.get('query') || '',
    category: searchParams.get('category') || '',
    zone: searchParams.get('zone') || '',
    min_rating: searchParams.get('min_rating') || '',
    min_experience: searchParams.get('min_experience') || '',
    service: searchParams.get('service') || '',
  };

  useEffect(() => {
    catalogAPI.categories().then((r) => setCategories(r.data.results ?? r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = filters.category ? { category: filters.category } : {};
    catalogAPI.services(params).then((r) => setServices(r.data.results ?? r.data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category]);

  const fetchWorkers = useCallback(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    workerAPI
      .search(params)
      .then((r) => {
        const data = r.data;
        setWorkers(data.results ?? data);
        setCount(data.count ?? (data.results ?? data).length);
      })
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    const query = searchParams.get('query');
    if (query) next.set('query', query);
    setSearchParams(next);
  };

  return (
    <div className="results-page">
      <div className="container results-layout">
        {/* Filtros */}
        <aside className="filters">
          <div className="filters-head">
            <TuneIcon sx={{ fontSize: 20 }} />
            <h3>Filtros</h3>
            <button className="filters-clear" onClick={clearFilters}>
              Limpiar
            </button>
          </div>

          <div className="filter-group">
            <label>Categoría</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Zona de trabajo</label>
            <select value={filters.zone} onChange={(e) => updateFilter('zone', e.target.value)}>
              <option value="">Todas</option>
              {WORK_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Servicio ofrecido</label>
            <select
              value={filters.service}
              onChange={(e) => updateFilter('service', e.target.value)}
            >
              <option value="">Todos</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Calificación mínima</label>
            <select
              value={filters.min_rating}
              onChange={(e) => updateFilter('min_rating', e.target.value)}
            >
              <option value="">Cualquiera</option>
              <option value="4.5">4.5★ o más</option>
              <option value="4">4★ o más</option>
              <option value="3">3★ o más</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Años de experiencia</label>
            <select
              value={filters.min_experience}
              onChange={(e) => updateFilter('min_experience', e.target.value)}
            >
              <option value="">Cualquiera</option>
              <option value="2">2+ años</option>
              <option value="5">5+ años</option>
              <option value="10">10+ años</option>
              <option value="15">15+ años</option>
            </select>
          </div>
        </aside>

        {/* Resultados */}
        <section className="results-content">
          <div className="results-header">
            <h2>
              {filters.query
                ? `Resultados para "${filters.query}"`
                : 'Maestros y obreros disponibles'}
            </h2>
            {!loading && <span>{count} profesionales encontrados</span>}
          </div>

          {loading ? (
            <div className="results-loading">Cargando profesionales...</div>
          ) : workers.length === 0 ? (
            <div className="results-empty">
              <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: '#9aa7b8' }} />
              <h3>No encontramos profesionales</h3>
              <p>Prueba con otra palabra clave o ajusta los filtros.</p>
            </div>
          ) : (
            <div className="results-grid">
              {workers.map((w) => (
                <WorkerCard key={w.id} worker={w} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchResults;
