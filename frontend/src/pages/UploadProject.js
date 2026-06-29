import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { workerAPI, projectAPI, catalogAPI } from '../api/endpoints';
import './Forms.css';

const UploadProject = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    work_date: '',
    service: '',
  });

  useEffect(() => {
    workerAPI
      .me()
      .then((r) => {
        setWorker(r.data);
        catalogAPI
          .services(r.data.category ? { category: r.data.category } : {})
          .then((res) => setServices(res.data.results ?? res.data))
          .catch(() => {});
      })
      .catch(() => setWorker(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotos = (e) => setPhotos(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('worker', worker.id);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('location', form.location);
      if (form.work_date) fd.append('work_date', form.work_date);
      if (form.service) fd.append('service', form.service);
      photos.forEach((p) => fd.append('uploaded_photos', p));
      await projectAPI.create(fd);
      setSent(true);
    } catch (err) {
      setError('No se pudo subir el proyecto. Verifica los datos e inténtalo de nuevo.');
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
            <p style={{ color: '#6b7280' }}>
              Para subir proyectos primero debes registrarte como obrero o maestro.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/registro')}>
              Crear perfil de maestro
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="form-page">
        <div className="form-wrap">
          <div className="form-card" style={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#1e9e6a' }} />
            <h1 style={{ marginTop: 12 }}>¡Proyecto publicado!</h1>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>
              Tu proyecto ya aparece en tu perfil público.
            </p>
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
            <h1>Subir proyecto realizado</h1>
            <p>Muestra tu trabajo con fotos del antes y después</p>
          </div>
          {error && <div className="form-alert error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título del proyecto *</label>
              <input name="title" value={form.title} onChange={handleChange} required
                placeholder="Ej: Remodelación de baño en Surco" />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe el trabajo realizado, materiales y resultados." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de servicio</label>
                <select name="service" value={form.service} onChange={handleChange}>
                  <option value="">Selecciona</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ubicación aproximada</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="Ej: Surco, Lima" />
              </div>
            </div>
            <div className="form-group">
              <label>Fecha del trabajo</label>
              <input type="date" name="work_date" value={form.work_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Fotos del proyecto (antes / después)</label>
              <label className="upload-box">
                <CloudUploadIcon sx={{ fontSize: 32, color: '#6b7280' }} />
                <span>{photos.length > 0 ? `${photos.length} foto(s) seleccionada(s)` : 'Haz clic para subir fotos'}</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotos} hidden />
              </label>
            </div>
            <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar proyecto'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProject;
