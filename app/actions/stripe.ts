'use server'

import { headers } from 'next/headers'

import { stripe } from '../../lib/stripe'

export async function fetchClientSecret(amount: number, currency: string = 'eur') {
  const origin = (await headers()).get('origin')

  // Create Checkout Sessions with dynamic price based on cart total
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: 'Poster Order',
            description: 'Custom poster order',
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session.client_secret || ''
}