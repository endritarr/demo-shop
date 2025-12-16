export default function TechStackSection() {
  const technologies = [
    { name: "Next.js 16", category: "Framework" },
    { name: "React 19", category: "Library" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Stripe", category: "Payments" },
    { name: "Radix UI", category: "Components" },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Built With Modern Technologies
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Portfolio project showcasing the latest web development stack
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="bg-muted/50 border border-border rounded-lg px-6 py-4 flex flex-col items-center justify-center min-w-[140px] hover:bg-muted transition-colors"
            >
              <div className="font-semibold text-foreground text-lg mb-1">
                {tech.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {tech.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

