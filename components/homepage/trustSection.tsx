"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldContent } from "@/components/ui/field";
import { useState } from "react";

export default function TrustSection(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription here
    console.log("Newsletter subscription:", newsletterEmail);
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail("");
    }, 3000);
  };

  const contactInfo = [
    { label: "Email", value: "info@poster-gifts.com", icon: "✉️" },
    { label: "Phone", value: "123-456-7890", icon: "📞" },
    { label: "Address", value: "123 Main St, Anytown, USA", icon: "📍" },
  ];

  return (
    <section
      className="w-full py-8"
      {...props}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
          {/* Left Side - Contact Info */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <span className="break-all">{contactInfo[0].value}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>{contactInfo[1].value}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span className="wrap-break-word">{contactInfo[2].value}</span>
            </div>
          </div>

          {/* Right Side - Newsletter Subscription */}
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <Field className="flex-1">
              <FieldContent>
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background/90 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Enter your email"
                />
              </FieldContent>
            </Field>
            <Button
              type="submit"
              variant={newsletterSubmitted ? "secondary" : "default"}
              size="default"
              className="whitespace-nowrap"
            >
              {newsletterSubmitted ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
