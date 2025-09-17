import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const menuItemSchema = z.object({
  name: z.string().min(1, "اسم الطبق مطلوب"),
  description: z.string().min(1, "وصف الطبق مطلوب"),
  price: z.string().min(1, "سعر الطبق مطلوب"),
  category: z.string().min(1, "فئة الطبق مطلوبة"),
  image: z.string().min(1, "صورة الطبق مطلوبة"),
  isPopular: z.boolean().default(false),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface Category {
  id: number;
  name: string;
  description: string;
}

interface AddMenuItemProps {
  categories: Category[];
  onAdd: (item: Omit<MenuItemFormData, "id">) => void;
}

const AddMenuItem = ({ categories, onAdd }: AddMenuItemProps) => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      isPopular: false,
    },
  });

  const onSubmit = (data: MenuItemFormData) => {
    // إضافة "جنيه مصري" إلى السعر إذا لم يكن موجوداً
    const priceWithCurrency = data.price.includes("جنيه") 
      ? data.price 
      : `${data.price} جنيه مصري`;

    onAdd({
      ...data,
      price: priceWithCurrency,
    });

    form.reset();
    setImagePreview("");
    setOpen(false);
    toast({
      title: "تم بنجاح",
      description: "تم إضافة الطبق الجديد بنجاح",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-arabic">
          <Plus className="w-4 h-4 ml-2" />
          إضافة طبق جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-arabic text-xl">إضافة طبق جديد</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-arabic">اسم الطبق</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="أدخل اسم الطبق" 
                        className="font-arabic"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-arabic">السعر (جنيه مصري)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="أدخل السعر" 
                        className="font-arabic"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">وصف الطبق</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل وصف الطبق" 
                      className="font-arabic min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-arabic">فئة الطبق</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-arabic">
                          <SelectValue placeholder="اختر فئة الطبق" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name} className="font-arabic">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPopular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-arabic">طبق مميز</FormLabel>
                      <div className="text-sm text-muted-foreground font-arabic">
                        عرض الطبق كطبق مميز في الموقع
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">صورة الطبق</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500 font-arabic">
                              <span className="font-semibold">اضغط لرفع صورة</span>
                            </p>
                            <p className="text-xs text-gray-500 font-arabic">PNG, JPG أو WEBP</p>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="mt-4">
                          <img
                            src={imagePreview}
                            alt="معاينة الصورة"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="font-arabic"
              >
                إلغاء
              </Button>
              <Button type="submit" className="font-arabic">
                إضافة الطبق
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMenuItem;
