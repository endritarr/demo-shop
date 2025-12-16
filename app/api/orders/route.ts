import { NextResponse, NextRequest } from "next/server";
import { ORDER_CREATE_URL, ORDER_GET_URL, HEADERS } from "./const";
import { Order } from "@/lib/gelato/const";

export async function POST(request: NextRequest) {
    try {
        const order: Order = await request.json();
        
        console.log("Received order request:", JSON.stringify(order, null, 2));
        console.log("Sending to Gelato API:", ORDER_CREATE_URL);
        console.log("Headers:", { ...HEADERS, "X-API-KEY": "***" });
            
        const response = await fetch(ORDER_CREATE_URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(order),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText || "Failed to create order" };
            }
            console.error("Gelato API Error:", {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            return NextResponse.json(
                { 
                    error: errorData.message || errorData.error || "Failed to create order",
                    details: errorData
                },
                { status: response.status }
            );
        }
        
        const data = await response.json();
        return NextResponse.json({
            success: true,
            order: data,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const orderId = request.nextUrl.searchParams.get("orderId");
        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }
        const response = await fetch(`${ORDER_GET_URL}/${orderId}`, {
            method: "GET",
            headers: HEADERS,
        });
        if (!response.ok) {
            throw new Error("Failed to get order");
        }
        const data = await response.json();
        return NextResponse.json({
            success: true,
            order: data,
        });
    } catch (error) {
        console.error("Error getting order:", error);
        return NextResponse.json({ error: "Failed to get order" }, { status: 500 });
    }
}