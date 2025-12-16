import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Demo Shop</h3>
            <p className="text-sm text-muted-foreground">
              A portfolio demonstration project showcasing modern web development practices.
            </p>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Portfolio Project</h3>
            <p className="text-sm text-muted-foreground">
              This is a demonstration project showcasing modern web development practices and e-commerce functionality.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Demo Shop - Portfolio Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

