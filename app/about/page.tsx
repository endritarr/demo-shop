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
          <p className="text-muted-foreground max-w-2xl">
            We are a small team of passionate people dedicated to creating
            unique and personalized poster gifts. Based in the United States,
            we believe in the power of thoughtful, customized presents that
            capture precious moments and celebrate the people you love.
          </p>

          <div className="pt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground max-w-2xl">
              To create unique and personalized poster gifts that make your loved
              ones feel truly special. We&apos;re here to turn your memories into
              beautiful, lasting keepsakes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
