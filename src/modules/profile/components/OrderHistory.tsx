import { useEffect, useState } from 'react';
import { useOrders, useOrderWithItems } from '../hooks/useOrders';
import { OrderStatus } from '../types/order';
import { formatCurrency } from '../utils/orders';


// Function to generate status badge based on order status
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = {
    created: { label: 'Creada', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
    processing: { label: 'Procesando', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400' },
    shipped: { label: 'Enviada', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
    completed: { label: 'Completada', bgColor: 'bg-green-500/20', textColor: 'text-green-400' },
    delivered: { label: 'Entregada', bgColor: 'bg-green-500/20', textColor: 'text-green-400' },
    cancelled: { label: 'Cancelada', bgColor: 'bg-red-500/20', textColor: 'text-red-400' }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.label}
    </span>
  );
};

export function OrderHistory() {
  const { data: orders, isLoading, error } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { data: orderDetails } = useOrderWithItems(expandedOrderId);

  useEffect(() => {
    if(!orders ) return
    console.log(orders)
  }, [orders])

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-light mb-6">Historial de órdenes</h2>
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-white/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-light mb-6">Historial de órdenes</h2>
        <div className="text-center py-8 text-red-400">
          <p className="mb-2">Error al cargar las órdenes</p>
          <p className="text-sm opacity-70">{error instanceof Error ? error.message : 'Se produjo un error desconocido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h2 className="text-xl font-light mb-6">Historial de órdenes</h2>

      {orders && orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">No tienes órdenes todavía</p>
          <button className="px-4 py-2 bg-white text-black rounded hover:bg-white/90">
            Explorar productos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders && orders.map((order) => (
            <div
              key={order.id}
              className="border border-white/10 rounded-lg overflow-hidden"
            >
              {/* Order summary row */}
              <div
                className="flex flex-wrap justify-between items-center p-4 cursor-pointer hover:bg-white/5"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex flex-col mb-2 md:mb-0">
                  <span className="text-white font-medium">Orden #{order.id.slice(0, 8)}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <StatusBadge status={order.status} />
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                  <span className="text-gray-400">
                    {expandedOrderId === order.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Order details - Only visible when expanded and details are loaded */}
              {expandedOrderId === order.id && orderDetails && (
                <div className="border-t border-white/10 p-4 bg-black/20">
                  <h3 className="text-sm text-gray-400 mb-2">Productos</h3>
                  <ul className="space-y-2">
                    {orderDetails.items.map((item) => (
                      <li key={item.id} className="flex justify-between items-center py-1">
                        <div className="flex items-center">
                          {item.product.thumbnail_path ? (
                            <div className="w-10 h-10 bg-white/10 rounded mr-3 flex items-center justify-center overflow-hidden">
                              <img 
                                src={`/thumbnails/${item.product.thumbnail_path}`} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-white/10 rounded mr-3 flex items-center justify-center">
                              <span className="text-xs">{item.product.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <span>{item.product.name}</span>
                            <span className="text-gray-400 ml-2">x{item.quantity}</span>
                          </div>
                        </div>
                        <span>{formatCurrency(item.price_at_purchase)}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                    <span>Total</span>
                    <span className="font-medium">{formatCurrency(orderDetails.total)}</span>
                  </div>
                  
                  {orderDetails.shipping_address && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h3 className="text-sm text-gray-400 mb-2">Dirección de envío</h3>
                      <p>{orderDetails.shipping_address.name}</p>
                      <p>{orderDetails.shipping_address.street}</p>
                      <p>{orderDetails.shipping_address.city}, {orderDetails.shipping_address.state} {orderDetails.shipping_address.zip}</p>
                      <p>{orderDetails.shipping_address.country}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h3 className="text-sm text-gray-400 mb-2">Estado de la orden</h3>
                    <div className="flex items-center">
                      <StatusBadge status={orderDetails.status} />
                      <span className="ml-2">
                        {orderDetails.status === 'created' && 'Esperando confirmación'}
                        {orderDetails.status === 'processing' && 'Procesando tu pedido'}
                        {orderDetails.status === 'shipped' && 'En camino a tu dirección'}
                        {orderDetails.status === 'delivered' && 'Entregado'}
                        {orderDetails.status === 'cancelled' && 'Orden cancelada'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons based on order status */}
                  <div className="mt-4 flex justify-end space-x-3">
                    {orderDetails.status === 'delivered' && (
                      <button 
                        className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded"
                        type="button"
                      >
                        Escribir reseña
                      </button>
                    )}
                    
                    {(orderDetails.status === 'created' || orderDetails.status === 'processing') && (
                      <button 
                        className="px-3 py-1.5 text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded"
                        type="button"
                      >
                        Cancelar orden
                      </button>
                    )}
                    
                    <button 
                      className="px-3 py-1.5 text-sm bg-white text-black rounded hover:bg-white/90"
                      type="button"
                    >
                      Ver detalles completos
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
