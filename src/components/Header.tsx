import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background shadow-soft border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-foreground">كل ونام</h1>
              <p className="text-sm text-muted-foreground font-arabic">مطعم الطعام الشهي</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="#home" className="font-arabic text-foreground hover:text-primary transition-smooth">
              الرئيسية
            </a>
            <a href="#menu" className="font-arabic text-foreground hover:text-primary transition-smooth">
              القائمة
            </a>
            <a href="#about" className="font-arabic text-foreground hover:text-primary transition-smooth">
              عن المطعم
            </a>
            <a href="#contact" className="font-arabic text-foreground hover:text-primary transition-smooth">
              تواصل معنا
            </a>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-arabic text-foreground">123-456-789</span>
            </div>
            <Button variant="cta" size="sm" className="font-arabic">
              اطلب الآن
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;