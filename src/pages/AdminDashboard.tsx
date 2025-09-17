import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Home,
  Utensils,
  Tag,
  Eye,
  Activity,
  Settings,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AddMenuItem from "@/components/AddMenuItem";
import ManageCategories from "@/components/ManageCategories";
import { menuService, categoryService, adminActionService, MenuItem, Category, AdminAction } from "@/lib/supabase";
import { orderService, Order, OrderStats } from "@/lib/orders";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0
  });
  const [activeTab, setActiveTab] = useState("menu");
  const [loading, setLoading] = useState(true);
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: '',
    chatId: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من تسجيل الدخول
    const isAuthenticated = localStorage.getItem("adminAuth");
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    // تحميل البيانات من Supabase
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // تحميل البيانات من Supabase
      const [menuData, categoryData, actionsData] = await Promise.all([
        menuService.getAll(),
        categoryService.getAll(),
        adminActionService.getActions()
      ]);

      setMenuItems(menuData);
      setCategories(categoryData);
      setAdminActions(actionsData);
      
      // تحميل الطلبات والإحصائيات
      const ordersData = orderService.getAll();
      const statsData = orderService.getStats();
      setOrders(ordersData);
      setOrderStats(statsData);
      
      // تحميل إعدادات تيليجرام
      const savedSettings = localStorage.getItem('telegramSettings');
      if (savedSettings) {
        setTelegramSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات من قاعدة البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const handleSaveTelegramSettings = () => {
    localStorage.setItem('telegramSettings', JSON.stringify(telegramSettings));
    toast({
      title: "تم الحفظ",
      description: "تم حفظ إعدادات تيليجرام بنجاح",
    });
  };

  // دوال إدارة الطلبات
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status'], notes?: string) => {
    try {
      const updatedOrder = orderService.updateStatus(orderId, newStatus, notes);
      if (updatedOrder) {
        setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
        setOrderStats(orderService.getStats());
        
        await logAdminAction(
          "UPDATE_ORDER_STATUS",
          `تم تحديث حالة الطلب ${orderId} إلى ${getStatusText(newStatus)}`,
          orderId
        );
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث حالة الطلب بنجاح",
        });
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الطلب:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const success = orderService.delete(orderId);
      if (success) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        setOrderStats(orderService.getStats());
        
        await logAdminAction(
          "DELETE_ORDER",
          `تم حذف الطلب ${orderId}`,
          orderId
        );
        
        toast({
          title: "تم بنجاح",
          description: "تم حذف الطلب بنجاح",
        });
      }
    } catch (error) {
      console.error('خطأ في حذف الطلب:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الطلب",
        variant: "destructive"
      });
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      ready: 'جاهز للاستلام',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Order['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const logAdminAction = async (actionType: string, description: string, targetItem?: string) => {
    try {
      await adminActionService.logAction({
        action_type: actionType,
        action_description: description,
        admin_user: "admin",
        target_item: targetItem
      });
    } catch (error) {
      console.error('خطأ في تسجيل الإجراء:', error);
    }
  };

  const handleAddMenuItem = async (newItem: Omit<MenuItem, "id" | "created_at" | "updated_at">) => {
    try {
      const createdItem = await menuService.create(newItem);
      setMenuItems(prev => [createdItem, ...prev]);
      
      await logAdminAction(
        "CREATE_MENU_ITEM",
        `تم إضافة طبق جديد: ${newItem.name}`,
        newItem.name
      );
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الطبق الجديد بنجاح",
      });
    } catch (error) {
      console.error('خطأ في إضافة الطبق:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الطبق",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMenuItem = async (id: number, updatedItem: Partial<MenuItem>) => {
    try {
      const updated = await menuService.update(id, updatedItem);
      setMenuItems(prev => prev.map(item => item.id === id ? updated : item));
      
      await logAdminAction(
        "UPDATE_MENU_ITEM",
        `تم تحديث طبق: ${updatedItem.name || 'غير محدد'}`,
        updatedItem.name
      );
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث الطبق بنجاح",
      });
    } catch (error) {
      console.error('خطأ في تحديث الطبق:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الطبق",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    try {
      const itemToDelete = menuItems.find(item => item.id === id);
      await menuService.delete(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      
      await logAdminAction(
        "DELETE_MENU_ITEM",
        `تم حذف طبق: ${itemToDelete?.name || 'غير محدد'}`,
        itemToDelete?.name
      );
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف الطبق بنجاح",
      });
    } catch (error) {
      console.error('خطأ في حذف الطبق:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الطبق",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, "id" | "created_at" | "updated_at">) => {
    try {
      const createdCategory = await categoryService.create(newCategory);
      setCategories(prev => [createdCategory, ...prev]);
      
      await logAdminAction(
        "CREATE_CATEGORY",
        `تم إضافة فئة جديدة: ${newCategory.name}`,
        newCategory.name
      );
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الفئة الجديدة بنجاح",
      });
    } catch (error) {
      console.error('خطأ في إضافة الفئة:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الفئة",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async (id: number, updatedCategory: Partial<Category>) => {
    try {
      const updated = await categoryService.update(id, updatedCategory);
      setCategories(prev => prev.map(category => category.id === id ? updated : category));
      
      await logAdminAction(
        "UPDATE_CATEGORY",
        `تم تحديث فئة: ${updatedCategory.name || 'غير محدد'}`,
        updatedCategory.name
      );
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث الفئة بنجاح",
      });
    } catch (error) {
      console.error('خطأ في تحديث الفئة:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الفئة",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const categoryToDelete = categories.find(category => category.id === id);
      await categoryService.delete(id);
      setCategories(prev => prev.filter(category => category.id !== id));
      
      await logAdminAction(
        "DELETE_CATEGORY",
        `تم حذف فئة: ${categoryToDelete?.name || 'غير محدد'}`,
        categoryToDelete?.name
      );
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف الفئة بنجاح",
      });
    } catch (error) {
      console.error('خطأ في حذف الفئة:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الفئة",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Utensils className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold font-arabic">لوحة تحكم الإدارة</h1>
                <p className="text-sm opacity-90 font-arabic">إدارة مطعم كل ونام</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Eye className="w-4 h-4 ml-2" />
                عرض الموقع
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="menu" className="font-arabic">
              <Utensils className="w-4 h-4 ml-2" />
              إدارة الأطباق
            </TabsTrigger>
            <TabsTrigger value="categories" className="font-arabic">
              <Tag className="w-4 h-4 ml-2" />
              إدارة الفئات
            </TabsTrigger>
            <TabsTrigger value="orders" className="font-arabic">
              <ShoppingCart className="w-4 h-4 ml-2" />
              إدارة الطلبات
            </TabsTrigger>
            <TabsTrigger value="actions" className="font-arabic">
              <Activity className="w-4 h-4 ml-2" />
              سجل الإجراءات
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-arabic">
              <Settings className="w-4 h-4 ml-2" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="stats" className="font-arabic">
              <Home className="w-4 h-4 ml-2" />
              الإحصائيات
            </TabsTrigger>
          </TabsList>

          {/* Menu Management */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-arabic">إدارة الأطباق</h2>
              <AddMenuItem
                categories={categories}
                onAdd={handleAddMenuItem}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {item.isPopular && (
                      <Badge className="absolute top-3 right-3 bg-gradient-warm text-primary-foreground font-arabic">
                        مميز
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-arabic text-lg">{item.name}</CardTitle>
                      <span className="text-primary font-bold font-arabic">{item.price}</span>
                    </div>
                    <Badge variant="secondary" className="w-fit font-arabic text-xs">
                      {item.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-arabic text-sm mb-4">
                      {item.description}
                    </p>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-arabic"
                        onClick={() => {/* TODO: Edit functionality */}}
                      >
                        <Edit className="w-4 h-4 ml-2" />
                        تعديل
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="font-arabic">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-arabic">تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription className="font-arabic">
                              هل أنت متأكد من حذف هذا الطبق؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="font-arabic"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-arabic">إدارة الفئات</h2>
              <ManageCategories
                categories={categories}
                onAdd={handleAddCategory}
                onUpdate={handleUpdateCategory}
                onDelete={handleDeleteCategory}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="p-6">
                  <CardHeader>
                    <CardTitle className="font-arabic text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-arabic text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-arabic"
                        onClick={() => {/* TODO: Edit functionality */}}
                      >
                        <Edit className="w-4 h-4 ml-2" />
                        تعديل
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="font-arabic">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-arabic">تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription className="font-arabic">
                              هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id)}
                              className="font-arabic"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-arabic">إدارة الطلبات</h2>
              <Badge variant="outline" className="font-arabic">
                {orders.length} طلب
              </Badge>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">إجمالي الطلبات</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orderStats.totalOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">في الانتظار</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">مكتملة</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{orderStats.completedOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">الإيرادات</CardTitle>
                  <span className="text-lg">💰</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{orderStats.totalRevenue} ج.م</div>
                </CardContent>
              </Card>
            </div>

            {/* قائمة الطلبات */}
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-arabic mb-2">لا توجد طلبات</h3>
                  <p className="text-muted-foreground font-arabic">لم يتم استلام أي طلبات بعد</p>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id || Math.random()} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold font-arabic">طلب #{order.id ? order.id.slice(-8) : 'غير محدد'}</h3>
                        <p className="text-sm text-muted-foreground font-arabic">
                          {order.orderDate || 'غير محدد'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge className={`${getStatusColor(order.status)} font-arabic`}>
                          {getStatusText(order.status)}
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-arabic">تحديث حالة الطلب</AlertDialogTitle>
                              <AlertDialogDescription className="font-arabic">
                                اختر الحالة الجديدة للطلب
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                              {['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                                <Button
                                  key={status}
                                  variant={order.status === status ? "default" : "outline"}
                                  onClick={() => handleUpdateOrderStatus(order.id, status as Order['status'])}
                                  className="w-full font-arabic"
                                >
                                  {getStatusText(status as Order['status'])}
                                </Button>
                              ))}
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-arabic">حذف الطلب</AlertDialogTitle>
                              <AlertDialogDescription className="font-arabic">
                                هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOrder(order.id)}
                                className="font-arabic"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-bold font-arabic mb-2">معلومات العميل</h4>
                        <div className="space-y-1 text-sm">
                          <p className="font-arabic"><strong>الاسم:</strong> {order.customerName || 'غير محدد'}</p>
                          <p className="font-arabic"><strong>الهاتف:</strong> {order.customerPhone || 'غير محدد'}</p>
                          <p className="font-arabic"><strong>العنوان:</strong> {order.customerAddress || 'غير محدد'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold font-arabic mb-2">تفاصيل الطلب</h4>
                        <div className="space-y-1 text-sm">
                          {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                            <div key={index} className="flex justify-between font-arabic">
                              <span>{item.name || 'غير محدد'} × {item.quantity || 0}</span>
                              <span>{item.price || 'غير محدد'}</span>
                            </div>
                          )) : (
                            <p className="font-arabic text-muted-foreground">لا توجد أطباق</p>
                          )}
                          <div className="border-t pt-1 mt-2 font-bold">
                            <div className="flex justify-between font-arabic">
                              <span>المجموع:</span>
                              <span>{order.totalPrice || 0} جنيه مصري</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Admin Actions Log */}
          <TabsContent value="actions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-arabic">سجل الإجراءات الإدارية</h2>
              <Button 
                variant="outline" 
                onClick={loadData}
                className="font-arabic"
              >
                تحديث السجل
              </Button>
            </div>

            <div className="space-y-4">
              {adminActions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground font-arabic">لا توجد إجراءات مسجلة بعد</p>
                  </CardContent>
                </Card>
              ) : (
                adminActions.map((action) => (
                  <Card key={action.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <Badge variant="outline" className="font-arabic">
                            {action.action_type}
                          </Badge>
                          <span className="text-sm text-muted-foreground font-arabic">
                            {action.admin_user}
                          </span>
                        </div>
                        <p className="font-arabic text-sm mb-1">{action.action_description}</p>
                        {action.target_item && (
                          <p className="text-xs text-muted-foreground font-arabic">
                            العنصر: {action.target_item}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-arabic">
                        {action.created_at ? new Date(action.created_at).toLocaleString('ar-SA') : ''}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold font-arabic">إعدادات تيليجرام</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">إعدادات البوت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium font-arabic">Bot Token</label>
                  <input
                    type="password"
                    placeholder="أدخل Bot Token"
                    value={telegramSettings.botToken}
                    onChange={(e) => setTelegramSettings(prev => ({ ...prev, botToken: e.target.value }))}
                    className="w-full p-2 border rounded-md font-arabic"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium font-arabic">Chat ID</label>
                  <input
                    type="text"
                    placeholder="أدخل Chat ID"
                    value={telegramSettings.chatId}
                    onChange={(e) => setTelegramSettings(prev => ({ ...prev, chatId: e.target.value }))}
                    className="w-full p-2 border rounded-md font-arabic"
                  />
                </div>
                
                <Button 
                  onClick={handleSaveTelegramSettings}
                  className="font-arabic"
                >
                  حفظ الإعدادات
                </Button>
                
                <div className="text-sm text-muted-foreground font-arabic">
                  <p>📖 اتبع التعليمات في ملف TELEGRAM_SETUP.md لإعداد تيليجرام</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-2xl font-bold font-arabic">الإحصائيات</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">إجمالي الأطباق</CardTitle>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{menuItems.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">إجمالي الفئات</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">الأطباق المميزة</CardTitle>
                  <Badge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {menuItems.filter(item => item.isPopular).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">متوسط السعر</CardTitle>
                  <span className="h-4 w-4 text-muted-foreground">💰</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-arabic">
                    {menuItems.length > 0 
                      ? Math.round(menuItems.reduce((sum, item) => {
                          const price = parseInt(item.price.replace(/\D/g, ''));
                          return sum + price;
                        }, 0) / menuItems.length)
                      : 0
                    } جنيه
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
