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
import { useStake } from '@/hooks/use-stake'
import { toDecimals } from '@/lib/number'
import BigNumber from 'bignumber.js'
import { usePoolStakedAmount } from '@/hooks/use-pool-staked-amount'
import { fromDecimals } from '@/lib/number'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useUnstake } from '@/hooks/use-unstake'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

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
    },
  ),
})

type FormValues = z.infer<typeof formSchema>

export function StakingCard({ assetName, assetIcon, tokenAddress }: StakingCardProps) {
  const { account } = useWallet()

  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const router = useRouter()
  const { data: balance = '0' } = useBalance(tokenAddress)
  const { data: stakedAmount = 0 } = usePoolStakedAmount(tokenAddress)
  const stakeMutation = useStake(tokenAddress)
  const unstakeMutation = useUnstake(tokenAddress)

  const unstakeTime = typeof window !== 'undefined' ? localStorage.getItem('unstake-time') : null

  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const unstakeWithdrawalTime = unstakeTime
    ? new Date(Number.parseInt(unstakeTime)).getTime() + sevenDays
    : null
  const now = new Date().getTime()

  const stakedAmountFormatted = fromDecimals(stakedAmount ?? 0)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
  })

  const inputAmount = form.watch('amount')

  const handlePercentageClick = (percentage: number) => {
    let maxAmount = 0
    if (mode === 'withdraw') {
      maxAmount = Number.parseFloat(stakedAmountFormatted.replace(/,/g, ''))
    } else {
      maxAmount = Number.parseFloat(balance.replace(/,/g, ''))
    }

    const newAmount = BigNumber(maxAmount).multipliedBy(percentage).dividedBy(100).toString()
    form.setValue('amount', newAmount.toString())
  }

  const onSubmit = (data: FormValues) => {
    const amountInDecimal = toDecimals(data.amount)
    if (mode === 'deposit') {
      stakeMutation.mutateAsync(amountInDecimal)
    } else {
      unstakeMutation.mutateAsync(amountInDecimal)
    }
  }

  const isDisabled =
    mode === 'withdraw' ? stakedAmount === 0 || !inputAmount : !balance || !inputAmount

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
              <p className="text-sm font-medium mb-3">
                You are {mode === 'deposit' ? 'restaking' : 'unstaking'}
              </p>
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
                  <span className="text-sm text-muted-foreground">
                    {mode === 'deposit' ? balance : stakedAmountFormatted} {assetName}
                  </span>
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
            {mode === 'withdraw' &&
              unstakeTime &&
              unstakeWithdrawalTime &&
              now < unstakeWithdrawalTime && (
                <Alert>
                  <Terminal className="h-5 w-5" />
                  <AlertTitle>Unstake in queue</AlertTitle>
                  <AlertDescription>
                    You have unstaked at{' '}
                    {new Date(Number.parseInt(unstakeTime ?? '')).toLocaleString()}. You can
                    withdraw your stake in 7 days.
                  </AlertDescription>
                </Alert>
              )}
            {(mode === 'deposit' || !unstakeTime) && (
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isDirty || isDisabled || !account}
              >
                {mode === 'deposit' ? 'Restake' : 'Unstake'}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
