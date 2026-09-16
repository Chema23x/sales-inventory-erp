// src/app/dashboard/inventory/ProductModal.tsx
'use client';

import React, { useState } from 'react';
import { productService } from '@/services/productService';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

export default function ProductModal({ isOpen, onClose, onProductCreated }: ProductModalProps) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('0');
  const [minStock, setMinStock] = useState('5');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClearForm = () => {
    setSku('');
    setName('');
    setDescription('');
    setPurchasePrice('');
    setSalePrice('');
    setStock('0');
    setMinStock('5');
    setError(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Consumimos el servicio de la Fase 5 con la envoltura tipada segura
      await productService.createProduct({
        sku: sku.trim(),
        name: name.trim(),
        description: description.trim() || null,
        purchasePrice: Number(purchasePrice),
        salePrice: Number(salePrice),
        stock: Number(stock),
        minStock: Number(minStock),
      });

      onProductCreated();
      handleClearForm();
      onClose();
    } catch (err: any) {
      // Atrapa y renderiza de forma limpia errores como "El SKU ya existe" enviado por Express
      setError(err.message || 'Ocurrió un error inesperado al registrar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Encabezado */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">Registrar Nuevo Artículo</h3>
          <p className="text-xs text-zinc-400">Ingresa los datos generales, costos y parámetros de inventario del producto.</p>
        </div>

        {/* Panel de Errores Defensivo */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-800 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Formulario Estricto */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sku" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Código SKU *
              </label>
              <input
                id="sku"
                type="text"
                required
                autoComplete="off"
                placeholder="ej. PROD-1001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Nombre del Artículo *
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="off"
                placeholder="ej. Monitor Gamer 24\"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Descripción Opcional
            </label>
            <input
              id="description"
              type="text"
              autoComplete="off"
              placeholder="Detalles sobre el lote, marca o características físicas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="purchasePrice" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Costo Compra (MXN) *
              </label>
              <input
                id="purchasePrice"
                type="number"
                step="0.01"
                required
                min="0"
                placeholder="0.00"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="salePrice" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Precio Venta (MXN) *
              </label>
              <input
                id="salePrice"
                type="number"
                step="0.01"
                required
                min="0"
                placeholder="0.00"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Existencias Iniciales
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors font-semibold"
              />
            </div>

            <div>
              <label htmlFor="minStock" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Stock Mínimo (Alerta)
              </label>
              <input
                id="minStock"
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                handleClearForm();
                onClose();
              }}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Guardar Artículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
