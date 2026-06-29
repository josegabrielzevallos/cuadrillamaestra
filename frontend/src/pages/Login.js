import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Forms.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (resp) => {
    setError('');
    try {
      await googleLogin(resp.credential);
      navigate('/admin');
    } catch (err) {
      setError('No se pudo iniciar sesión con Google.');
    }
  };

  return (
    <div className="form-page">
      <div className="form-wrap">
        <div className="form-card">
          <div className="form-head">
            <h1>Ingresar</h1>
            <p>Accede a tu cuenta de Cuadrilla Maestra</p>
          </div>
          {error && <div className="form-alert error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Usuario</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <div className="form-divider"><span>o</span></div>
          <div className="google-btn">
            <GoogleLogin onSuccess={handleGoogle} onError={() => setError('No se pudo iniciar sesión con Google.')} />
          </div>
          <div className="form-foot">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
