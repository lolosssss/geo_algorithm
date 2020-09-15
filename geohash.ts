/**
 * Geohash implemented using TypeScript.
 */
const MAX_LATITUDE = 90;
const MIN_LATITUDE = -90;
const MAX_LONGITUDE = 180;
const MIN_LONGITUDE = -180;
const BITS = [16, 8, 4, 2, 1];
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

function encode(latitude: number, longitude: number, precision = 12): string {
  let geohash = '';
  let minLat = MIN_LATITUDE;
  let maxLat = MAX_LATITUDE;
  let minLng = MIN_LONGITUDE;
  let maxLng = MAX_LONGITUDE;
  let isEven = true;
  let bit = 0;
  let mid = 0;
  let ch = 0;

  while (geohash.length < precision) {
    if (isEven) {
      mid = (minLng + maxLng) / 2;
      if (mid < longitude) {
        ch |= BITS[bit];
        minLng = mid;
      } else {
        maxLng = mid;
      }
    } else {
      mid = (minLat + maxLat) / 2;
      if (mid < latitude) {
        ch |= BITS[bit];
        minLat = mid;
      } else {
        maxLat = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }

  return geohash;
}

function boundingBox(geohash: string): { latitude: number[]; longitude: number[] } {
  let isEven = true;
  const lat = [MIN_LATITUDE, MAX_LATITUDE];
  const lng = [MIN_LONGITUDE, MAX_LONGITUDE];
  let ch = '';
  let bit = 0;

  for (let i = 0; i < geohash.length; i++) {
    ch = geohash[i];
    bit = BASE32.indexOf(ch);
    BITS.forEach((b) => {
      if (isEven) {
        if (bit & b) {
          lng[0] = (lng[0] + lng[1]) / 2;
        } else {
          lng[1] = (lng[0] + lng[1]) / 2;
        }
      } else {
        if (bit & b) {
          lat[0] = (lat[0] + lat[1]) / 2;
        } else {
          lat[1] = (lat[0] + lat[1]) / 2;
        }
      }
      isEven = !isEven;
    });
  }
  return { latitude: lat, longitude: lng };
}

function decode(geohash: string): { latitude: number; longitude: number } {
  const { latitude, longitude } = boundingBox(geohash);

  return {
    latitude: (latitude[0] + latitude[1]) / 2,
    longitude: (longitude[0] + longitude[1]) / 2,
  };
}

export { encode, decode, boundingBox };
