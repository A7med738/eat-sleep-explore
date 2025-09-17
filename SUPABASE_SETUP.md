# إعداد Supabase للمطعم

## الخطوات المطلوبة لإعداد قاعدة البيانات

### 1. إنشاء مشروع Supabase جديد

1. اذهب إلى [supabase.com](https://supabase.com)
2. سجل دخول أو أنشئ حساب جديد
3. اضغط على "New Project"
4. اختر منظمة أو أنشئ منظمة جديدة
5. أدخل اسم المشروع: `restaurant-admin`
6. اختر كلمة مرور قوية لقاعدة البيانات
7. اختر المنطقة الأقرب إليك
8. اضغط على "Create new project"

### 2. الحصول على مفاتيح API

1. بعد إنشاء المشروع، اذهب إلى Settings > API
2. انسخ `Project URL` و `anon public` key
3. افتح ملف `src/lib/supabase.ts`
4. استبدل القيم التالية:

```typescript
const supabaseUrl = 'https://your-project.supabase.co' // ضع Project URL هنا
const supabaseAnonKey = 'your-anon-key' // ضع anon public key هنا
```

### 3. إنشاء الجداول

1. اذهب إلى SQL Editor في لوحة تحكم Supabase
2. انسخ محتوى ملف `supabase-schema.sql`
3. الصق الكود واضغط على "Run"

هذا سينشئ الجداول التالية:
- `categories` - فئات الأطباق
- `menu_items` - الأطباق
- `admin_actions` - سجل الإجراءات الإدارية

### 4. إعداد Row Level Security (RLS)

الكود في `supabase-schema.sql` يتضمن إعدادات الأمان الأساسية:
- القراءة العامة للأطباق والفئات
- صلاحيات كاملة للإدارة

### 5. اختبار الاتصال

1. احفظ ملف `src/lib/supabase.ts` بعد تحديث المفاتيح
2. شغل التطبيق: `npm run dev`
3. اذهب إلى `/admin/login`
4. سجل دخول باستخدام: `admin` / `admin123`
5. جرب إضافة طبق جديد للتأكد من عمل قاعدة البيانات

## هيكل قاعدة البيانات

### جدول categories
- `id` - معرف فريد
- `name` - اسم الفئة
- `description` - وصف الفئة
- `created_at` - تاريخ الإنشاء
- `updated_at` - تاريخ آخر تحديث

### جدول menu_items
- `id` - معرف فريد
- `name` - اسم الطبق
- `description` - وصف الطبق
- `price` - السعر
- `image` - رابط الصورة
- `category` - فئة الطبق
- `is_popular` - هل الطبق مميز
- `created_at` - تاريخ الإنشاء
- `updated_at` - تاريخ آخر تحديث

### جدول admin_actions
- `id` - معرف فريد
- `action_type` - نوع الإجراء
- `action_description` - وصف الإجراء
- `admin_user` - المستخدم الإداري
- `target_item` - العنصر المستهدف
- `created_at` - تاريخ الإجراء

## المميزات

✅ **تخزين دائم**: البيانات محفوظة في قاعدة بيانات حقيقية
✅ **سجل الإجراءات**: تتبع جميع العمليات الإدارية
✅ **أمان**: حماية البيانات مع Row Level Security
✅ **تزامن**: التحديثات تظهر فوراً في الموقع الرئيسي
✅ **احتياطي**: في حالة فشل الاتصال، يستخدم البيانات الافتراضية

## استكشاف الأخطاء

### خطأ "Failed to load url"
- تأكد من تحديث مفاتيح API في `src/lib/supabase.ts`
- تأكد من أن المشروع نشط في Supabase

### خطأ في إنشاء الجداول
- تأكد من نسخ كامل محتوى `supabase-schema.sql`
- تأكد من تشغيل الكود في SQL Editor

### البيانات لا تظهر
- تحقق من إعدادات RLS في Supabase
- تأكد من أن الجداول تم إنشاؤها بنجاح
