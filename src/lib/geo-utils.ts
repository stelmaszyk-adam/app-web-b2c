import { CITIES, type City } from "./cities";

/**
 * Find the nearest city to given coordinates.
 * Uses Haversine distance for accuracy.
 */
export function findNearestCity(
  lat: number,
  lng: number,
): City | null {
  let nearest: City | null = null;
  let minDist = Infinity;

  for (const city of CITIES) {
    const dist = haversineKm(lat, lng, city.lat, city.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  // Only match if within 50km of a supported city
  if (minDist > 50) return null;
  return nearest;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
