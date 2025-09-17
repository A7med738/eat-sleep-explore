import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { menuService, categoryService, MenuItem, Category } from "@/lib/supabase";
import { useCart } from "@/hooks/useCart";
import arabicFood from "@/assets/arabic-food.jpg";
import grilledMeat from "@/assets/grilled-meat.jpg";
import desserts from "@/assets/desserts.jpg";

// البيانات الافتراضية (للاحتياط)
const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "مشاوي مشكلة",
    description: "مجموعة متنوعة من اللحوم المشوية مع الخضار والأرز",
    price: "720 جنيه مصري",
    image: grilledMeat,
    category: "الأطباق الرئيسية",
    isPopular: true,
  },
  {
    id: 2,
    name: "طبق عربي مميز",
    description: "حمص، فلافل، لحم مشوي، وخضار طازجة",
    price: "550 جنيه مصري",
    image: arabicFood,
    category: "الأطباق العربية",
    isPopular: false,
  },
  {
    id: 3,
    name: "حلويات شرقية",
    description: "بقلاوة ومعمول وحلويات شرقية متنوعة",
    price: "300 جنيه مصري",
    image: desserts,
    category: "الحلويات",
    isPopular: true,
  },
];

const defaultCategories: Category[] = [
  { id: 1, name: "الأطباق الرئيسية", description: "الأطباق الرئيسية واللحوم" },
  { id: 2, name: "الأطباق العربية", description: "الأطباق العربية التقليدية" },
  { id: 3, name: "الحلويات", description: "الحلويات الشرقية والغربية" },
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const { addToCart, getItemQuantity, updateQuantity } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // محاولة تحميل البيانات من Supabase
      const [menuData, categoryData] = await Promise.all([
        menuService.getAll(),
        categoryService.getAll()
      ]);

      setMenuItems(menuData);
      setCategories(categoryData);
    } catch (error) {
      console.error('خطأ في تحميل البيانات من Supabase، استخدام البيانات الافتراضية:', error);
      // في حالة فشل الاتصال بـ Supabase، استخدم البيانات الافتراضية
      setMenuItems(defaultMenuItems);
      setCategories(defaultCategories);
    }
  };

  useEffect(() => {
    // تصفية الأطباق حسب الفئة المختارة
    if (selectedCategory === "الكل") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [menuItems, selectedCategory]);

  // إضافة "الكل" إلى قائمة الفئات مع إزالة التكرار
  const allCategories = ["الكل", ...Array.from(new Set(categories.map(cat => cat.name)))];

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-arabic text-foreground mb-4">
            قائمة الطعام
          </h2>
          <p className="text-xl text-muted-foreground font-arabic max-w-2xl mx-auto">
            اكتشف مجموعة متنوعة من الأطباق الشهية المحضرة بأجود المكونات
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {allCategories.map((category, index) => (
            <Button
              key={`${category}-${index}`}
              variant={selectedCategory === category ? "default" : "outline"}
              className="font-arabic hover:bg-primary hover:text-primary-foreground"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card key={`${item.id}-${item.name}-${index}`} className="group hover:shadow-warm transition-smooth overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
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
                  <span className="text-primary font-bold font-arabic text-lg">{item.price}</span>
                </div>
                <Badge variant="secondary" className="w-fit font-arabic text-xs">
                  {item.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-arabic mb-4">{item.description}</p>
                
                {getItemQuantity(item.id) === 0 ? (
                  <Button 
                    variant="default" 
                    className="w-full font-arabic"
                    onClick={() => addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      category: item.category
                    })}
                  >
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    إضافة للطلب
                  </Button>
                ) : (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                      className="w-10 h-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-arabic font-medium min-w-[2rem] text-center">
                      {getItemQuantity(item.id)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, getItemQuantity(item.id) + 1)}
                      className="w-10 h-10 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button variant="hero" size="lg" className="font-arabic px-8">
            عرض المزيد من الأطباق
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;