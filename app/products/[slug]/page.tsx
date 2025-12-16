import { MapboxStyles } from "@/lib/mapbox";
import PosterForm from "./PosterForm";

export default async function ProductPage({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ slug: string }> | { slug: string };
    searchParams: Promise<{ style?: string }> | { style?: string };
}) {
    // Handle both Promise and direct params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise 
        ? await params 
        : params;
    const { slug } = resolvedParams;
    
    // Handle both Promise and direct searchParams (Next.js 15+ uses Promise)
    const resolvedSearchParams = searchParams instanceof Promise 
        ? await searchParams 
        : searchParams;
    
    // Use style from query parameter, or default to DARK
    const style = resolvedSearchParams.style || MapboxStyles.BLACK_WHITE;

    return <PosterForm slug={slug} style={style} />;
}