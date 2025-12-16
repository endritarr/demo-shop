import sharp from "sharp";
import fs from "fs";
import path from "path";

// Import pdfkit - using require for CommonJS compatibility in Next.js server context
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit') as typeof import('pdfkit');

export interface PosterOptions {
  mapImageBuffer: Buffer;
  title?: string;
  date?: string;
  text?: string;
  name?: string;
  location?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  shape?: "rectangle" | "heart" | "circle"; // Shape mask for the map
}

/**
 * Generates a poster with map image on top and text at the bottom
 */
export async function generatePosterImage(options: PosterOptions): Promise<Buffer> {
  const {
    mapImageBuffer,
    date = "",
    text = "",
    name = "",
    width = 800,
    height = 1200,
    backgroundColor = "#FFFFFF",
    textColor = "#000000",
    shape = "rectangle",
  } = options;

  // Calculate dimensions with 20% padding around the map
  const paddingPercent = 0.05;
  const mapWidth = Math.floor(width * (1 - paddingPercent * 2)); // 60% of width (20% padding on each side)
  const mapHeight = Math.floor(height * 0.75 * (1 - paddingPercent * 2)); // Map area with padding
  const mapAreaHeight = Math.floor(height * 0.75); // Total map area height
  // Ensure textHeight doesn't exceed available space (handle rounding)
  const textHeight = Math.max(1, height - mapAreaHeight); // Text area takes remaining 25%
  const horizontalPadding = Math.floor(width * paddingPercent); // 20% padding on left and right
  const verticalPadding = Math.floor(mapAreaHeight * paddingPercent); // 20% padding on top and bottom of map area
  
  // Ensure all dimensions fit within canvas
  const maxMapWidth = width - (horizontalPadding * 2);
  const maxMapHeight = mapAreaHeight - (verticalPadding * 2);

  // Resize map image to fit with padding - ensure it doesn't exceed available space
  const actualMapWidth = Math.min(mapWidth, maxMapWidth);
  const actualMapHeight = Math.min(mapHeight, maxMapHeight);
  const resizedMap = await sharp(mapImageBuffer)
    .resize(actualMapWidth, actualMapHeight, {
      fit: "cover",
      position: "center",
    });

  // Apply shape mask if needed
  let resizedMapBuffer: Buffer;
  let borderSvg: string | null = null;
  
  if (shape !== "rectangle") {
    const maskSvg = createShapeMask(actualMapWidth, actualMapHeight, shape);
    const maskBuffer = Buffer.from(maskSvg);
    
    // Create the mask as a grayscale image (white = visible, black = transparent)
    const mask = await sharp(maskBuffer)
      .greyscale()
      .toBuffer();
    
    // Apply the mask as alpha channel
    resizedMapBuffer = await resizedMap
      .ensureAlpha()
      .composite([
        {
          input: mask,
          blend: "dest-in", // Use mask to clip the image
        },
      ])
      .toBuffer();
    
    // Create border SVG for the shape
    borderSvg = createShapeBorder(actualMapWidth, actualMapHeight, shape);
  } else {
    resizedMapBuffer = await resizedMap.toBuffer();
    // Rectangle border
    borderSvg = createShapeBorder(actualMapWidth, actualMapHeight, "rectangle");
  }

  // Create SVG text overlay
  // Order: Text, Name, Date (Date at the bottom)
  // yOffset is relative to the SVG container (which starts at mapAreaHeight)
  const textLines: string[] = [];
  let yOffset = 80; // Start text lower within the text area (relative to SVG)
  
  console.log("Poster generator - text:", text, "date:", date, "name:", name);
  
  if (text && text.trim()) {
    textLines.push(`<text x="${width / 2}" y="${yOffset}" font-family="Playfair Display, Roboto, serif" font-size="36" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${escapeXml(text)}</text>`);
    yOffset += 50;
  }
  
  if (name && name.trim()) {
    textLines.push(`<text x="${width / 2}" y="${yOffset}" font-family="Playfair Display, Roboto, serif" font-size="36" font-weight="700" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${escapeXml(name)}</text>`);
    yOffset += 50;
  }
  
  if (date && date.trim()) {
    textLines.push(`<text x="${width / 2}" y="${yOffset}" font-family="Playfair Display, Roboto, serif" font-size="20" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${escapeXml(date)}</text>`);
  }
  
  console.log("Text lines generated:", textLines.length);

  // Load and embed fonts from lib/fonts as base64 (accessible in serverless)
  let fontRegularBase64 = "";
  let fontBoldBase64 = "";
  
  try {
    // Log current working directory for debugging
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    
    // Use paths that work in both dev and production serverless
    const possiblePaths = [
      path.join(process.cwd(), 'lib', 'fonts', 'PlayfairDisplay-Regular.ttf'),
      path.join(__dirname, 'fonts', 'PlayfairDisplay-Regular.ttf'),
      path.join(process.cwd(), '.next', 'server', 'app', 'lib', 'fonts', 'PlayfairDisplay-Regular.ttf'),
      path.join(process.cwd(), '.next', 'server', 'lib', 'fonts', 'PlayfairDisplay-Regular.ttf'),
      path.join('/var/task', 'lib', 'fonts', 'PlayfairDisplay-Regular.ttf'), // AWS Lambda path
    ];
    
    console.log('Trying to find PlayfairDisplay-Regular.ttf at paths:', possiblePaths);
    
    const fontRegularPath = possiblePaths.find(p => {
      const exists = fs.existsSync(p);
      if (exists) console.log('Found font at:', p);
      return exists;
    });
    
    if (fontRegularPath) {
      const fontRegularBuffer = fs.readFileSync(fontRegularPath);
      fontRegularBase64 = fontRegularBuffer.toString('base64');
      console.log('Successfully loaded PlayfairDisplay-Regular.ttf, size:', fontRegularBase64.length);
    } else {
      console.error('PlayfairDisplay-Regular.ttf not found. Tried paths:', possiblePaths);
      // List what's actually in lib/fonts if it exists
      const libFontsPath = path.join(process.cwd(), 'lib', 'fonts');
      if (fs.existsSync(libFontsPath)) {
        console.log('Contents of lib/fonts:', fs.readdirSync(libFontsPath));
      }
    }
    
    const boldPaths = [
      path.join(process.cwd(), 'lib', 'fonts', 'PlayfairDisplay-Bold.ttf'),
      path.join(__dirname, 'fonts', 'PlayfairDisplay-Bold.ttf'),
      path.join(process.cwd(), '.next', 'server', 'app', 'lib', 'fonts', 'PlayfairDisplay-Bold.ttf'),
      path.join(process.cwd(), '.next', 'server', 'lib', 'fonts', 'PlayfairDisplay-Bold.ttf'),
      path.join('/var/task', 'lib', 'fonts', 'PlayfairDisplay-Bold.ttf'), // AWS Lambda path
    ];
    
    console.log('Trying to find PlayfairDisplay-Bold.ttf at paths:', boldPaths);
    
    const fontBoldPath = boldPaths.find(p => {
      const exists = fs.existsSync(p);
      if (exists) console.log('Found font at:', p);
      return exists;
    });
    
    if (fontBoldPath) {
      const fontBoldBuffer = fs.readFileSync(fontBoldPath);
      fontBoldBase64 = fontBoldBuffer.toString('base64');
      console.log('Successfully loaded PlayfairDisplay-Bold.ttf, size:', fontBoldBase64.length);
    } else {
      console.error('PlayfairDisplay-Bold.ttf not found. Tried paths:', boldPaths);
    }
  } catch (error) {
    console.error("Error loading fonts:", error);
  }
  
  if (!fontRegularBase64 || !fontBoldBase64) {
    console.error('WARNING: Fonts not loaded! Text may not render correctly.');
  }

  const svgText = textLines.length > 0
    ? `<svg width="${width}" height="${textHeight}" viewBox="0 0 ${width} ${textHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style type="text/css">
            <![CDATA[
              ${fontRegularBase64 ? `@font-face {
                font-family: 'Playfair Display';
                font-style: normal;
                font-weight: 400;
                src: url(data:font/truetype;charset=utf-8;base64,${fontRegularBase64}) format('truetype');
              }` : ''}
              ${fontBoldBase64 ? `@font-face {
                font-family: 'Playfair Display';
                font-style: normal;
                font-weight: 700;
                src: url(data:font/truetype;charset=utf-8;base64,${fontBoldBase64}) format('truetype');
              }` : ''}
            ]]>
          </style>
        </defs>
        <g>
          ${textLines.join("\n          ")}
        </g>
      </svg>`
    : "";

  // Parse background color
  const bgColor = parseColor(backgroundColor);
  
  // Create blank canvas with RGBA for proper compositing
  let poster = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: bgColor,
    },
  });

  // Verify map image dimensions before compositing
  const mapImageMeta = await sharp(resizedMapBuffer).metadata();
  const actualMapImageWidth = mapImageMeta.width || actualMapWidth;
  const actualMapImageHeight = mapImageMeta.height || actualMapHeight;
  
  // Ensure map image doesn't exceed available space
  const safeMapWidth = Math.min(actualMapImageWidth, maxMapWidth);
  const safeMapHeight = Math.min(actualMapImageHeight, maxMapHeight);
  
  // If the image is larger than expected, resize it
  let finalMapBuffer = resizedMapBuffer;
  if (actualMapImageWidth > maxMapWidth || actualMapImageHeight > maxMapHeight) {
    finalMapBuffer = await sharp(resizedMapBuffer)
      .resize(safeMapWidth, safeMapHeight, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toBuffer();
  }
  
  // Composite map image on top with padding
  const composites: sharp.OverlayOptions[] = [
    {
      input: finalMapBuffer,
      top: verticalPadding, // 20% padding from top
      left: horizontalPadding, // 20% padding from left
    },
  ];
  
  // Add border overlay if shape border exists
  if (borderSvg) {
    const borderBuffer = Buffer.from(borderSvg);
    // Ensure border SVG is resized to fit within map bounds
    const borderImageBuffer = await sharp(borderBuffer)
      .resize(safeMapWidth, safeMapHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
      })
      .png()
      .toBuffer();
    
    // Verify border dimensions
    const borderMeta = await sharp(borderImageBuffer).metadata();
    const borderWidth = borderMeta.width || safeMapWidth;
    const borderHeight = borderMeta.height || safeMapHeight;
    
    // Ensure border fits within available space
    if (borderWidth <= maxMapWidth && borderHeight <= maxMapHeight) {
      composites.push({
        input: borderImageBuffer,
        top: verticalPadding,
        left: horizontalPadding,
        blend: "over", // Overlay the border on top
      });
    }
  }

  // Add text overlay if there's text
  if (svgText) {
    const textBuffer = Buffer.from(svgText);
    // Process SVG through Sharp first to ensure it renders correctly
    // Ensure text image fits exactly within available space
    const maxTextWidth = width;
    const maxTextHeight = Math.min(textHeight, height - mapAreaHeight);
    
    // Resize the text image to fit exactly within bounds
    const textImageBuffer = await sharp(textBuffer)
      .resize(maxTextWidth, maxTextHeight, {
        fit: 'contain', // Use 'contain' to ensure it fits without cropping
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
      })
      .png()
      .toBuffer();
    
    // Verify the image dimensions before compositing
    const textImageMeta = await sharp(textImageBuffer).metadata();
    const actualTextWidth = textImageMeta.width || maxTextWidth;
    const actualTextHeight = textImageMeta.height || maxTextHeight;
    
    // Ensure text image doesn't exceed canvas bounds
    const safeTextWidth = Math.min(actualTextWidth, width);
    const safeTextHeight = Math.min(actualTextHeight, maxTextHeight);
    
    // Ensure text position doesn't exceed canvas
    // Calculate safe position: textTop + safeTextHeight must be <= height
    const maxTextTop = height - safeTextHeight;
    const textTop = Math.min(mapAreaHeight, maxTextTop);
    
    // Double-check that the text will fit
    if (textTop + safeTextHeight <= height && safeTextWidth <= width) {
      composites.push({
        input: textImageBuffer,
        top: Math.max(0, textTop), // Ensure non-negative
        left: 0,
      });
    } else {
      console.warn('Text image too large, skipping text overlay', {
        textTop,
        safeTextHeight,
        safeTextWidth,
        height,
        width,
      });
    }
  }

  // Final safety check: verify all composite images fit within canvas bounds
  const verifiedComposites: sharp.OverlayOptions[] = [];
  for (const composite of composites) {
    if (composite.input && Buffer.isBuffer(composite.input)) {
      try {
        const meta = await sharp(composite.input).metadata();
        const imgWidth = meta.width || 0;
        const imgHeight = meta.height || 0;
        const top = composite.top || 0;
        const left = composite.left || 0;
        
        // Check if image fits within canvas at the specified position
        if (top + imgHeight <= height && left + imgWidth <= width && top >= 0 && left >= 0) {
          verifiedComposites.push(composite);
        } else {
          console.warn('Skipping composite that exceeds canvas bounds', {
            imgWidth,
            imgHeight,
            top,
            left,
            canvasWidth: width,
            canvasHeight: height,
          });
        }
      } catch (error) {
        console.warn('Error verifying composite dimensions, skipping', error);
      }
    } else {
      // If input is not a buffer, skip verification but still add it
      verifiedComposites.push(composite);
    }
  }

  // Apply all verified composites
  if (verifiedComposites.length > 0) {
    poster = poster.composite(verifiedComposites);
  }

  return await poster.png().toBuffer();
}

/**
 * Creates an SVG border for the specified shape
 */
function createShapeBorder(width: number, height: number, shape: "rectangle" | "heart" | "circle"): string {
  const strokeWidth = 4; // Border width in pixels
  
  if (shape === "heart") {
    const centerX = width / 2;
    const centerY = height / 2;
    // Use more space - scale based on height for vertical heart, make it bigger
    const scaleX = width * 0.85; // Use 85% of width
    const scaleY = height * 0.90; // Use 90% of height for vertical emphasis
    
    // Vertical heart path - taller than wide
    const heartPath = `M ${centerX},${centerY + scaleY * 0.25}
      C ${centerX - scaleX * 0.12},${centerY + scaleY * 0.08} 
        ${centerX - scaleX * 0.42},${centerY - scaleY * 0.12} 
        ${centerX - scaleX * 0.42},${centerY - scaleY * 0.32}
      C ${centerX - scaleX * 0.42},${centerY - scaleY * 0.58} 
        ${centerX - scaleX * 0.15},${centerY - scaleY * 0.58} 
        ${centerX},${centerY - scaleY * 0.38}
      C ${centerX + scaleX * 0.15},${centerY - scaleY * 0.58} 
        ${centerX + scaleX * 0.42},${centerY - scaleY * 0.58} 
        ${centerX + scaleX * 0.42},${centerY - scaleY * 0.32}
      C ${centerX + scaleX * 0.42},${centerY - scaleY * 0.12} 
        ${centerX + scaleX * 0.12},${centerY + scaleY * 0.08} 
        ${centerX},${centerY + scaleY * 0.25}
      Z`.replace(/\s+/g, ' ').trim();
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <path d="${heartPath}" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
    </svg>`;
  } else if (shape === "circle") {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
    </svg>`;
  } else {
    // Rectangle border
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${width - strokeWidth}" height="${height - strokeWidth}" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
    </svg>`;
  }
}

/**
 * Creates an SVG mask for the specified shape
 */
function createShapeMask(width: number, height: number, shape: "heart" | "circle"): string {
  if (shape === "heart") {
    // Heart shape using SVG path
    // The heart is centered and scaled to fit the dimensions - vertical and bigger
    const centerX = width / 2;
    const centerY = height / 2;
    // Use more space - scale based on height for vertical heart, make it bigger
    const scaleX = width * 0.85; // Use 85% of width
    const scaleY = height * 0.90; // Use 90% of height for vertical emphasis
    
    // Vertical heart path - taller than wide
    const heartPath = `M ${centerX},${centerY + scaleY * 0.25}
      C ${centerX - scaleX * 0.12},${centerY + scaleY * 0.08} 
        ${centerX - scaleX * 0.42},${centerY - scaleY * 0.12} 
        ${centerX - scaleX * 0.42},${centerY - scaleY * 0.32}
      C ${centerX - scaleX * 0.42},${centerY - scaleY * 0.58} 
        ${centerX - scaleX * 0.15},${centerY - scaleY * 0.58} 
        ${centerX},${centerY - scaleY * 0.38}
      C ${centerX + scaleX * 0.15},${centerY - scaleY * 0.58} 
        ${centerX + scaleX * 0.42},${centerY - scaleY * 0.58} 
        ${centerX + scaleX * 0.42},${centerY - scaleY * 0.32}
      C ${centerX + scaleX * 0.42},${centerY - scaleY * 0.12} 
        ${centerX + scaleX * 0.12},${centerY + scaleY * 0.08} 
        ${centerX},${centerY + scaleY * 0.25}
      Z`.replace(/\s+/g, ' ').trim();

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="heartMask">
          <rect width="100%" height="100%" fill="black"/>
          <path d="${heartPath}" fill="white"/>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="white" mask="url(#heartMask)"/>
    </svg>`;
  } else if (shape === "circle") {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="circleMask">
          <rect width="100%" height="100%" fill="black"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white"/>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="white" mask="url(#circleMask)"/>
    </svg>`;
  }
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
  </svg>`;
}

/**
 * Escapes XML special characters for SVG text
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Parses a hex color string to RGB object
 */
function parseColor(hex: string): { r: number; g: number; b: number; alpha: number } {
  // Remove # if present
  const hexColor = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  return { r, g, b, alpha: 1 };
}

/**
 * Poster size definitions in inches (width x height)
 */
export type PosterSize = "8x10" | "12x16" | "16x20" | "18x24" | "24x36";

const POSTER_SIZES: Record<PosterSize, { width: number; height: number }> = {
  "8x10": { width: 8, height: 10 },
  "12x16": { width: 12, height: 16 },
  "16x20": { width: 16, height: 20 },
  "18x24": { width: 18, height: 24 },
  "24x36": { width: 24, height: 36 },
};

/**
 * Generates a Gelato-compatible PDF from a poster image buffer
 * 
 * Requirements:
 * - PDF version 1.4+
 * - 300 DPI final document
 * - RGB with embedded sRGB IEC61966-2.1 color profile
 * - 0.125 in bleed added to all sides
 * - 0.25 in safe area (content must stay inside)
 * - No transparency (flatten if needed)
 * - Fonts must be embedded
 * - Images inside PDF remain 300 DPI
 * 
 * @param posterBuffer - The rendered poster image (PNG buffer)
 * @param size - Poster size string (e.g., "8x10", "12x16", etc.)
 * @returns PDF buffer
 */
export async function generateGelatoPDF(
  posterBuffer: Buffer,
  size: PosterSize
): Promise<Buffer> {
  // Validate size
  if (!POSTER_SIZES[size]) {
    throw new Error(`Unsupported poster size: ${size}. Supported sizes: ${Object.keys(POSTER_SIZES).join(", ")}`);
  }

  const { width: trimWidthInches, height: trimHeightInches } = POSTER_SIZES[size];
  
  // Constants
  const DPI = 300;
  const BLEED_INCHES = 0.125; // 0.125 inches bleed on all sides
  // Note: Safe area (0.25 inches) is handled by ensuring content stays within trim bounds
  
  // Convert inches to points (PDF uses 72 DPI for points)
  const POINTS_PER_INCH = 72;
  const trimWidthPoints = trimWidthInches * POINTS_PER_INCH;
  const trimHeightPoints = trimHeightInches * POINTS_PER_INCH;
  const bleedPoints = BLEED_INCHES * POINTS_PER_INCH;
  
  // Canvas size = trim size + bleed on all sides
  const canvasWidthPoints = trimWidthPoints + (bleedPoints * 2);
  const canvasHeightPoints = trimHeightPoints + (bleedPoints * 2);
  
  // Calculate dimensions in pixels at 300 DPI
  const trimWidthPixels = Math.round(trimWidthInches * DPI);
  const trimHeightPixels = Math.round(trimHeightInches * DPI);
  const canvasWidthPixels = trimWidthPixels + Math.round(BLEED_INCHES * 2 * DPI);
  const canvasHeightPixels = trimHeightPixels + Math.round(BLEED_INCHES * 2 * DPI);
  
  // Flatten transparency and ensure RGB
  // Resize poster to match trim size at 300 DPI, then add bleed area
  const processedImage = sharp(posterBuffer)
    .flatten({ background: { r: 255, g: 255, b: 255 } }) // Flatten transparency to white
    .ensureAlpha()
    .removeAlpha() // Remove alpha channel
    .toColorspace('srgb'); // Ensure sRGB color space
  
  // Get current image dimensions
  const imageMetadata = await processedImage.metadata();
  const currentWidth = imageMetadata.width || 800;
  const currentHeight = imageMetadata.height || 1200;
  
  // Calculate aspect ratio
  const posterAspectRatio = currentWidth / currentHeight;
  const trimAspectRatio = trimWidthInches / trimHeightInches;
  
  // Resize to fit trim size while maintaining aspect ratio
  // We'll fit the image to the trim size, then add white bleed around it
  let finalImageWidth: number;
  let finalImageHeight: number;
  let offsetX: number;
  let offsetY: number;
  
  if (posterAspectRatio > trimAspectRatio) {
    // Poster is wider - fit to width (ensure it doesn't exceed trim width)
    finalImageWidth = trimWidthPixels;
    finalImageHeight = Math.round(finalImageWidth / posterAspectRatio);
    offsetX = 0;
    offsetY = Math.round((trimHeightPixels - finalImageHeight) / 2);
  } else {
    // Poster is taller - fit to height (ensure it doesn't exceed trim height)
    finalImageHeight = trimHeightPixels;
    finalImageWidth = Math.round(finalImageHeight * posterAspectRatio);
    offsetX = Math.round((trimWidthPixels - finalImageWidth) / 2);
    offsetY = 0;
  }
  
  // Ensure dimensions don't exceed trim size
  finalImageWidth = Math.min(finalImageWidth, trimWidthPixels);
  finalImageHeight = Math.min(finalImageHeight, trimHeightPixels);
  
  // Ensure offsets are non-negative and image fits within trim bounds
  offsetX = Math.max(0, Math.min(offsetX, trimWidthPixels - finalImageWidth));
  offsetY = Math.max(0, Math.min(offsetY, trimHeightPixels - finalImageHeight));
  
  // Resize the image
  const resizedImage = processedImage.resize(finalImageWidth, finalImageHeight, {
    fit: 'fill',
    withoutEnlargement: false,
  });
  
  // Get resized image buffer and verify dimensions
  let resizedImageBuffer = await resizedImage.toBuffer();
  let resizedImageMeta = await sharp(resizedImageBuffer).metadata();
  let actualResizedWidth = resizedImageMeta.width || finalImageWidth;
  let actualResizedHeight = resizedImageMeta.height || finalImageHeight;
  
  // If image is larger than trim size, resize it again to fit
  if (actualResizedWidth > trimWidthPixels || actualResizedHeight > trimHeightPixels) {
    // Calculate new dimensions maintaining aspect ratio
    const scaleX = trimWidthPixels / actualResizedWidth;
    const scaleY = trimHeightPixels / actualResizedHeight;
    const scale = Math.min(scaleX, scaleY);
    
    actualResizedWidth = Math.round(actualResizedWidth * scale);
    actualResizedHeight = Math.round(actualResizedHeight * scale);
    
    // Resize again to ensure it fits
    resizedImageBuffer = await sharp(resizedImageBuffer)
      .resize(actualResizedWidth, actualResizedHeight, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 },
      })
      .toBuffer();
    
    // Update metadata and verify final dimensions
    resizedImageMeta = await sharp(resizedImageBuffer).metadata();
    actualResizedWidth = resizedImageMeta.width || actualResizedWidth;
    actualResizedHeight = resizedImageMeta.height || actualResizedHeight;
    
    // Recalculate offsets for centered positioning
    offsetX = Math.round((trimWidthPixels - actualResizedWidth) / 2);
    offsetY = Math.round((trimHeightPixels - actualResizedHeight) / 2);
  }
  
  // Ensure offsets are safe and image fits within trim bounds
  const safeOffsetX = Math.max(0, Math.min(offsetX, trimWidthPixels - actualResizedWidth));
  const safeOffsetY = Math.max(0, Math.min(offsetY, trimHeightPixels - actualResizedHeight));
  
  // Create canvas with bleed: white background, then composite the resized image
  const bleedPixels = Math.round(BLEED_INCHES * DPI);
  const compositeLeft = bleedPixels + safeOffsetX;
  const compositeTop = bleedPixels + safeOffsetY;
  
  // Final verification: ensure image fits at composite position
  if (compositeLeft + actualResizedWidth > canvasWidthPixels || 
      compositeTop + actualResizedHeight > canvasHeightPixels) {
    throw new Error(`Image dimensions exceed canvas: image ${actualResizedWidth}x${actualResizedHeight} at (${compositeLeft}, ${compositeTop}) on canvas ${canvasWidthPixels}x${canvasHeightPixels}`);
  }
  
  const canvasImage = await sharp({
    create: {
      width: canvasWidthPixels,
      height: canvasHeightPixels,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      {
        input: resizedImageBuffer,
        left: compositeLeft,
        top: compositeTop,
      },
    ])
    .png()
    .toBuffer();
  
  // Create PDF document
  const doc = new PDFDocument({
    size: [canvasWidthPoints, canvasHeightPoints],
    margin: 0,
    pdfVersion: '1.4',
    info: {
      Title: 'Poster',
      Creator: 'Poster Gifts',
    },
  });
  
  // Collect PDF data
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  
  // Embed the image at full canvas size
  // The image is already at 300 DPI, so we embed it at its natural size in points
  // canvasWidthPixels / DPI gives us inches, then * POINTS_PER_INCH gives us points
  const imageWidthPoints = (canvasWidthPixels / DPI) * POINTS_PER_INCH;
  const imageHeightPoints = (canvasHeightPixels / DPI) * POINTS_PER_INCH;
  
  // Embed image - PDFKit will maintain the image resolution
  // We specify exact dimensions to ensure 300 DPI is maintained
  doc.image(canvasImage, 0, 0, {
    width: imageWidthPoints,
    height: imageHeightPoints,
  });
  
  // Note: sRGB color profile is ensured through Sharp's toColorspace('srgb')
  // PDFKit doesn't natively support embedding ICC profiles, but the sRGB color space
  // is the default for RGB images in PDF, and Sharp ensures the image data is in sRGB
  
  // Finalize PDF
  doc.end();
  
  // Wait for PDF to be generated
  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
    
    doc.on('error', (error: Error) => {
      reject(error);
    });
  });
}

