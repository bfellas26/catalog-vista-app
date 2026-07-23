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
      { name: "description", content: "Send an enquiry to Aurora Studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      accountId: "ACC-8832",
      customerName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium tracking-widest text-gold uppercase">Contact & Enquiry</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Let's start a conversation.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Have questions about custom orders, products or volume pricing? Submit an enquiry and our team will get back to you shortly.
          </p>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              contact@aurorastudio.com
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
              San Francisco, CA, USA
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            console.log("Enquiry submitted:", data);
            toast.success("Your enquiry has been submitted!");
            reset();
          })}
          className="card-surface space-y-4 p-6 sm:p-8"
        >
          <input type="hidden" {...register("accountId")} />

          <div className="space-y-1.5">
            <Label htmlFor="customerName">Your Name</Label>
            <Input id="customerName" placeholder="Jane Doe" {...register("customerName")} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Enquiry Message</Label>
            <Textarea id="message" rows={5} placeholder="Tell us how we can help..." {...register("message")} required />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
            Send enquiry
          </Button>
        </form>
      </div>
    </div>
  );
}
