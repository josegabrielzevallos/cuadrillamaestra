import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Forms.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: 'worker',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogle = async (resp) => {
    setError('');
    try {
      await googleLogin(resp.credential, form.role);
      navigate('/admin');
    } catch (err) {
      setError('No se pudo registrar con Google.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/admin');
    } catch (err) {
      const data = err.response?.data;
      const msg = data
        ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' · ')
        : 'No se pudo completar el registro.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-wrap">
        <div className="form-card">
          <div className="form-head">
            <h1>Crear cuenta</h1>
            <p>Únete a Cuadrilla Maestra como maestro, obrero o cliente</p>
          </div>
          {error && <div className="form-alert error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Quiero registrarme como</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="worker">Obrero / Maestro de obra</option>
                <option value="client">Cliente</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nombres *</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Apellidos *</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Usuario *</label>
                <input name="username" value={form.username} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Teléfono / WhatsApp</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contraseña * (mínimo 8 caracteres)</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
            </div>
            <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <div className="form-divider"><span>o</span></div>
          <div className="google-btn">
            <GoogleLogin onSuccess={handleGoogle} onError={() => setError('No se pudo registrar con Google.')} text="signup_with" />
          </div>
          <div className="form-foot">
            ¿Ya tienes cuenta? <Link to="/login">Ingresa</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
