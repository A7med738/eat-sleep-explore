import { Button } from "@/components/ui/button";
import heroFood from "@/assets/hero-food.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-r from-background to-secondary">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-right space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold font-arabic text-foreground leading-tight">
                مرحباً بكم في
              </h1>
              <h2 className="text-6xl lg:text-8xl font-bold font-arabic bg-gradient-hero bg-clip-text text-transparent">
                كل ونام
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground font-arabic max-w-2xl mx-auto lg:mx-0">
                استمتع بأشهى الأطباق في أجواء مريحة ومميزة
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="cta" size="lg" className="font-arabic text-lg px-8 py-6">
                استكشف القائمة
              </Button>
              <Button variant="outline" size="lg" className="font-arabic text-lg px-8 py-6">
                احجز طاولة
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🥘</span>
                </div>
                <h3 className="font-arabic font-semibold text-foreground">طعام طازج</h3>
                <p className="text-sm text-muted-foreground font-arabic">مكونات طازجة يومياً</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-arabic font-semibold text-foreground">توصيل سريع</h3>
                <p className="text-sm text-muted-foreground font-arabic">خدمة توصيل في 30 دقيقة</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="font-arabic font-semibold text-foreground">جودة عالية</h3>
                <p className="text-sm text-muted-foreground font-arabic">طعم لا يُقاوم</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroFood}
                alt="طعام شهي من مطعم كل ونام"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-warm opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-golden opacity-20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;