"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

import Navigation from "@/components/homepage/layout/navigation";

export default function Header() {
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
    return (
        <header className="border-b sticky top-0 z-100 bg-background shadow-md">
          <nav className="container mx-auto flex items-center justify-between px-4 py-1">
            {/* Mobile Hamburger Button - Left Side */}
            <div className="md:hidden relative">
              <Navigation />
            </div>
            
            {/* Logo and Company Name - Left on Desktop, Center on Mobile */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity md:static absolute left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0">
              <Image 
                src="/images/logo.png?v=2" 
                alt="Poster Gifts Logo" 
                width={200} 
                height={200} 
                className="w-15 h-15"
                priority
                unoptimized
              />
              <h1 className="text-2xl font-bold">Poster Gifts</h1>
            </Link>
            
            {/* Desktop Navigation and Shopping Cart - Right Side */}
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <div className="hidden md:block relative">
                <Navigation />
              </div>
              
              {/* Shopping Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  className="h-10 w-10 md:h-9 md:w-9 p-0 relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart 
                    className="md:h-5 md:w-5" 
                    strokeWidth={3}
                    style={{ width: '2rem', height: '2rem' }}
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </nav>
        </header>
    )
}