import { CREATE_ORDER_URL, Order } from "./const";

export async function createOrder(order: Order) {
    try {
        const response = await fetch(`${CREATE_ORDER_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create order");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}