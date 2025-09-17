import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import arabicFood from "@/assets/arabic-food.jpg";
import grilledMeat from "@/assets/grilled-meat.jpg";
import desserts from "@/assets/desserts.jpg";

const menuItems = [
  {
    id: 1,
    name: "مشاوي مشكلة",
    description: "مجموعة متنوعة من اللحوم المشوية مع الخضار والأرز",
    price: "85 ريال",
    image: grilledMeat,
    category: "الأطباق الرئيسية",
    isPopular: true,
  },
  {
    id: 2,
    name: "طبق عربي مميز",
    description: "حمص، فلافل، لحم مشوي، وخضار طازجة",
    price: "65 ريال",
    image: arabicFood,
    category: "الأطباق العربية",
    isPopular: false,
  },
  {
    id: 3,
    name: "حلويات شرقية",
    description: "بقلاوة ومعمول وحلويات شرقية متنوعة",
    price: "35 ريال",
    image: desserts,
    category: "الحلويات",
    isPopular: true,
  },
  {
    id: 4,
    name: "كباب لحم",
    description: "كباب لحم طازج مع البرغل والسلطة",
    price: "70 ريال",
    image: grilledMeat,
    category: "الأطباق الرئيسية",
    isPopular: false,
  },
  {
    id: 5,
    name: "فتة لحم",
    description: "فتة لحم بالخبز المحمص واللبن",
    price: "55 ريال",
    image: arabicFood,
    category: "الأطباق العربية",
    isPopular: true,
  },
  {
    id: 6,
    name: "كنافة بالجبن",
    description: "كنافة طازجة بالجبن والقطر",
    price: "25 ريال",
    image: desserts,
    category: "الحلويات",
    isPopular: false,
  },
];

const categories = ["الكل", "الأطباق الرئيسية", "الأطباق العربية", "الحلويات"];

const Menu = () => {
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
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="font-arabic hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-warm transition-smooth overflow-hidden">
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
                <Button variant="default" className="w-full font-arabic">
                  إضافة للطلب
                </Button>
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