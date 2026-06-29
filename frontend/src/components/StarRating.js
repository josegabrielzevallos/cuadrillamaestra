import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

/**
 * Muestra una calificación en estrellas (0-5).
 */
const StarRating = ({ value = 0, size = 18, showValue = false, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) {
      stars.push(<StarIcon key={i} sx={{ fontSize: size, color: '#f5b301' }} />);
    } else if (value >= i - 0.5) {
      stars.push(<StarHalfIcon key={i} sx={{ fontSize: size, color: '#f5b301' }} />);
    } else {
      stars.push(<StarBorderIcon key={i} sx={{ fontSize: size, color: '#f5b301' }} />);
    }
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ display: 'inline-flex' }}>{stars}</span>
      {showValue && (
        <span style={{ fontWeight: 600, color: '#1f2933', fontSize: size - 2 }}>
          {Number(value).toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span style={{ color: '#6b7280', fontSize: size - 4 }}>({count})</span>
      )}
    </span>
  );
};

export default StarRating;
