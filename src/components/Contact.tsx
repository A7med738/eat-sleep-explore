import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "الهاتف",
      details: ["123-456-789", "987-654-321"],
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "الموقع",
      details: ["شارع الملك فهد", "الرياض، المملكة العربية السعودية"],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "أوقات العمل",
      details: ["السبت - الخميس: 11:00 ص - 12:00 م", "الجمعة: 2:00 ظ - 12:00 م"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "البريد الإلكتروني",
      details: ["info@kelwanam.com", "orders@kelwanam.com"],
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-arabic text-foreground mb-4">
            تواصل معنا
          </h2>
          <p className="text-xl text-muted-foreground font-arabic max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتكم وتلقي طلباتكم
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold font-arabic text-foreground mb-6">
                معلومات التواصل
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 hover:shadow-warm transition-smooth">
                    <CardContent className="p-0 space-y-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center text-primary-foreground">
                          {info.icon}
                        </div>
                        <h4 className="font-arabic font-semibold text-foreground">
                          {info.title}
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground font-arabic text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden">
              <div className="h-64 bg-gradient-golden flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 text-primary mx-auto" />
                  <p className="font-arabic text-foreground font-semibold">
                    خريطة الموقع
                  </p>
                  <p className="font-arabic text-muted-foreground text-sm">
                    شارع الملك فهد، الرياض
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-arabic text-2xl text-foreground">
                أرسل لنا رسالة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-arabic text-foreground mb-2">
                    الاسم الأول
                  </label>
                  <Input 
                    placeholder="أدخل اسمك الأول" 
                    className="font-arabic"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-arabic text-foreground mb-2">
                    الاسم الأخير
                  </label>
                  <Input 
                    placeholder="أدخل اسمك الأخير" 
                    className="font-arabic"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-arabic text-foreground mb-2">
                  البريد الإلكتروني
                </label>
                <Input 
                  type="email" 
                  placeholder="example@email.com" 
                  className="font-arabic"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-arabic text-foreground mb-2">
                  رقم الهاتف
                </label>
                <Input 
                  type="tel" 
                  placeholder="123-456-789" 
                  className="font-arabic"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-arabic text-foreground mb-2">
                  الرسالة
                </label>
                <Textarea 
                  placeholder="أكتب رسالتك هنا..." 
                  rows={5}
                  className="font-arabic"
                  dir="rtl"
                />
              </div>

              <Button variant="cta" className="w-full font-arabic">
                إرسال الرسالة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;