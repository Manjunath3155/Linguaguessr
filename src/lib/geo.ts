/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate score based on distance.
 * Max 5000 points. Within 200km = perfect score.
 * Uses exponential decay for a forgiving curve.
 */
export function calculateScore(distanceKm: number): number {
  if (distanceKm <= 200) return 5000;
  // Exponential decay: score drops off as distance increases
  // At ~2000km score is ~2500, at ~5000km score is ~500
  const score = Math.round(5000 * Math.exp(-distanceKm / 3000));
  return Math.max(0, score);
}
