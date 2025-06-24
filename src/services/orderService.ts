import { 
  getBaserowRows, 
  createBaserowRow, 
  updateBaserowRow, 
  deleteBaserowRow,
  getBaserowRow 
} from '@/lib/baserow';
import { BASEROW_TABLES } from '@/config/baserowTables';
import { getProduct } from '@/services/productService';

// Interface para pedidos do Baserow
export interface BaserowOrder {
  id: number;
  user_id: string;
  guest_email: string;
  guest_name: string;
  total: string;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: string;
  billing_address: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Interface para itens do pedido do Baserow
export interface BaserowOrderItem {
  id: number;
  order_id: string;
  product_id: string;
  quantity: string;
  price: string;
  created_at: string;
}

// Interface para produtos comprados (com informações do produto)
export interface PurchasedProduct {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  productDescription: string;
  purchaseDate: Date;
  price: number;
  quantity: number;
  status: string;
  downloadUrl?: string;
  downloadCount: number;
  expiresAt?: Date;
}

// Função para obter pedidos do usuário
export const getUserOrders = async (userId: string): Promise<BaserowOrder[]> => {
  const tableId = BASEROW_TABLES.ORDERS.id;
  
  try {
    // Buscar todos os pedidos primeiro para debug
    const allOrdersResponse = await getBaserowRows<BaserowOrder>(tableId, {
      size: 100,
      orderBy: '-created_at'
    });
    
    // Filtrar os pedidos pelo user_id no lado do cliente
    const userOrders = allOrdersResponse.results.filter(order => 
      order.user_id.toString() === userId
    );
    
    return userOrders;
  } catch (error) {
    console.error('Erro na busca de pedidos:', error);
    return [];
  }
};

// Função para obter itens de um pedido
export const getOrderItems = async (orderId: string): Promise<BaserowOrderItem[]> => {
  const tableId = BASEROW_TABLES.ORDER_ITEMS.id;
  
  const response = await getBaserowRows<BaserowOrderItem>(tableId, {
    size: 100,
    filter: {
      order_id: orderId
    }
  });
  
  return response.results;
};

// Função para obter produtos comprados pelo usuário
export const getUserPurchasedProducts = async (userId: string): Promise<PurchasedProduct[]> => {
  try {
    // Buscar pedidos do usuário
    const orders = await getUserOrders(userId);
    
    // Buscar itens de todos os pedidos
    const purchasedProducts: PurchasedProduct[] = [];
    
    for (const order of orders) {
      const orderItems = await getOrderItems(order.id.toString());
      
      for (const item of orderItems) {
        try {
          // Buscar informações do produto
          const product = await getProduct(parseInt(item.product_id));
          
          purchasedProducts.push({
            id: item.id.toString(),
            orderId: order.id.toString(),
            productId: item.product_id,
            productName: product.name,
            productImage: product.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
            productDescription: product.description || 'Descrição do produto',
            purchaseDate: new Date(order.created_at),
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            status: order.status,
            downloadCount: 0,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
          });
        } catch (productError) {
          console.error(`Erro ao buscar produto ${item.product_id}:`, productError);
          // Fallback para produto não encontrado
          purchasedProducts.push({
            id: item.id.toString(),
            orderId: order.id.toString(),
            productId: item.product_id,
            productName: `Produto ${item.product_id}`,
            productImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
            productDescription: 'Produto não encontrado',
            purchaseDate: new Date(order.created_at),
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            status: order.status,
            downloadCount: 0,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          });
        }
      }
    }
    
    return purchasedProducts;
  } catch (error) {
    console.error('Erro ao buscar produtos comprados:', error);
    return [];
  }
};

// Função para criar um novo pedido
export const createOrder = async (orderData: Omit<BaserowOrder, 'id' | 'created_at' | 'updated_at'>): Promise<BaserowOrder> => {
  const tableId = BASEROW_TABLES.ORDERS.id;
  return createBaserowRow<BaserowOrder>(tableId, orderData);
};

// Função para criar um item de pedido
export const createOrderItem = async (itemData: Omit<BaserowOrderItem, 'id' | 'created_at'>): Promise<BaserowOrderItem> => {
  const tableId = BASEROW_TABLES.ORDER_ITEMS.id;
  return createBaserowRow<BaserowOrderItem>(tableId, itemData);
};

// Função para atualizar status do pedido
export const updateOrderStatus = async (orderId: string, status: string): Promise<BaserowOrder> => {
  const tableId = BASEROW_TABLES.ORDERS.id;
  return updateBaserowRow<BaserowOrder>(tableId, parseInt(orderId), { status });
}; 