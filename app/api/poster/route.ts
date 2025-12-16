import { NextResponse } from "next/server";
import { generateMapImage, MapboxStyles } from "@/lib/mapbox";
import { generatePosterImage, generateGelatoPDF, PosterSize } from "@/lib/poster-generator";

export async function POST(request: Request) {
  try {
    const { title, date, text, name, location, style, zoom, shape, format, size } = await request.json();

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    // Use provided style, or default to dark style (has black roads)
    const mapStyle = style || MapboxStyles.DARK;

    // Generate map image with marker at center
    const mapData = await generateMapImage(location, { 
      style: mapStyle,
      showMarker: true,
      markerColor: "ff0000", // Red marker
      zoom: zoom || 14 // Use provided zoom or default to 14 (closer view)
    });

    // Fetch the map image as buffer
    const mapImageResponse = await fetch(mapData.mapImageUrl);
    if (!mapImageResponse.ok) {
      throw new Error("Failed to fetch map image");
    }
    const mapImageBuffer = Buffer.from(await mapImageResponse.arrayBuffer());

    // Format date for display (convert from YYYY-MM-DD to readable format)
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
        return date.toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        });
      } catch {
        return dateString;
      }
    };

    const formattedDate = formatDate(date || "");
    
    // Debug logging
    console.log("Poster generation - Text:", text, "Date:", date, "Formatted Date:", formattedDate);

    // Generate poster with map and text
    const posterBuffer = await generatePosterImage({
      mapImageBuffer,
      title: title || "",
      date: formattedDate,
      text: text || "",
      name: name || "",
      location: mapData.placeName,
      width: 800,
      height: 1200,
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      shape: shape || "rectangle", // Default to rectangle, can be "heart" or "circle"
    });

    // If PDF format is requested, generate PDF instead of PNG
    if (format === "pdf") {
      if (!size || !["8x10", "12x16", "16x20", "18x24", "24x36"].includes(size)) {
        return NextResponse.json(
          { error: "Valid size is required for PDF format. Supported sizes: 8x10, 12x16, 16x20, 18x24, 24x36" },
          { status: 400 }
        );
      }

      const pdfBuffer = await generateGelatoPDF(posterBuffer, size as PosterSize);

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="poster-${size}.pdf"`,
        },
      });
    }

    // Default: return PNG as before
    // Convert to base64 for JSON response
    const posterBase64 = posterBuffer.toString('base64');
    const posterDataUrl = `data:image/png;base64,${posterBase64}`;

    return NextResponse.json({
      success: true,
      title: title || "",
      text: text || "",
      location: mapData.placeName,
      coordinates: {
        latitude: mapData.latitude,
        longitude: mapData.longitude,
      },
      mapImageUrl: mapData.mapImageUrl,
      mapImageDataUrl: mapData.mapImageDataUrl,
      posterDataUrl: posterDataUrl,
    });
  } catch (error) {
    console.error("Error generating poster:", error);
    
    const statusCode = error instanceof Error && error.message === "Location not found" 
      ? 404 
      : 500;

    return NextResponse.json(
      { 
        error: "Failed to generate poster", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: statusCode }
    );
  }
}