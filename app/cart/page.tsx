"use client";

import { useState } from "react";
import Link from "next/link";

import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "@/lib/gelato/api";
import { Order } from "@/lib/gelato/const";
import TextField from "@/components/ui/forms/TextField";
import Checkout from "@/components/cart/checkout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type CheckoutStep = "cart" | "shipping" | "payment";

export default function CartPage() {
  const { cartItems, clearCart, getTotalItems, getTotalPrice } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postCode: "",
    country: "US",
    email: "",
    phone: "",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep === "cart") {
      setCurrentStep("shipping");
    } else if (currentStep === "shipping") {
      // Validate before proceeding
      // State is only required for US
      const requiresState = shippingAddress.country === "US" || shippingAddress.country === "USA";
      
      if (!shippingAddress.firstName || !shippingAddress.lastName || 
          !shippingAddress.addressLine1 || !shippingAddress.city || 
          (requiresState && !shippingAddress.state) || !shippingAddress.postCode || 
          !shippingAddress.country || !shippingAddress.email || 
          !shippingAddress.phone) {
        alert("Please fill in all required address fields");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(shippingAddress.email)) {
        alert("Please enter a valid email address");
        return;
      }
      setCurrentStep("payment");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "shipping") {
      setCurrentStep("cart");
    } else if (currentStep === "payment") {
      setCurrentStep("shipping");
    }
  };

  const handleProceedToCheckout = async () => {

    // Generate unique order reference ID
    const orderReferenceId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const orderData: Order = {
        orderType: "order",
        orderReferenceId: orderReferenceId,
        currency: "USD",
        items: cartItems.map((item, index) => ({
          itemReferenceId: `ITEM-${item.product.id}-${index}`,
          productUid: item.variant.productUid,
          files: [{
            type: "default",
            url: "https://postergifts-s3-bucket-1.s3.us-east-1.amazonaws.com/Products/poster-8x10+(3).pdf"
          }],
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || undefined,
          city: shippingAddress.city,
          state: (shippingAddress.country === "US" || shippingAddress.country === "USA")
            ? shippingAddress.state 
            : undefined,
          postCode: shippingAddress.postCode,
          country: shippingAddress.country,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
        },
      };
      
      console.log("Sending order to Gelato:", JSON.stringify(orderData, null, 2));
      
      const order = await createOrder(orderData);
      console.log("Order created successfully:", order);
      alert("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create order";
      alert(`Error: ${errorMessage}\n\nCheck console for details.`);
    }
  };
  if (cartItems.length === 0) {
    return (
      <main className="container mx-auto py-24 px-4 max-w-3xl">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Shopping Cart
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {/* Empty Cart */}
          <div className="space-y-8 text-lg leading-relaxed">
            <p className="text-muted-foreground max-w-2xl">
              Your cart is currently empty. Start adding items to see them here!
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {currentStep === "cart" ? (
                <BreadcrumbPage>Cart</BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  onClick={() => setCurrentStep("cart")}
                  className="cursor-pointer"
                >
                  Cart
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {currentStep === "shipping" ? (
                <BreadcrumbPage>Shipping</BreadcrumbPage>
              ) : currentStep === "payment" ? (
                <BreadcrumbLink 
                  onClick={() => setCurrentStep("shipping")}
                  className="cursor-pointer"
                >
                  Shipping
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">Shipping</span>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {currentStep === "payment" ? (
                <BreadcrumbPage>Payment</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">Payment</span>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="mb-8">
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Cart Items */}
          {currentStep === "cart" && (
            <div>
              {/* <div className="mb-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div> */}
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.product.id}-${item.variant.productUid}`}
                  item={item}
                />
              ))}
            </div>
          )}

          {/* Step 2: Shipping Address Form */}
          {currentStep === "shipping" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="First Name *"
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleAddressChange}
                  placeholder="John"
                  props={{}}
                />
                <TextField
                  label="Last Name *"
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleAddressChange}
                  placeholder="Doe"
                  props={{}}
                />
                <TextField
                  label="Email *"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleAddressChange}
                  placeholder="john.doe@example.com"
                  props={{ type: "email" }}
                />
                <TextField
                  label="Phone *"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  placeholder="1234567890"
                  props={{ type: "tel" }}
                />
                <div className="md:col-span-2">
                  <TextField
                    label="Address Line 1 *"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="123 Main St"
                    props={{}}
                  />
                </div>
                <div className="md:col-span-2">
                  <TextField
                    label="Address Line 2"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Apt 4B (optional)"
                    props={{}}
                  />
                </div>
                <TextField
                  label="City *"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  placeholder="New York"
                  props={{}}
                />
                {(shippingAddress.country === "US" || shippingAddress.country === "USA") && (
                  <TextField
                    label="State *"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    placeholder="NY"
                    props={{}}
                  />
                )}
                <TextField
                  label="Postal Code *"
                  name="postCode"
                  value={shippingAddress.postCode}
                  onChange={handleAddressChange}
                  placeholder="10001"
                  props={{}}
                />
                <TextField
                  label="Country *"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  placeholder="US"
                  props={{}}
                />
              </div>
            </CardContent>
          </Card>
          )}

          {/* Step 3: Payment */}
          {currentStep === "payment" && (
            <Card>
              <CardContent className="p-6">
                {/* <h2 className="text-2xl font-bold mb-4">Payment</h2> */}
                <Checkout amount={getTotalPrice()} currency="eur" />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary - Only show on cart and payment steps */}
        {(currentStep === "cart" || currentStep === "payment") && (
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {currentStep === "cart" && (
                    <Button className="w-full" size="lg" onClick={handleNextStep}>
                      Proceed to Checkout
                    </Button>
                  )}
                  {currentStep === "payment" && (
                    <Button variant="outline" className="w-full" onClick={handlePreviousStep}>
                      Back to Shipping
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation buttons for shipping step */}
        {currentStep === "shipping" && (
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleNextStep}>
                    Continue to Payment
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handlePreviousStep}>
                    Back to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
