"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
    NavigationMenuItem, 
    NavigationMenuLink, 
    NavigationMenuList, 
    NavigationMenu 
} from "@radix-ui/react-navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/products", label: "Products" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className={cn("flex items-center gap-4")}>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Hamburger Button */}
            <Button
              ref={buttonRef}
              variant="ghost"
              className="md:hidden h-10 w-10 p-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                // className="h-5!important w-5!important size-5!important"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ width: '2rem', height: '2rem' }}
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>

            {/* Mobile Menu */}
            {isOpen && (
              <div ref={menuRef} className="absolute top-full left-0 mt-2 bg-background border rounded-lg shadow-lg md:hidden z-[9999] min-w-[200px]">
                <nav>
                  <div className="flex flex-col py-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="hover:bg-muted transition-colors px-4 py-3 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            )}
        </>
    )
}