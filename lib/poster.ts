export async function generatePoster(
    title: string, 
    description: string, 
    location: string,
    style?: string
) {
    // Construct absolute URL - required when calling fetch from server-side code
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/poster`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, location, style }),
    });
    
    if (!response.ok) {
        throw new Error(`Failed to generate poster: ${response.statusText}`);
    }
    
    return response.json();
}
