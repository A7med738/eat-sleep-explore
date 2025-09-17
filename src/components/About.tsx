import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const features = [
    {
      title: "خبرة 20 عاماً",
      description: "في تحضير أشهى الأطباق العربية والشرقية",
      icon: "👨‍🍳",
    },
    {
      title: "مكونات طازجة",
      description: "نختار أجود المكونات الطازجة يومياً",
      icon: "🥗",
    },
    {
      title: "أجواء مريحة",
      description: "تصميم عصري مع لمسة تراثية أصيلة",
      icon: "🏛️",
    },
    {
      title: "خدمة متميزة",
      description: "فريق عمل مدرب لخدمتكم على أكمل وجه",
      icon: "⭐",
    },
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-warm text-primary-foreground font-arabic">
                قصتنا
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold font-arabic text-foreground">
                مطعم كل ونام
              </h2>
              <h3 className="text-2xl font-arabic text-primary">
                رحلة طعم لا تُنسى
              </h3>
            </div>

            <div className="space-y-6 text-muted-foreground font-arabic leading-relaxed">
              <p className="text-lg">
                بدأت قصة مطعم "كل ونام" من حلم بسيط: تقديم أشهى الأطباق العربية والشرقية 
                في جو مريح ومميز يجمع بين الأصالة والحداثة.
              </p>
              <p>
                نحن نؤمن بأن الطعام الجيد يجمع الناس ويخلق ذكريات جميلة. لذلك نحرص على 
                تحضير كل طبق بعناية فائقة باستخدام أجود المكونات الطازجة والوصفات التراثية 
                الأصيلة التي تم توارثها عبر الأجيال.
              </p>
              <p>
                مطعمنا ليس مجرد مكان لتناول الطعام، بل هو تجربة كاملة تبدأ من لحظة دخولكم 
                وتستمر حتى آخر قضمة من الحلوى الشرقية اللذيذة.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-golden transition-smooth group">
                <CardContent className="text-center space-y-4 p-0">
                  <div className="text-4xl group-hover:scale-110 transition-smooth">
                    {feature.icon}
                  </div>
                  <h3 className="font-arabic font-bold text-foreground text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-arabic text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary font-arabic mb-2">
              1000+
            </div>
            <p className="text-muted-foreground font-arabic">زبون سعيد</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary font-arabic mb-2">
              50+
            </div>
            <p className="text-muted-foreground font-arabic">طبق مميز</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary font-arabic mb-2">
              20
            </div>
            <p className="text-muted-foreground font-arabic">سنة خبرة</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary font-arabic mb-2">
              5⭐
            </div>
            <p className="text-muted-foreground font-arabic">تقييم العملاء</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;