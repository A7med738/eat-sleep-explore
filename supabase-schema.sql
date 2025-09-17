-- إنشاء جدول الفئات
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الأطباق
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(100) NOT NULL,
  image TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول سجل الإجراءات الإدارية
CREATE TABLE admin_actions (
  id SERIAL PRIMARY KEY,
  action_type VARCHAR(100) NOT NULL,
  action_description TEXT NOT NULL,
  admin_user VARCHAR(255) NOT NULL,
  target_item VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج البيانات الافتراضية للفئات
INSERT INTO categories (name, description) VALUES
('الأطباق الرئيسية', 'الأطباق الرئيسية واللحوم'),
('الأطباق العربية', 'الأطباق العربية التقليدية'),
('الحلويات', 'الحلويات الشرقية والغربية');

-- إدراج البيانات الافتراضية للأطباق
INSERT INTO menu_items (name, description, price, image, category, is_popular) VALUES
('مشاوي مشكلة', 'مجموعة متنوعة من اللحوم المشوية مع الخضار والأرز', '720 جنيه مصري', '/src/assets/grilled-meat.jpg', 'الأطباق الرئيسية', true),
('طبق عربي مميز', 'حمص، فلافل، لحم مشوي، وخضار طازجة', '550 جنيه مصري', '/src/assets/arabic-food.jpg', 'الأطباق العربية', false),
('حلويات شرقية', 'بقلاوة ومعمول وحلويات شرقية متنوعة', '300 جنيه مصري', '/src/assets/desserts.jpg', 'الحلويات', true),
('كباب لحم', 'كباب لحم طازج مع البرغل والسلطة', '595 جنيه مصري', '/src/assets/grilled-meat.jpg', 'الأطباق الرئيسية', false),
('فتة لحم', 'فتة لحم بالخبز المحمص واللبن', '470 جنيه مصري', '/src/assets/arabic-food.jpg', 'الأطباق العربية', true),
('كنافة بالجبن', 'كنافة طازجة بالجبن والقطر', '210 جنيه مصري', '/src/assets/desserts.jpg', 'الحلويات', false);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_is_popular ON menu_items(is_popular);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at);
CREATE INDEX idx_admin_actions_admin_user ON admin_actions(admin_user);

-- تفعيل Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للقراءة العامة
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to menu_items" ON menu_items
  FOR SELECT USING (true);

-- سياسات الأمان للإدارة (تتطلب مصادقة)
CREATE POLICY "Allow admin full access to categories" ON categories
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to menu_items" ON menu_items
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to admin_actions" ON admin_actions
  FOR ALL USING (true);
