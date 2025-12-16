// Use relative URL to call Next.js API route (avoids CORS issues)
export const CREATE_ORDER_URL = "/api/orders";

export type Order = {
    orderType: "order";
    orderReferenceId: string;
    customerReferenceId?: string;
    currency: string;
    items: {
        itemReferenceId: string;
        productUid: string;
        files: {
            type: string;
            url: string;
        }[];
        quantity: number;
    }[];
    shipmentMethodUid?: string;
    shippingAddress: {
        companyName?: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        addressLine2?: string;
        state?: string;
        city: string;
        postCode: string;
        country: string;
        email: string;
        phone: string;
    };
    returnAddress?: {
        companyName?: string;
        addressLine1: string;
        addressLine2?: string;
        state: string;
        city: string;
        postCode: string;
        country: string;
        email: string;
        phone: string;
    };
    metadata?: {
        key: string;
        value: string;
    }[];
}