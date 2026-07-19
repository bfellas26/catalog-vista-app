import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_customer/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aurora Studio" },
      { name: "description", content: "Get in touch with the Aurora Studio team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { register, handleSubmit, reset } = useForm();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium tracking-widest text-gold uppercase">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Let's start a conversation.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Questions about a piece, custom orders, or press — we usually reply
            within a day.
          </p>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              hello@aurora.studio
            </li>
            <li className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              +1 (555) 010-0199
            </li>
            <li className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              Lisbon, PT
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit(() => { toast.success("Message sent"); reset(); })}
          className="card-surface space-y-4 p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Name</Label><Input {...register("name")} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" {...register("email")} /></div>
          </div>
          <div className="space-y-1.5"><Label>Subject</Label><Input {...register("subject")} /></div>
          <div className="space-y-1.5"><Label>Message</Label><Textarea rows={5} {...register("message")} /></div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Send message</Button>
        </form>
      </div>
    </div>
  );
}
