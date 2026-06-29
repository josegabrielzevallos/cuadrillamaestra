/* Datos estáticos reutilizables en el frontend. */

// Zonas de trabajo (ejemplo: Lima y Callao). Ajusta según tu mercado.
export const WORK_ZONES = [
  'Lima Norte',
  'Lima Sur',
  'Lima Este',
  'Cercado de Lima',
  'San Juan de Lurigancho',
  'Comas',
  'Villa El Salvador',
  'Ate',
  'Los Olivos',
  'Surco',
  'San Martín de Porres',
  'Callao',
];

// Búsquedas sugeridas en el home.
export const POPULAR_SEARCHES = [
  'Gasfitero',
  'Electricista',
  'Pintor',
  'Albañil',
  'Mayólica',
  'Remodelación',
  'Maestro de obra',
];

// Helper para construir el enlace de WhatsApp.
export const whatsappLink = (phone, message = '') => {
  const clean = (phone || '').replace(/\D/g, '');
  const text = encodeURIComponent(message);
  return `https://wa.me/51${clean}${text ? `?text=${text}` : ''}`;
};
