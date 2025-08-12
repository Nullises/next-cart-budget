"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product } from "@/app/interfaces/product";
import { getProducts } from "@/actions/products/productsActions";
import { useCart } from "@/context/cartContext";

// --- TIPOS LOCALES ---
type PopulatedCartItem = Product & { quantity: number };

// --- COMPONENTES DE UI ---
const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex items-center p-4 space-x-4">
    <img
      src={product.image}
      alt={product.title}
      className="w-16 h-16 object-contain"
    />
    <div className="flex-grow">
      <h3 className="font-semibold text-gray-800">{product.title}</h3>
      <p className="text-sm text-gray-500 capitalize">{product.category}</p>
    </div>
    <span className="text-lg font-bold text-gray-900">
      ${product.price.toFixed(2)}
    </span>
  </div>
);

const CartDisplayItem = ({ item }: { item: PopulatedCartItem }) => (
  <li className="py-3 flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <img
        src={item.image}
        alt={item.title}
        className="w-12 h-12 object-contain rounded"
      />
      <div>
        <p className="font-semibold text-sm text-gray-900">{item.title}</p>
        <p className="text-xs text-gray-600">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>
    </div>
    <p className="font-bold text-md text-gray-900">
      ${(item.price * item.quantity).toFixed(2)}
    </p>
  </li>
);

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [budget, setBudget] = useState(150);
  const [localBudgetInput, setLocalBudgetInput] = useState(String(budget));

  const {
    cart,
    isLoading: isCartLoading,
    error: cartError,
    calculateAndSetOptimalCart,
  } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (err) {
        if (err instanceof Error) setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCalculateClick = async () => {
    if (allProducts.length > 0) {
      await calculateAndSetOptimalCart(allProducts, budget);
    }
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalBudgetInput(e.target.value);
  };

  const handleBudgetBlur = () => {
    const newBudget = parseFloat(localBudgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setBudget(newBudget);
      setLocalBudgetInput(String(newBudget));
    } else {
      setLocalBudgetInput(String(budget));
    }
  };

  const populatedCart = useMemo((): PopulatedCartItem[] => {
    return cart
      .map((cartItem) => {
        const productDetails = allProducts.find((p) => p.id === cartItem.id);
        if (!productDetails) return null;
        return { ...productDetails, quantity: cartItem.quantity };
      })
      .filter((item): item is PopulatedCartItem => item !== null);
  }, [cart, allProducts]);

  const totalCost = useMemo(
    () =>
      populatedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [populatedCart]
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Compra Inteligente
          </h1>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              Catálogo de Productos
            </h2>
            {productsLoading && <p>Cargando productos...</p>}
            {productsError && (
              <p className="text-red-600 bg-red-100 p-4 rounded-lg">
                {productsError}
              </p>
            )}
            {!productsLoading && !productsError && (
              <div className="space-y-4">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
          <div className="sticky top-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Panel de Control</h2>
              <div className="mb-4">
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Define tu Presupuesto
                </label>
                <input
                  type="text"
                  id="budget"
                  value={localBudgetInput}
                  onChange={handleBudgetChange}
                  onBlur={handleBudgetBlur}
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <button
                onClick={handleCalculateClick}
                disabled={productsLoading || isCartLoading}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isCartLoading ? "Calculando..." : "Calcular Compra Óptima"}
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
              {isCartLoading && <p>Actualizando carrito...</p>}
              {cartError && <p className="text-red-500">{cartError}</p>}
              {!isCartLoading && populatedCart.length === 0 && (
                <p className="text-gray-500">El carrito está vacío.</p>
              )}
              {!isCartLoading && populatedCart.length > 0 && (
                <>
                  <ul className="divide-y divide-gray-200">
                    {populatedCart.map((item) => (
                      <CartDisplayItem key={item.id} item={item} />
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t-2 border-dashed">
                    <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                      <span>Total:</span>
                      <span>${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
