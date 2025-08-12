import { CartItem } from "@/app/interfaces/cartItem";
import { Product } from "@/app/interfaces/product";
import { products } from "@/lib/products";
import { handleClientError, handleError } from "@/lib/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

type PopulatedCartItem = Product & { quantity: number };

let cart: CartItem[] = [];

/**
 * Populate Cart with products
 * @param simpleCart CART WITH ONLY IDS
 * @returns ARRAY WITH COMPLETE PRODUCTS
 */
const populateCart = (simpleCart: CartItem[]): PopulatedCartItem[] => {
  return simpleCart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);

      if (product) {
        return { ...product, quantity: item.quantity };
      }

      return null;
    })
    .filter((item) => item !== null) as PopulatedCartItem[];
};

/**
 * GET CART
 * @returns JSON WITH CURRENT CART
 */
export async function GET() {
  const populatedCart = populateCart(cart);
  return NextResponse.json(populatedCart, { status: 200 });
}

/**
 * POST PRODUCT ID IN CART
 * @param request BODY MUST BE A JSON WITH ID OF PRODUCT IF EXISTS {"id": 1, "quantity": 5}
 * @returns JSON WITH CURRENT CART AND UPDATED PRODUCTS
 */
export async function POST(request: NextRequest) {
  try {
    const { id, quantity = 1 } = await request.json();

    if (typeof id !== "number") {
      return handleClientError(
        "El 'id' del producto es requerido y debe ser un número."
      );
    }
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return handleClientError(
        "La 'cantidad' debe ser un número entero y positivo."
      );
    }

    const productExists = products.some((p) => p.id === id);
    if (!productExists) {
      return handleClientError(`El producto con id ${id} no existe.`);
    }

    const existingProductIndex = cart.findIndex((item) => item.id === id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ id: id, quantity: quantity });
    }

    const populatedCart = populateCart(cart);
    return NextResponse.json(populatedCart, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return handleClientError(
        "El cuerpo de la solicitud no es un JSON válido."
      );
    }
    return handleError(error);
  }
}

/**
 * DELETE CART
 */
export async function DELETE() {
  cart = [];
  return NextResponse.json(cart, { status: 200 });
}
