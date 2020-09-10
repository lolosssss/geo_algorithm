/**
 * Implement Geohash in JavaScript.
 */

MAX_LATITUDE = 90;
MIN_LATITUDE = -90;
MAX_LONGITUDE = 180;
MIN_LONGITUDE = -180;
BITS = [16, 8, 4, 2, 1];
BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

function geohash(latitude, longitude, precision = 12) {
  let geoCode = '';
  let minLat = MIN_LATITUDE;
  let maxLat = MAX_LATITUDE;
  let minLon = MIN_LONGITUDE;
  let maxLon = MAX_LONGITUDE;
  let isEven = true;
  let bit = 0;
  let mid = 0;
  let ch = 0;

  while (geoCode.length < precision) {
    if (isEven) {
      mid = (minLon + maxLon) / 2;
      if (mid < longitude) {
        ch |= BITS[bit];
        minLon = mid;
      } else {
        maxLon = mid;
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
      geoCode += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }

  return geoCode;
}

export { geohash };
