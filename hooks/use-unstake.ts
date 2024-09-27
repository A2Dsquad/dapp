import { useWallet } from '@aptos-labs/wallet-adapter-react'
import WithdrawalABI from '@sdk/abis/withdrawal.json'
import { createEntryPayload } from '@thalalabs/surf'
import { useSubmitTransaction } from '@thalalabs/surf/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { loopAsync } from '@/lib/utils'

export function useUnstake(tokenAddress: string) {
  const { account } = useWallet()
  const {
    isIdle,
    reset,
    isLoading: submitIsLoading,
    error: submitError,
    submitTransaction,
    data: submitResult,
  } = useSubmitTransaction()

  const queryClient = useQueryClient()
  const mutateAsync = async (amount: string) => {
    if (!account) return

    try {
      const payload = createEntryPayload(WithdrawalABI as any, {
        function: 'queue_withdrawal',
        typeArguments: [],
        functionArguments: [[tokenAddress], [amount]] as unknown as [],
      })

      await submitTransaction(payload)
      const unstakeTimesLocal = localStorage.getItem('unstake-time')?.split(',') ?? []
      if (unstakeTimesLocal) {
        localStorage.setItem('unstake-time', [...unstakeTimesLocal, Date.now().toString()].join(','))
      } else {
        localStorage.setItem('unstake-time', Date.now().toString())
      }
      toast.success('Unstaked successfully')
      loopAsync(3, () => queryClient.invalidateQueries({ queryKey: ['pool-staked-amount', account?.address] }), 1000)
      reset()
    } catch (error) {
      console.error('unstake error', error)
      reset()
    }
  }

  return {
    isIdle,
    reset,
    isLoading: submitIsLoading,
    error: submitError,
    mutateAsync,
    data: submitResult,
  }
}
