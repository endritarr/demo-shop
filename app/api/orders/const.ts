const HEADERS = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.GELATO_API_KEY || "",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const ORDER_BASE_URL = "https://order.gelatoapis.com/v4";
const ORDER_QUOTE_URL = `${ORDER_BASE_URL}/orders:quote`;
const ORDER_CREATE_URL = `${ORDER_BASE_URL}/orders`;
const ORDER_CANCEL_URL = `${ORDER_BASE_URL}/orders:cancel`;
const ORDER_GET_URL = `${ORDER_BASE_URL}/orders`;
const ORDER_LIST_URL = `${ORDER_BASE_URL}/orders`;
const ORDER_UPDATE_URL = `${ORDER_BASE_URL}/orders`;
const ORDER_DELETE_URL = `${ORDER_BASE_URL}/orders`;

export { BASE_URL, ORDER_QUOTE_URL, HEADERS, ORDER_CREATE_URL, ORDER_CANCEL_URL, ORDER_GET_URL, ORDER_LIST_URL, ORDER_UPDATE_URL, ORDER_DELETE_URL };