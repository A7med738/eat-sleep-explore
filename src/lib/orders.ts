// خدمة إدارة الطلبات
export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: string;
    image: string;
    category: string;
  }>;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

class OrderService {
  private storageKey = 'orders';

  // الحصول على جميع الطلبات
  getAll(): Order[] {
    try {
      const orders = localStorage.getItem(this.storageKey);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('خطأ في تحميل الطلبات:', error);
      return [];
    }
  }

  // الحصول على طلب محدد
  getById(id: string): Order | null {
    const orders = this.getAll();
    return orders.find(order => order.id === id) || null;
  }

  // إضافة طلب جديد
  add(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getAll();
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    orders.unshift(newOrder);
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    return newOrder;
  }

  // تحديث حالة الطلب
  updateStatus(id: string, status: Order['status'], notes?: string): Order | null {
    const orders = this.getAll();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) return null;
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      notes: notes || orders[orderIndex].notes,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    return orders[orderIndex];
  }

  // حذف طلب
  delete(id: string): boolean {
    const orders = this.getAll();
    const filteredOrders = orders.filter(order => order.id !== id);
    
    if (filteredOrders.length === orders.length) return false;
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredOrders));
    return true;
  }

  // الحصول على إحصائيات الطلبات
  getStats(): OrderStats {
    const orders = this.getAll();
    const today = new Date().toDateString();
    
    const todayOrders = orders.filter(order => 
      new Date(order.orderDate).toDateString() === today
    ).length;
    
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
    ).length;
    
    const completedOrders = orders.filter(order => 
      order.status === 'delivered'
    ).length;
    
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalPrice, 0);
    
    return {
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalRevenue,
      todayOrders,
    };
  }

  // الحصول على الطلبات حسب الحالة
  getByStatus(status: Order['status']): Order[] {
    const orders = this.getAll();
    return orders.filter(order => order.status === status);
  }

  // البحث في الطلبات
  search(query: string): Order[] {
    const orders = this.getAll();
    const lowerQuery = query.toLowerCase();
    
    return orders.filter(order => 
      order.customerName.toLowerCase().includes(lowerQuery) ||
      order.customerPhone.includes(query) ||
      order.customerAddress.toLowerCase().includes(lowerQuery) ||
      order.items.some(item => item.name.toLowerCase().includes(lowerQuery))
    );
  }
}

export const orderService = new OrderService();
