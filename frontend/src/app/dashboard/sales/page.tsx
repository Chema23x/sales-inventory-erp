// src/app/dashboard/sales/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { saleService } from '@/services/saleService';
import { Product } from '@/types/inventory';
import { CartItem } from '@/types/sales';

export default function SalesPOSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar catálogo inicial de productos para el buscador
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await productService.getProducts(1, 100); // Trae hasta 100 productos para el POS
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Agregar artículo al carrito validando stock disponible
  const addToCart = (product: Product) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    const currentQtyInCart = existingIndex !== -1 ? cart[existingIndex].quantity : 0;

    if (product.stock <= currentQtyInCart) {
      setError(`No puedes agregar más unidades de '${product.name}'. Stock máximo alcanzado.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  // Remover o decrementar un artículo del carrito
  const removeFromCart = (productId: string) => {
    const existingIndex = cart.findIndex(item => item.product.id === productId);
    if (existingIndex === -1) return;

    const updatedCart = [...cart];
    if (updatedCart[existingIndex].quantity > 1) {
      updatedCart[existingIndex].quantity -= 1;
      setCart(updatedCart);
    } else {
      setCart(cart.filter(item => item.product.id !== productId));
    }
  };

  // Calcular el total de la orden
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);

  // Procesar ticket de venta definitivo
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      setSubmitting(true);
      setError(null);

      // Mapeo seguro al contrato exigido por el backend
      const salePayload = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      await saleService.createSale(salePayload);
      setSuccess('¡Venta procesada exitosamente! El stock ha sido descontado.');
      setCart([]); // Limpiar carrito
      
      // Refrescar catálogo local para actualizar los números de stock reflejados
      const data = await productService.getProducts(1, 100);
      setProducts(data.products);

      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Error al procesar el cobro.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrar catálogo según la barra de búsqueda (por Nombre o SKU)
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-6 max-w-7xl w-full mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Encabezado */}
      <header className="border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 select-none">
          <Link href="/dashboard" className="hover:text-zinc-300 transition">Dashboard</Link>
          <span>/</span>
          <span className="text-zinc-400">Ventas (POS)</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Terminal de Ventas</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Punto de venta interactivo. Selecciona productos y genera tiques comerciales al instante.</p>
      </header>

      {/* Banners Informativos */}
      {error && <div className="p-3 rounded-xl bg-red-950/30 border border-red-800 text-red-400 text-xs font-medium">{error}</div>}
      {success && <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800 text-emerald-400 text-xs font-medium animate-pulse">{success}</div>}

      {/* Rejilla de Trabajo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* COLUMNA IZQUIERDA: BUSCADOR Y CATÁLOGO (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar producto por nombre o código SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <svg className="absolute left-3 top-3 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-2 max-h-[550px] overflow-y-auto divide-y divide-zinc-800/40">
            {loading ? (
              <div className="p-8 text-center text-xs text-zinc-500 animate-pulse">Cargando inventario...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">No se encontraron productos coincidentes.</div>
            ) : (
              filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-zinc-900/60 rounded-xl transition-colors group disabled:opacity-40"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">{product.name}</p>
                    <p className="text-xs text-zinc-500 font-mono">SKU: {product.sku} | Disponibles: {product.stock} uds</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">${product.salePrice.toFixed(2)}</p>
                    <p className="text-[10px] text-emerald-500 font-medium group-hover:underline mt-0.5">Agregar +</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: EL CARRITO / TICKET DE COBRO (5/12) */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl sticky top-6">
          <div className="border-b border-zinc-800 bg-zinc-950/40 px-5 py-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Resumen de Venta</h2>
            <span className="text-xs font-mono text-zinc-500">{cart.length} ítems</span>
          </div>

          {/* Listado del Carrito */}
          <div className="p-4 flex-1 max-h-[350px] overflow-y-auto space-y-2 min-h-[200px]">
            {cart.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-zinc-500 text-xs space-y-2 select-none">
                <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <p>El carrito de compras está vacío.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-xs">
                  <div className="space-y-0.5 flex-1 pr-2">
                    <p className="font-medium text-zinc-200 truncate max-w-[180px]">{item.product.name}</p>
                    <p className="text-zinc-500 font-mono">${item.product.salePrice.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
                      <button onClick={() => removeFromCart(item.product.id)} className="px-2 py-1 bg-zinc-900 text-zinc-400 hover:text-white transition-colors">-</button>
                      <span className="px-3 font-semibold text-zinc-200">{item.quantity}</span>
                      <button onClick={() => addToCart(item.product)} className="px-2 py-1 bg-zinc-900 text-zinc-400 hover:text-white transition-colors">+</button>
                    </div>
                    <p className="font-bold text-white w-16 text-right">${(item.product.salePrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sección de Totales y Checkout */}
          <div className="border-t border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex items-center justify-between select-none">
              <span className="text-sm font-semibold text-zinc-400">Total a Cobrar:</span>
              <span className="text-2xl font-black text-emerald-400">${cartTotal.toFixed(2)} <span className="text-xs font-normal text-zinc-500">MXN</span></span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || submitting}
              className="w-full rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-bold py-3 text-sm transition tracking-wide active:scale-[0.99] disabled:pointer-events-none"
            >
              {submitting ? 'Procesando Pago...' : 'Confirmar Venta y Cobrar'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
