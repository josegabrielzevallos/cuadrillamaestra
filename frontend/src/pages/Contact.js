import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { contactAPI, workerAPI } from '../api/endpoints';
import './Forms.css';

const Contact = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    request_type: 'quote',
    client_name: '',
    client_phone: '',
    client_email: '',
    zone: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    if (workerId) {
      workerAPI.detail(workerId).then((r) => setWorker(r.data)).catch(() => {});
    }
  }, [workerId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, worker: workerId };
      if (!payload.service) delete payload.service;
      await contactAPI.create(payload);
      setSent(true);
    } catch (err) {
      setError('No se pudo enviar la solicitud. Revisa los datos e inténtalo de nuevo.');
    }
  };

  if (sent) {
    return (
      <div className="form-page">
        <div className="form-wrap">
          <div className="form-card" style={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#1e9e6a' }} />
            <h1 style={{ marginTop: 12 }}>¡Solicitud enviada!</h1>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>
              {worker ? worker.name : 'El profesional'} recibirá tu solicitud y se
              pondrá en contacto contigo pronto.
            </p>
            <button className="btn btn-navy" onClick={() => navigate('/buscar')}>
              Seguir buscando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-wrap">
        <div className="form-card">
          <div className="form-head">
            <h1>Solicitar cotización</h1>
            <p>
              {worker
                ? `Envía tu solicitud a ${worker.name}`
                : 'Cuéntanos qué trabajo necesitas'}
            </p>
          </div>

          {error && <div className="form-alert error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de solicitud</label>
              <select name="request_type" value={form.request_type} onChange={handleChange}>
                <option value="quote">Cotización</option>
                <option value="contact">Contacto general</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input name="client_name" value={form.client_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Teléfono / WhatsApp *</label>
                <input name="client_phone" value={form.client_phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Correo (opcional)</label>
                <input type="email" name="client_email" value={form.client_email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Zona / distrito</label>
                <input name="zone" value={form.zone} onChange={handleChange} />
              </div>
            </div>
            {worker?.services?.length > 0 && (
              <div className="form-group">
                <label>Servicio de interés</label>
                <select name="service" value={form.service} onChange={handleChange}>
                  <option value="">Selecciona un servicio</option>
                  {worker.services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Describe el trabajo que necesitas *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required
                placeholder="Ej: Necesito instalar mayólica en un baño de 4m²..." />
            </div>
            <button type="submit" className="btn btn-primary form-submit">
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
