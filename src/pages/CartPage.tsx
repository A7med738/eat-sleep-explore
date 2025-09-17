import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  CreditCard,
  Send,
  Home
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { telegramService, TelegramOrder } from "@/lib/telegram";
import { orderService, Order } from "@/lib/orders";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [isOrdering, setIsOrdering] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleOrder = async () => {
    if (items.length === 0) return;
    
    setIsOrdering(true);
    
    try {
      // إنشاء الطلب في خدمة الطلبات
      const newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: items,
        totalPrice: totalPrice,
        status: 'pending',
        orderDate: new Date().toLocaleString('ar-SA')
      };

      // حفظ الطلب في خدمة الطلبات
      const savedOrder = orderService.add(newOrder);

      // إعداد بيانات الطلب لإرسالها إلى تيليجرام
      const telegramOrder: TelegramOrder = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: totalPrice,
        orderDate: new Date().toLocaleString('ar-SA')
      };

      // إرسال الطلب عبر تيليجرام
      const success = await telegramService.sendOrder(telegramOrder);

      if (success) {
        // مسح السلة بعد الطلب
        clearCart();
        setCustomerInfo({ name: "", phone: "", address: "" });
        
        alert('تم إرسال الطلب بنجاح! سيتم التواصل معك قريباً.');
      } else {
        alert('تم حفظ الطلب محلياً، لكن حدث خطأ في الإرسال عبر تيليجرام.');
      }
      
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold font-arabic mb-4">سلة الطلبات فارغة</h1>
            <p className="text-muted-foreground font-arabic mb-8">
              أضف بعض الأطباق اللذيذة لتبدأ طلبك
            </p>
            <Button 
              onClick={() => navigate('/#menu')}
              className="font-arabic"
            >
              <Home className="w-4 h-4 ml-2" />
              تصفح القائمة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-arabic mb-4">سلة الطلبات</h1>
            <p className="text-muted-foreground font-arabic">
              راجع طلبك وأكمل عملية الشراء
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* قائمة الأطباق */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold font-arabic mb-4">الأطباق المختارة</h2>
              
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-arabic font-medium text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground font-arabic">{item.category}</p>
                      <p className="font-arabic font-bold text-primary">{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-10 h-10 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-arabic font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-10 h-10 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="w-10 h-10 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* ملخص الطلب */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-arabic">عدد الأطباق:</span>
                    <span className="font-arabic font-medium">{totalItems}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-arabic text-lg font-bold">المجموع:</span>
                    <span className="font-arabic text-xl font-bold text-primary">
                      {totalPrice} جنيه مصري
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* معلومات العميل */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">معلومات التوصيل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-arabic">الاسم الكامل</Label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك الكامل"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="font-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-arabic">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      placeholder="أدخل رقم هاتفك"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="font-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-arabic">العنوان</Label>
                    <Input
                      id="address"
                      placeholder="أدخل عنوانك"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="font-arabic"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* أزرار العمل */}
              <div className="space-y-3">
                <Button
                  onClick={handleOrder}
                  disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address || isOrdering}
                  className="w-full font-arabic"
                  size="lg"
                >
                  {isOrdering ? (
                    "جاري إرسال الطلب..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      إرسال الطلب
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full font-arabic"
                >
                  مسح السلة
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => navigate('/#menu')}
                  className="w-full font-arabic"
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  إضافة المزيد
                </Button>
              </div>

              <Alert>
                <Send className="h-4 w-4" />
                <AlertDescription className="font-arabic text-sm">
                  سيتم إرسال طلبك عبر تيليجرام وسنتواصل معك لتأكيد التفاصيل
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
