import React from 'react';
import { Link } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-col">
        <div className="footer-logo">
          <EngineeringIcon sx={{ fontSize: 30, color: '#f5b301' }} />
          <span>
            Cuadrilla<strong>Maestra</strong>
          </span>
        </div>
        <p>
          Conectamos a clientes con obreros y maestros de obra verificados.
          Construcción, mantenimiento y remodelación con confianza y seguridad.
        </p>
        <span className="footer-verified">
          <VerifiedUserIcon sx={{ fontSize: 18 }} /> Profesionales verificados
        </span>
      </div>

      <div className="footer-col">
        <h4>Servicios</h4>
        <Link to="/buscar?query=gasfitero">Gasfitería</Link>
        <Link to="/buscar?query=electricista">Electricidad</Link>
        <Link to="/buscar?query=pintor">Pintura</Link>
        <Link to="/buscar?query=albañil">Albañilería</Link>
        <Link to="/buscar?query=mayólica">Instalación de mayólica</Link>
        <Link to="/buscar?query=remodelación">Remodelaciones</Link>
      </div>

      <div className="footer-col">
        <h4>Cuadrilla Maestra</h4>
        <Link to="/buscar">Buscar maestros</Link>
        <Link to="/registro">Únete como maestro</Link>
        <Link to="/subir-proyecto">Publicar proyecto</Link>
        <Link to="/login">Ingresar</Link>
      </div>

      <div className="footer-col">
        <h4>Contacto</h4>
        <span className="footer-contact">
          <PhoneIcon sx={{ fontSize: 16 }} /> +51 999 999 999
        </span>
        <span className="footer-contact">
          <EmailIcon sx={{ fontSize: 16 }} /> hola@cuadrillamaestra.com
        </span>
        <span className="footer-contact">Lima, Perú</span>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Cuadrilla Maestra · www.cuadrillamaestra.com</p>
    </div>
  </footer>
);

export default Footer;
