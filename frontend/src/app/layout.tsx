import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tienda Online con Presupuesto",
  description: "Prueba técnica de Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
