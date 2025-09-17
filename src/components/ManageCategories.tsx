import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categorySchema = z.object({
  name: z.string().min(1, "اسم الفئة مطلوب"),
  description: z.string().min(1, "وصف الفئة مطلوب"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ManageCategoriesProps {
  categories: Category[];
  onAdd: (category: Omit<Category, "id">) => void;
  onUpdate: (id: number, category: Partial<Category>) => void;
  onDelete: (id: number) => void;
}

const ManageCategories = ({ categories, onAdd, onUpdate, onDelete }: ManageCategoriesProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    onAdd(data);
    form.reset();
    setOpen(false);
    toast({
      title: "تم بنجاح",
      description: "تم إضافة الفئة الجديدة بنجاح",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-arabic">
          <Plus className="w-4 h-4 ml-2" />
          إضافة فئة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-arabic text-xl">إضافة فئة جديدة</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">اسم الفئة</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل اسم الفئة" 
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">وصف الفئة</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل وصف الفئة" 
                      className="font-arabic min-h-[80px]"
                      {...field} 
                    />
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
                إضافة الفئة
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCategories;
