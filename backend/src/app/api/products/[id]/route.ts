import { Product } from "@/app/interfaces/product";
import { products } from "@/lib/products";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET PRODUCT BY ID
 * @param _request The NextRequest object
 * @param context The context containing dynamic route parameters.
 * @returns JSON with the product object or a 404 error if not found.
 */
export async function GET(
  _request: Request,
  context: RouteContext
): Promise<NextResponse<Product | { message: string }>> {
  const productId = parseInt(context.params.id, 10);

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
