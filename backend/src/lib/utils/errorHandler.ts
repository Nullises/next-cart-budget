import { NextResponse } from "next/server";

/**
 * Server Error Handler
 * @param {unknown} error - Error
 * @param {number} [status=500] - HTTP Status Code (500 - Server Error)
 * @returns {NextResponse} Response
 */
export function handleError(
  error: unknown,
  status: number = 500
): NextResponse {
  console.error("API Error:", error);

  return NextResponse.json(
    { message: "Ha ocurrido un error en el servidor." },
    { status }
  );
}

/**
 * Client Error Handler
 * @param {string} message - Error Message
 * @returns {NextResponse} Response with Status Code
 */
export function handleClientError(message: string): NextResponse {
  return NextResponse.json({ message }, { status: 400 });
}
