export default function ReviewSection() {
  return (
    <section className="w-full py-8 md:py-16 bg-muted-foreground/10 flex flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 md:mb-8 text-center px-4">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        <div className="bg-white/70 rounded-lg p-6 border border-border flex flex-col h-full shadow-lg">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            &quot;Absolutely beautiful poster! The quality is amazing and it
            arrived exactly as described. My friend was so touched by this
            personalized gift.&quot;
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
              S
            </div>
            <div>
              <div className="font-medium text-foreground">Sarah Johnson</div>
              <div className="text-sm text-muted-foreground">Verified Customer</div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-lg p-6 border border-border flex flex-col h-full shadow-lg">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            &quot;The customization options are fantastic! I was able to create
            the perfect gift for my mom&apos;s birthday. Highly recommend!&quot;
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
              M
            </div>
            <div>
              <div className="font-medium text-foreground">Michael Chen</div>
              <div className="text-sm text-muted-foreground">Verified Customer</div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-lg p-6 border border-border flex flex-col h-full shadow-lg">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            &quot;Fast shipping and excellent customer service. The poster
            exceeded my expectations. Will definitely order again!&quot;
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
              E
            </div>
            <div>
              <div className="font-medium text-foreground">Emily Rodriguez</div>
              <div className="text-sm text-muted-foreground">Verified Customer</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

