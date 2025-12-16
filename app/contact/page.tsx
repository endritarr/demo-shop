"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { useState } from "react";

export default function Contact() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Contact form submitted:", contactForm);
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex flex-col items-center space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 w-full">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Contact Us
          </h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto pt-4">
            Have a question or want to get in touch? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <input
                  id="name"
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Your name"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <input
                  id="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="your.email@example.com"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <FieldContent>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  placeholder="Your message..."
                />
              </FieldContent>
            </Field>

            <Button type="submit" className="w-full" size="lg">
              {contactSubmitted ? "Message Sent!" : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}