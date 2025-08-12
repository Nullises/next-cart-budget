import { Product } from "@/app/interfaces/product";

/**
 * GET ALL PRODUCTS FROM BACKEND
 * @returns Promise with Array Products
 * @throws Error if fails retrieving products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/products");

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
