import { createClient } from '@supabase/supabase-js'

// يمكنك الحصول على هذه القيم من لوحة تحكم Supabase
// استبدل هذه القيم بمفاتيح مشروعك الفعلية
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// تحقق من صحة المفاتيح
const isSupabaseConfigured = supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key';

if (!isSupabaseConfigured) {
  console.warn('⚠️ مفاتيح Supabase غير محدثة - سيتم استخدام التخزين المحلي');
  console.warn('📖 اتبع التعليمات في ملف SUPABASE_SETUP.md لإعداد Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// أنواع البيانات
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  isPopular: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminAction {
  id: number;
  action_type: string;
  action_description: string;
  admin_user: string;
  target_item?: string;
  created_at?: string;
}

// دوال قاعدة البيانات
export const menuService = {
  // جلب جميع الأطباق
  async getAll() {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('menuItems');
      if (saved) {
        return JSON.parse(saved);
      }
      
      // إدراج البيانات الافتراضية إذا لم تكن موجودة
      const defaultItems = [
        {
          id: 1,
          name: "مشاوي مشكلة",
          description: "مجموعة متنوعة من اللحوم المشوية مع الخضار والأرز",
          price: "720 جنيه مصري",
          image: "/src/assets/grilled-meat.jpg",
          category: "الأطباق الرئيسية",
          isPopular: true,
        },
        {
          id: 2,
          name: "طبق عربي مميز",
          description: "حمص، فلافل، لحم مشوي، وخضار طازجة",
          price: "550 جنيه مصري",
          image: "/src/assets/arabic-food.jpg",
          category: "الأطباق العربية",
          isPopular: false,
        },
        {
          id: 3,
          name: "حلويات شرقية",
          description: "بقلاوة ومعمول وحلويات شرقية متنوعة",
          price: "300 جنيه مصري",
          image: "/src/assets/desserts.jpg",
          category: "الحلويات",
          isPopular: true,
        },
      ];
      localStorage.setItem('menuItems', JSON.stringify(defaultItems));
      return defaultItems;
    }

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // إضافة طبق جديد
  async create(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('menuItems') || '[]';
      const items = JSON.parse(saved);
      
      // التأكد من عدم وجود طبق بنفس الاسم
      const existingItem = items.find((existingItem: MenuItem) => 
        existingItem.name.toLowerCase() === item.name.toLowerCase()
      );
      
      if (existingItem) {
        throw new Error('يوجد بالفعل طبق بهذا الاسم');
      }
      
      const newItem = { ...item, id: Date.now() };
      items.unshift(newItem);
      localStorage.setItem('menuItems', JSON.stringify(items));
      return newItem;
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // تحديث طبق
  async update(id: number, updates: Partial<MenuItem>) {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('menuItems') || '[]';
      const items = JSON.parse(saved);
      const index = items.findIndex((item: MenuItem) => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem('menuItems', JSON.stringify(items));
        return items[index];
      }
      throw new Error('Item not found');
    }

    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // حذف طبق
  async delete(id: number) {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('menuItems') || '[]';
      const items = JSON.parse(saved);
      const filtered = items.filter((item: MenuItem) => item.id !== id);
      localStorage.setItem('menuItems', JSON.stringify(filtered));
      return;
    }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const categoryService = {
  // جلب جميع الفئات
  async getAll() {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('categories');
      if (saved) {
        return JSON.parse(saved);
      }
      
      // إدراج البيانات الافتراضية إذا لم تكن موجودة
      const defaultCategories = [
        { id: 1, name: "الأطباق الرئيسية", description: "الأطباق الرئيسية واللحوم" },
        { id: 2, name: "الأطباق العربية", description: "الأطباق العربية التقليدية" },
        { id: 3, name: "الحلويات", description: "الحلويات الشرقية والغربية" },
      ];
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // إضافة فئة جديدة
  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('categories') || '[]';
      const categories = JSON.parse(saved);
      const newCategory = { ...category, id: Date.now() };
      categories.unshift(newCategory);
      localStorage.setItem('categories', JSON.stringify(categories));
      return newCategory;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // تحديث فئة
  async update(id: number, updates: Partial<Category>) {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('categories') || '[]';
      const categories = JSON.parse(saved);
      const index = categories.findIndex((cat: Category) => cat.id === id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updates };
        localStorage.setItem('categories', JSON.stringify(categories));
        return categories[index];
      }
      throw new Error('Category not found');
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // حذف فئة
  async delete(id: number) {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('categories') || '[]';
      const categories = JSON.parse(saved);
      const filtered = categories.filter((cat: Category) => cat.id !== id);
      localStorage.setItem('categories', JSON.stringify(filtered));
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const adminActionService = {
  // تسجيل إجراء إداري
  async logAction(action: Omit<AdminAction, 'id' | 'created_at'>) {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('adminActions') || '[]';
      const actions = JSON.parse(saved);
      const newAction = { ...action, id: Date.now(), created_at: new Date().toISOString() };
      actions.unshift(newAction);
      localStorage.setItem('adminActions', JSON.stringify(actions));
      return newAction;
    }

    const { data, error } = await supabase
      .from('admin_actions')
      .insert([action])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // جلب سجل الإجراءات الإدارية
  async getActions() {
    if (!isSupabaseConfigured) {
      // استخدام localStorage كاحتياطي
      const saved = localStorage.getItem('adminActions');
      return saved ? JSON.parse(saved) : [];
    }

    const { data, error } = await supabase
      .from('admin_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
