import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { workerAPI, catalogAPI } from '../api/endpoints';
import './Forms.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({
    worker_type: 'obrero',
    category: '',
    headline: '',
    bio: '',
    work_zone: '',
    years_experience: 0,
    show_phone: false,
    services: [],
  });

  useEffect(() => {
    catalogAPI.categories().then((r) => setCategories(r.data.results ?? r.data)).catch(() => {});
    workerAPI
      .me()
      .then((r) => {
        const w = r.data;
        setWorker(w);
        setForm({
          worker_type: w.worker_type || 'obrero',
          category: w.category || '',
          headline: w.headline || '',
          bio: w.bio || '',
          work_zone: w.work_zone || '',
          years_experience: w.years_experience || 0,
          show_phone: !!w.show_phone,
          services: (w.services || []).map((s) => s.id),
        });
      })
      .catch(() => setWorker(false));
  }, []);

  useEffect(() => {
    catalogAPI
      .services(form.category ? { category: form.category } : {})
      .then((r) => setServices(r.data.results ?? r.data))
      .catch(() => {});
  }, [form.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleService = (id) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter((s) => s !== id)
        : [...f.services, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('worker_type', form.worker_type);
      if (form.category) fd.append('category', form.category);
      fd.append('headline', form.headline);
      fd.append('bio', form.bio);
      fd.append('work_zone', form.work_zone);
      fd.append('years_experience', form.years_experience || 0);
      fd.append('show_phone', form.show_phone);
      form.services.forEach((s) => fd.append('services', s));
      if (photo) fd.append('profile_image', photo);
      await workerAPI.update(worker.id, fd);
      setSaved(true);
    } catch (err) {
      setError('No se pudieron guardar los cambios. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (worker === false) {
    return (
      <div className="form-page">
        <div className="form-wrap">
          <div className="form-card" style={{ textAlign: 'center' }}>
            <h1>Necesitas un perfil de trabajador</h1>
            <p style={{ color: '#6b7280' }}>Regístrate como obrero o maestro para editar tu perfil.</p>
            <button className="btn btn-primary" onClick={() => navigate('/registro')}>Crear perfil</button>
          </div>
        </div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="form-page">
        <div className="form-wrap">
          <div className="form-card" style={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#1e9e6a' }} />
            <h1 style={{ marginTop: 12 }}>Perfil actualizado</h1>
            <button className="btn btn-navy" onClick={() => navigate(`/maestros/${worker.id}`)}>
              Ver mi perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-wrap wide">
        <div className="form-card">
          <div className="form-head">
            <h1>Editar mi perfil</h1>
            <p>Mantén tu información al día para que más clientes te contacten</p>
          </div>
          {error && <div className="form-alert error">{error}</div>}
          {worker && (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select name="worker_type" value={form.worker_type} onChange={handleChange}>
                    <option value="obrero">Obrero</option>
                    <option value="maestro">Maestro de obra</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Oficio principal</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Selecciona</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Especialidad / titular</label>
                <input name="headline" value={form.headline} onChange={handleChange}
                  placeholder="Ej: Gasfitero certificado" />
              </div>
              <div className="form-group">
                <label>Descripción profesional</label>
                <textarea name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Cuéntales a los clientes sobre tu experiencia." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Zona de trabajo</label>
                  <input name="work_zone" value={form.work_zone} onChange={handleChange}
                    placeholder="Ej: Surco, Lima" />
                </div>
                <div className="form-group">
                  <label>Años de experiencia</label>
                  <input type="number" min="0" name="years_experience"
                    value={form.years_experience} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Servicios que ofreces</label>
                <div className="chips">
                  {services.map((s) => (
                    <button type="button" key={s.id}
                      className={`chip ${form.services.includes(s.id) ? 'chip-on' : ''}`}
                      onClick={() => toggleService(s.id)}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Foto de perfil</label>
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label className="check-inline">
                  <input type="checkbox" name="show_phone" checked={form.show_phone} onChange={handleChange} />
                  Mostrar mi teléfono / WhatsApp en mi perfil
                </label>
              </div>
              <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
