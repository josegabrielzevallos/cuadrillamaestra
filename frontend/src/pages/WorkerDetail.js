import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ChatIcon from '@mui/icons-material/Chat';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarRating from '../components/StarRating';
import { workerAPI } from '../api/endpoints';
import { whatsappLink } from '../utils/constants';
import './WorkerDetail.css';

const EVAL_CRITERIA = [
  ['punctuality', 'Puntualidad'],
  ['work_quality', 'Calidad del trabajo'],
  ['cleanliness', 'Limpieza'],
  ['safety', 'Seguridad'],
  ['customer_treatment', 'Trato al cliente'],
];

const WorkerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('projects');

  useEffect(() => {
    setLoading(true);
    workerAPI
      .detail(id)
      .then((r) => setWorker(r.data))
      .catch(() => setWorker(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detail-loading">Cargando perfil...</div>;
  if (!worker) return <div className="detail-loading">No se encontró el profesional.</div>;

  const evaluation = worker.supervisor_evaluation;
  const reviews = worker.client_reviews || [];
  const projects = worker.projects || [];

  return (
    <div className="detail-page">
      {/* Encabezado */}
      <div className="detail-hero">
        <div className="container detail-hero-inner">
          <div className="detail-avatar">
            {worker.profile_image ? (
              <img src={worker.profile_image} alt={worker.name} />
            ) : (
              <PersonIcon sx={{ fontSize: 70, color: '#9aa7b8' }} />
            )}
          </div>
          <div className="detail-headinfo">
            <div className="detail-name-row">
              <h1>{worker.name}</h1>
              {worker.is_verified && (
                <span className="verified-badge">
                  <VerifiedIcon sx={{ fontSize: 16 }} /> Verificado por Cuadrilla Maestra
                </span>
              )}
            </div>
            <p className="detail-headline">
              {worker.headline || worker.worker_type_display}
              {worker.category_name && ` · ${worker.category_name}`}
            </p>
            <div className="detail-meta">
              <StarRating value={worker.average_rating} showValue count={worker.reviews_count} />
              <span><LocationOnIcon sx={{ fontSize: 17 }} /> {worker.work_zone || 'Zona no indicada'}</span>
              <span><WorkHistoryIcon sx={{ fontSize: 17 }} /> {worker.years_experience} años de experiencia</span>
            </div>
            <div className="detail-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/contacto/${worker.id}`)}
              >
                <ChatIcon sx={{ fontSize: 18 }} /> Solicitar cotización
              </button>
              {worker.show_phone && worker.public_phone && (
                <a
                  className="btn btn-whatsapp"
                  href={whatsappLink(worker.public_phone, `Hola ${worker.name}, te contacto desde Cuadrilla Maestra.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon sx={{ fontSize: 18 }} /> WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="detail-stats">
            <div><strong>{worker.projects_count}</strong><span>Proyectos</span></div>
            <div><strong>{worker.average_rating}</strong><span>Calificación</span></div>
            <div><strong>{worker.reviews_count}</strong><span>Reseñas</span></div>
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="detail-main">
          {/* Descripción */}
          {worker.bio && (
            <section className="detail-card">
              <h2>Descripción profesional</h2>
              <p className="detail-bio">{worker.bio}</p>
            </section>
          )}

          {/* Servicios */}
          {worker.services?.length > 0 && (
            <section className="detail-card">
              <h2>Servicios que ofrece</h2>
              <div className="detail-services">
                {worker.services.map((s) => (
                  <span key={s.id} className="detail-service">
                    <CheckCircleIcon sx={{ fontSize: 16, color: '#1e9e6a' }} /> {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Tabs proyectos / reseñas */}
          <section className="detail-card">
            <div className="detail-tabs">
              <button
                className={tab === 'projects' ? 'active' : ''}
                onClick={() => setTab('projects')}
              >
                Proyectos ({projects.length})
              </button>
              <button
                className={tab === 'reviews' ? 'active' : ''}
                onClick={() => setTab('reviews')}
              >
                Reseñas y evaluación ({reviews.length + (evaluation ? 1 : 0)})
              </button>
            </div>

            {tab === 'projects' && (
              <div className="detail-projects">
                {projects.length === 0 && <p className="detail-muted">Aún no ha subido proyectos.</p>}
                {projects.map((p) => (
                  <div key={p.id} className="project-item">
                    <div className="project-thumb">
                      {p.cover_image || p.photos?.[0]?.image ? (
                        <img src={p.cover_image || p.photos[0].image} alt={p.title} />
                      ) : (
                        <span>Sin foto</span>
                      )}
                    </div>
                    <div className="project-info">
                      <h4>{p.title}</h4>
                      {p.service_name && <span className="project-tag">{p.service_name}</span>}
                      <p>{p.description}</p>
                      <small>
                        {p.location} {p.work_date && `· ${p.work_date}`}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'reviews' && (
              <div className="detail-reviews">
                {/* Evaluación del supervisor (diferenciada) */}
                {evaluation && (
                  <div className="supervisor-eval">
                    <div className="supervisor-eval-head">
                      <ShieldIcon sx={{ fontSize: 22, color: '#0f2a47' }} />
                      <div>
                        <strong>Evaluación verificada por Cuadrilla Maestra</strong>
                        <span>
                          Supervisor: {evaluation.supervisor_name} · {evaluation.evaluated_at}
                        </span>
                      </div>
                      <div className="supervisor-score">{evaluation.overall_score}</div>
                    </div>
                    <div className="supervisor-criteria">
                      {EVAL_CRITERIA.map(([key, label]) => (
                        <div key={key} className="criteria-row">
                          <span>{label}</span>
                          <StarRating value={evaluation[key]} size={15} />
                        </div>
                      ))}
                    </div>
                    {evaluation.comment && (
                      <p className="supervisor-comment">“{evaluation.comment}”</p>
                    )}
                  </div>
                )}

                {/* Reseñas de clientes */}
                {reviews.length === 0 && !evaluation && (
                  <p className="detail-muted">Aún no tiene reseñas.</p>
                )}
                {reviews.map((rv) => (
                  <div key={rv.id} className="review-item">
                    <div className="review-head">
                      <div className="review-avatar">
                        {rv.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{rv.client_name}</strong>
                        <span>{rv.service_hired} · {new Date(rv.created_at).toLocaleDateString()}</span>
                      </div>
                      <StarRating value={rv.rating} size={16} />
                    </div>
                    {rv.comment && <p>{rv.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Lateral */}
        <aside className="detail-side">
          <div className="detail-card detail-contact-card">
            <h3>¿Te interesa este maestro?</h3>
            <p>Solicita una cotización gratuita y sin compromiso.</p>
            <button
              className="btn btn-primary detail-side-btn"
              onClick={() => navigate(`/contacto/${worker.id}`)}
            >
              <ChatIcon sx={{ fontSize: 18 }} /> Solicitar cotización
            </button>
            {worker.show_phone && worker.public_phone ? (
              <a
                className="btn btn-whatsapp detail-side-btn"
                href={whatsappLink(worker.public_phone)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} /> Escribir por WhatsApp
              </a>
            ) : (
              <p className="detail-muted small">
                Este profesional prefiere recibir solicitudes por la plataforma.
              </p>
            )}
            <Link to="/buscar" className="detail-back">← Volver a la búsqueda</Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WorkerDetail;
