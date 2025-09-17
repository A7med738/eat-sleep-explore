import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X,
  CreditCard,
  Phone
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleOrder = () => {
    if (items.length === 0) return;
    
    const orderDetails = {
      items: items,
      customer: customerInfo,
      total: totalPrice,
      timestamp: new Date().toISOString()
    };

    // حفظ الطلب في localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    // إرسال الطلب (يمكن تطوير هذا لاحقاً لإرسال عبر WhatsApp أو API)
    const message = `طلب جديد من ${customerInfo.name}\n` +
      `الهاتف: ${customerInfo.phone}\n` +
      `العنوان: ${customerInfo.address}\n\n` +
      `الطلبات:\n` +
      items.map(item => `- ${item.name} x${item.quantity} = ${item.price}`).join('\n') +
      `\n\nالمجموع: ${totalPrice} جنيه مصري`;

    // يمكن إضافة رابط WhatsApp هنا
    const whatsappUrl = `https://wa.me/201234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // مسح السلة بعد الطلب
    onClearCart();
    setCustomerInfo({ name: "", phone: "", address: "" });
    setIsOpen(false);

    alert('تم إرسال الطلب بنجاح! سيتم التواصل معك قريباً.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative font-arabic">
          <ShoppingCart className="w-4 h-4 ml-2" />
          سلة الطلبات
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-arabic text-xl">سلة الطلبات</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-arabic">سلة الطلبات فارغة</p>
            <p className="text-sm text-muted-foreground font-arabic mt-2">
              أضف بعض الأطباق اللذيذة لتبدأ طلبك
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* قائمة الأطباق */}
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-arabic font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground font-arabic">{item.category}</p>
                      <p className="font-arabic font-bold text-primary">{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-arabic">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="w-8 h-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Separator />

            {/* المجموع */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-arabic text-lg font-bold">المجموع:</span>
                <span className="font-arabic text-xl font-bold text-primary">
                  {totalPrice} جنيه مصري
                </span>
              </div>

              {/* معلومات العميل */}
              <div className="space-y-3">
                <h3 className="font-arabic font-medium">معلومات التوصيل</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="الاسم الكامل"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="font-arabic"
                  />
                  <Input
                    placeholder="رقم الهاتف"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="font-arabic"
                  />
                  <Input
                    placeholder="العنوان"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="font-arabic"
                  />
                </div>
              </div>

              {/* أزرار العمل */}
              <div className="flex space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  onClick={onClearCart}
                  className="font-arabic flex-1"
                >
                  مسح السلة
                </Button>
                <Button
                  onClick={handleOrder}
                  disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                  className="font-arabic flex-1"
                >
                  <CreditCard className="w-4 h-4 ml-2" />
                  تأكيد الطلب
                </Button>
              </div>

              <Alert>
                <Phone className="h-4 w-4" />
                <AlertDescription className="font-arabic text-sm">
                  سيتم إرسال طلبك عبر WhatsApp وسنتواصل معك لتأكيد التفاصيل
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
