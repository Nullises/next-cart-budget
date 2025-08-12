import { NextResponse, NextRequest } from "next/server";
import { products } from "@/lib/products";
import { Product } from "@/app/interfaces/product";

/**
 * GET PRODUCT BY ID
 * @param request The NextRequest object (not used, but required by convention).
 * @param params The dynamic route parameters destructured from the context.
 * @returns JSON with the product object or a 404 error if not found.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Product | { message: string }>> {
  const productId = parseInt(params.id, 10);

  if (isNaN(productId)) {
    return NextResponse.json(
      { message: "El ID del producto debe ser un número." },
      { status: 400 }
    );
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json(
      { message: `Producto con ID ${productId} no encontrado.` },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
