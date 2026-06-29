import React from 'react';
import { useNavigate } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import StarRating from './StarRating';
import './WorkerCard.css';

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate();
  const services = worker.services || [];

  return (
    <div className="worker-card">
      <div className="worker-card-top">
        <div className="worker-avatar">
          {worker.profile_image ? (
            <img src={worker.profile_image} alt={worker.name} />
          ) : (
            <PersonIcon sx={{ fontSize: 46, color: '#9aa7b8' }} />
          )}
        </div>
        <div className="worker-head">
          <div className="worker-name-row">
            <h3>{worker.name}</h3>
            {worker.is_verified && (
              <span className="verified-badge">
                <VerifiedIcon sx={{ fontSize: 15 }} /> Verificado
              </span>
            )}
          </div>
          <p className="worker-headline">
            {worker.headline || worker.worker_type_display}
          </p>
          <StarRating
            value={worker.average_rating}
            showValue
            count={worker.reviews_count}
            size={16}
          />
        </div>
      </div>

      <div className="worker-meta">
        <span>
          <LocationOnIcon sx={{ fontSize: 16 }} /> {worker.work_zone || 'Zona no indicada'}
        </span>
        <span>
          <WorkHistoryIcon sx={{ fontSize: 16 }} /> {worker.years_experience} años exp.
        </span>
        <span>
          <PhotoLibraryIcon sx={{ fontSize: 16 }} /> {worker.projects_count} proyectos
        </span>
      </div>

      {services.length > 0 && (
        <div className="worker-tags">
          {services.slice(0, 3).map((s) => (
            <span key={s.id} className="worker-tag">
              {s.name}
            </span>
          ))}
          {services.length > 3 && (
            <span className="worker-tag more">+{services.length - 3}</span>
          )}
        </div>
      )}

      <div className="worker-actions">
        <button
          className="btn btn-outline worker-btn"
          onClick={() => navigate(`/maestros/${worker.id}`)}
        >
          <VisibilityIcon sx={{ fontSize: 18 }} /> Ver detalles
        </button>
        <button
          className="btn btn-primary worker-btn"
          onClick={() => navigate(`/contacto/${worker.id}`)}
        >
          <ChatIcon sx={{ fontSize: 18 }} /> Contactar
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;
