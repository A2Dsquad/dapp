'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { NumericInput } from '@/components/ui/numeric-input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBalance } from '@/hooks/use-balance'

interface StakingCardProps {
  assetName: string
  assetIcon: string
  tokenAddress: string
}

const formSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val)
      return !Number.isNaN(num) && num > 0
    },
    {
      message: 'Please enter a valid positive number',
    }
  ),
})

type FormValues = z.infer<typeof formSchema>

export function StakingCard({ assetName, assetIcon, tokenAddress }: StakingCardProps) {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const router = useRouter()
  const { data: balance = '0' } = useBalance(tokenAddress)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
  })

  const handlePercentageClick = (percentage: number) => {
    const maxAmount = Number.parseFloat(balance.replace(/,/g, ''))
    const newAmount = ((maxAmount * percentage) / 100).toFixed(2)
    form.setValue('amount', newAmount)
  }

  const onSubmit = (data: FormValues) => {
    // This is where you would handle the form submission
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(data)
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="-ml-2 flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <img src={assetIcon} alt={assetName} />
            </Avatar>
            <CardTitle className="text-lg font-medium">{assetName}</CardTitle>
          </div>
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <Button
            variant={mode === 'deposit' ? 'secondary' : 'outline'}
            onClick={() => setMode('deposit')}
            size="sm"
            className="w-full md:w-auto"
          >
            Restake
          </Button>
          <Button
            variant={mode === 'withdraw' ? 'secondary' : 'outline'}
            onClick={() => setMode('withdraw')}
            size="sm"
            className="w-full md:w-auto"
          >
            Unstake
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">You are {mode === 'deposit' ? 'restaking' : 'unstaking'}</p>
              <div className="bg-secondary p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumericInput
                          {...field}
                          className="text-4xl font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                          placeholder="000.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">${balance}</span>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(25)}
                    >
                      25%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(50)}
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(100)}
                    >
                      Max
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={!form.formState.isDirty}>
              {mode === 'deposit' ? 'Restake' : 'Unstake'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
