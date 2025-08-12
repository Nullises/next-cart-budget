import { NextResponse } from "next/server";
import { products } from "@/lib/products";
import { Product } from "@/app/interfaces/product";

/**
 * GET ALL PRODUCTS
 * @returns JSON WITH PRODUCTS ARRAY
 */
export async function GET(): Promise<NextResponse<Product[]>> {
  return NextResponse.json(products);
}
