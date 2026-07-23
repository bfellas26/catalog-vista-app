import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductTagStore, ProductTagItem } from "@/store";

export const Route = createFileRoute("/business/product-tags")({
  component: ProductTagsPage,
});

function ProductTagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useProductTagStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTagItem | null>(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      accountId: "ACC-8832",
      tagName: "",
      color: "#eab308",
      isDeleted: false,
      createdBy: "admin@aurora.com",
      updatedBy: "admin@aurora.com",
    },
  });

  const isDeleted = watch("isDeleted");
  const currentColor = watch("color");

  const openNewDialog = () => {
    setEditingTag(null);
    reset({
      accountId: "ACC-8832",
      tagName: "",
      color: "#eab308",
      isDeleted: false,
      createdBy: "admin@aurora.com",
      updatedBy: "admin@aurora.com",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (t: ProductTagItem) => {
    setEditingTag(t);
    reset({
      accountId: t.accountId,
      tagName: t.tagName,
      color: t.color,
      isDeleted: t.isDeleted,
      createdBy: t.createdBy,
      updatedBy: "admin@aurora.com",
    });
    setIsDialogOpen(true);
  };

  const onSubmitForm = (data: any) => {
    if (editingTag) {
      updateTag(editingTag.id, data);
      toast.success("Product tag updated successfully");
    } else {
      addTag(data);
      toast.success("Product tag created successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Product Tags"
        description="Manage product label tags matching your productTags table schema."
        actions={
          <Button onClick={openNewDialog} className="bg-primary hover:bg-primary-dark cursor-pointer">
            <Plus className="mr-1.5 h-4 w-4" /> Add tag
          </Button>
        }
      />

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tag Name</th>
                <th className="px-4 py-3 text-left font-medium">Color</th>
                <th className="px-4 py-3 text-left font-medium">Account ID</th>
                <th className="px-4 py-3 text-left font-medium">Is Deleted</th>
                <th className="px-4 py-3 text-left font-medium">Audit (Created/Updated)</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full border border-border shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="font-semibold text-foreground">{t.tagName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {t.color}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {t.accountId}
                  </td>
                  <td className="px-4 py-3">
                    {t.isDeleted ? (
                      <Badge variant="destructive">True</Badge>
                    ) : (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300">False</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                    <p>By: {t.createdBy}</p>
                    <p className="text-[11px] opacity-80">{t.createdAt}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(t)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          deleteTag(t.id);
                          toast.success("Tag deleted");
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Tag Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTag ? "Edit Product Tag" : "Add Product Tag"}</DialogTitle>
            <DialogDescription>
              Fields strictly match the productTags database collection schema.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="accountId">Account ID</Label>
              <Input id="accountId" {...register("accountId")} placeholder="ACC-8832" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input id="tagName" placeholder="e.g. New" {...register("tagName")} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="color">Tag Color</Label>
              <div className="flex items-center gap-3">
                <Input id="color" type="color" className="h-10 w-16 p-1 cursor-pointer" {...register("color")} />
                <Input
                  type="text"
                  className="font-mono"
                  value={currentColor}
                  onChange={(e) => setValue("color", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isDeleted" className="text-sm font-medium">Is Deleted</Label>
                <p className="text-xs text-muted-foreground">Soft deletion status (isDeleted)</p>
              </div>
              <Switch
                id="isDeleted"
                checked={isDeleted}
                onCheckedChange={(v) => setValue("isDeleted", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="createdBy">Created By</Label>
                <Input id="createdBy" {...register("createdBy")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="updatedBy">Updated By</Label>
                <Input id="updatedBy" {...register("updatedBy")} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                {editingTag ? "Save changes" : "Create tag"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
