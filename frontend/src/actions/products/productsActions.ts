import { Product } from "@/app/interfaces/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET ALL PRODUCTS FROM BACKEND
 * @returns Promise with Array Products
 * @throws Error if fails retrieving products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};
