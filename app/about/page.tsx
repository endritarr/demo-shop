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

          <div className="pt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Tech Stack</h2>
            <div className="max-w-2xl">
              <p className="text-muted-foreground mb-6">
                Built with modern technologies and best practices:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                  <div className="font-semibold text-foreground">Next.js 16</div>
                  <div className="text-sm text-muted-foreground">React Framework</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                  <div className="font-semibold text-foreground">React 19</div>
                  <div className="text-sm text-muted-foreground">UI Library</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                  <div className="font-semibold text-foreground">TypeScript</div>
                  <div className="text-sm text-muted-foreground">Type Safety</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                  <div className="font-semibold text-foreground">Tailwind CSS</div>
                  <div className="text-sm text-muted-foreground">Styling</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                  <div className="font-semibold text-foreground">shadcn/ui</div>
                  <div className="text-sm text-muted-foreground">Components</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                  <div className="font-semibold text-foreground">Stripe</div>
                  <div className="text-sm text-muted-foreground">Payments</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                  <div className="font-semibold text-foreground">Mapbox</div>
                  <div className="text-sm text-muted-foreground">Maps API</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
