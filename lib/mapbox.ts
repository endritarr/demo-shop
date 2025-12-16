const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  placeName: string;
}

export interface MapImageResult {
  mapImageUrl: string;
  mapImageDataUrl: string;
}

/**
 * Predefined Mapbox styles
 */
export const MapboxStyles = {
  // Color styles
  STREETS: "streets-v12",
  OUTDOORS: "outdoors-v12",
  LIGHT: "light-v11",        // Light monochrome
  DARK: "dark-v11",          // Dark monochrome with darker roads
  SATELLITE: "satellite-v9",
  SATELLITE_STREETS: "satellite-streets-v12",
  NAVIGATION_DAY: "navigation-day-v1",
  NAVIGATION_NIGHT: "navigation-night-v1",
  // Black and white options
  BLACK_WHITE: "light-v11",  // Light style works well for B&W
  MONOCHROME: "dark-v11",    // Dark style for monochrome look with black roads
} as const;

export type MapboxStyle = typeof MapboxStyles[keyof typeof MapboxStyles] | string;

/**
 * Geocodes a location string to get coordinates
 */
export async function geocodeLocation(location: string): Promise<GeocodeResult> {
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN is not configured");
  }

  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
  
  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error("Failed to geocode location");
  }

  const data = await response.json();
  
  if (!data.features || data.features.length === 0) {
    throw new Error("Location not found");
  }

  const [longitude, latitude] = data.features[0].center;
  const placeName = data.features[0].place_name;

  return { latitude, longitude, placeName };
}

/**
 * Generates a static map image for given coordinates
 */
export async function generateStaticMap(
  longitude: number,
  latitude: number,
  options?: {
    width?: number;
    height?: number;
    zoom?: number;
    style?: string;
    showMarker?: boolean;
    markerColor?: string;
  }
): Promise<MapImageResult> {
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN is not configured");
  }

  const {
    width = 400,
    height = 600,
    zoom = 14, // Increased zoom for closer view
    style = MapboxStyles.MONOCHROME as MapboxStyle,
    showMarker = true,
    markerColor = "000" // Black marker
  } = options || {};

  // Build the overlay for marker (pin at center)
  const markerOverlay = showMarker 
    ? `pin-s+${markerColor}(${longitude},${latitude})/`
    : "";

  // Ensure style is properly formatted (remove any extra spaces or issues)
  const cleanStyle = style.trim();
  
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/${cleanStyle}/static/${markerOverlay}${longitude},${latitude},${zoom}/${width}x${height}@2x?access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(staticMapUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch map image");
  }

  const imageBuffer = await response.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  const imageDataUrl = `data:image/png;base64,${base64Image}`;

  return {
    mapImageUrl: staticMapUrl,
    mapImageDataUrl: imageDataUrl,
  };
}

/**
 * Generates a complete map poster from a location string
 */
export async function generateMapImage(
  location: string,
  options?: {
    style?: MapboxStyle;
    width?: number;
    height?: number;
    zoom?: number;
    showMarker?: boolean;
    markerColor?: string;
  }
): Promise<GeocodeResult & MapImageResult> {
  const geocodeResult = await geocodeLocation(location);
  const mapImageResult = await generateStaticMap(
    geocodeResult.longitude,
    geocodeResult.latitude,
    options
  );

  return {
    ...geocodeResult,
    ...mapImageResult,
  };
}

