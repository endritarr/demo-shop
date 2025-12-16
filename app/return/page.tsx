import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import { stripe } from '../../lib/stripe'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function Return({ searchParams }: { searchParams: { session_id: string } }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  const { status, customer_details } = session
  const customerEmail = customer_details?.email || 'you'

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    return (
      <div className="min-h-screen flex items-start justify-center pt-24 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-primary">
                  🎨 Demo/Portfolio Project
                </p>
              </div>
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground">
                This is a demo checkout flow. In a real application, a confirmation email would be sent to{' '}
                <span className="font-medium text-foreground">{customerEmail}</span>.
              </p>
            </div>

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}