// خدمة إرسال الطلبات إلى تيليجرام
export interface TelegramOrder {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  totalPrice: number;
  orderDate: string;
}

export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken;
    this.chatId = chatId;
  }

  // إرسال طلب إلى تيليجرام
  async sendOrder(order: TelegramOrder): Promise<boolean> {
    try {
      // الحصول على أحدث الإعدادات
      const settings = getTelegramSettings();
      
      if (!settings.botToken || !settings.chatId) {
        console.error('إعدادات تيليجرام غير مكتملة');
        return false;
      }

      const message = this.formatOrderMessage(order);
      const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: settings.chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('خطأ في إرسال الطلب إلى تيليجرام:', error);
      return false;
    }
  }

  // تنسيق رسالة الطلب
  private formatOrderMessage(order: TelegramOrder): string {
    const itemsText = order.items
      .map(item => `• ${item.name} × ${item.quantity} = ${item.price}`)
      .join('\n');

    return `
🛒 <b>طلب جديد من مطعم أكل ونوم واستكشف</b>

👤 <b>العميل:</b> ${order.customerName}
📞 <b>الهاتف:</b> ${order.customerPhone}
📍 <b>العنوان:</b> ${order.customerAddress}

🍽️ <b>الطلبات:</b>
${itemsText}

💰 <b>المجموع:</b> ${order.totalPrice} جنيه مصري

⏰ <b>وقت الطلب:</b> ${order.orderDate}
    `.trim();
  }

  // اختبار الاتصال بالبوت
  async testConnection(): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/getMe`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('خطأ في اختبار الاتصال بتيليجرام:', error);
      return false;
    }
  }
}

// إعدادات تيليجرام الافتراضية
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
  CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
};

// دالة للحصول على إعدادات تيليجرام من localStorage
export const getTelegramSettings = () => {
  const savedSettings = localStorage.getItem('telegramSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    return {
      botToken: settings.botToken || TELEGRAM_CONFIG.BOT_TOKEN,
      chatId: settings.chatId || TELEGRAM_CONFIG.CHAT_ID
    };
  }
  return {
    botToken: TELEGRAM_CONFIG.BOT_TOKEN,
    chatId: TELEGRAM_CONFIG.CHAT_ID
  };
};

// إنشاء مثيل الخدمة مع الإعدادات المحفوظة
const settings = getTelegramSettings();
export const telegramService = new TelegramService(
  settings.botToken,
  settings.chatId
);
