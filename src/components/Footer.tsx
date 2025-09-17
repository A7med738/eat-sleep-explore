import { Phone, MapPin, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-warm rounded-full flex items-center justify-center">
                <span className="text-xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold font-arabic">كل ونام</h3>
            </div>
            <p className="text-sm font-arabic text-background/80 leading-relaxed">
              مطعم كل ونام - استمتع بأشهى الأطباق العربية والشرقية في أجواء مريحة ومميزة
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-arabic">روابط سريعة</h4>
            <nav className="space-y-2">
              <a href="#home" className="block text-sm font-arabic text-background/80 hover:text-background transition-smooth">
                الرئيسية
              </a>
              <a href="#menu" className="block text-sm font-arabic text-background/80 hover:text-background transition-smooth">
                القائمة
              </a>
              <a href="#about" className="block text-sm font-arabic text-background/80 hover:text-background transition-smooth">
                عن المطعم
              </a>
              <a href="#contact" className="block text-sm font-arabic text-background/80 hover:text-background transition-smooth">
                تواصل معنا
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-arabic">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-arabic">123-456-789</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-arabic">info@kelwanam.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-arabic">شارع الملك فهد، الرياض</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-arabic">أوقات العمل</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Clock className="w-4 h-4" />
                <div className="text-sm font-arabic">
                  <p>السبت - الخميس</p>
                  <p className="text-background/80">11:00 ص - 12:00 م</p>
                </div>
              </div>
              <div className="text-sm font-arabic">
                <p>الجمعة</p>
                <p className="text-background/80">2:00 ظ - 12:00 م</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-arabic text-background/80">
            © 2024 مطعم كل ونام. جميع الحقوق محفوظة.
          </p>
          <div className="flex space-x-4 space-x-reverse mt-4 md:mt-0">
            <a href="#" className="text-sm font-arabic text-background/80 hover:text-background transition-smooth">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-sm font-arabic text-background/80 hover:text-background transition-smooth">
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;