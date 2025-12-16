export default function About() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            About Us
          </h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-lg leading-relaxed">
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-primary">
              🎨 This is a demo/portfolio project showcasing an e-commerce shop.
            </p>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            This demo shop represents a fictional e-commerce business. It demonstrates a full-stack
            application with product browsing, cart functionality,
            and checkout features.
          </p>

          <div className="pt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">About This Demo</h2>
            <p className="text-muted-foreground max-w-2xl">
              This is a portfolio demonstration project built with Next.js, showcasing
              modern web development practices including responsive design, state management,
              and e-commerce functionality. All products, reviews, and contact information
              are for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
