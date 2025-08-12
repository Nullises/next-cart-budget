import { CartItem } from "@/app/interfaces/cartItem";

const API_URL = "http://localhost:3000/api/cart";

/**
 * GET CURRENT CART
 */
export const getCart = async (): Promise<CartItem[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("No se pudo obtener el carrito del backend.");
  }
  return response.json();
};

/**
 * SEND PRODUCT TO ADD TO CART
 */
export const postToCart = async (
  productId: number,
  quantity: number = 1
): Promise<CartItem[]> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: productId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al agregar el producto al carrito."
    );
  }
  return response.json();
};

/**
 * CLEAR CART
 */
export const clearBackendCart = async (): Promise<CartItem[]> => {
  const response = await fetch(API_URL, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("No se pudo limpiar el carrito en el backend.");
  }
  return response.json();
};
