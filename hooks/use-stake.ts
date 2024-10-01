import { useWallet } from '@aptos-labs/wallet-adapter-react'
import StakerManagerABI from '@sdk/abis/staker-manager.json'
import { createEntryPayload } from '@thalalabs/surf'
import { useSubmitTransaction } from '@thalalabs/surf/hooks'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { loopAsync } from '@/lib/utils'

export function useStake(tokenAddress: string) {
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
      const payload = createEntryPayload(StakerManagerABI as any, {
        function: 'stake_asset_entry',
        typeArguments: [],
        functionArguments: [tokenAddress, amount] as unknown as [],
      })

      await submitTransaction(payload)
      toast.success('Staked successfully')
      loopAsync(3, () => queryClient.invalidateQueries({ queryKey: ['pool-staked-amount', account?.address] }), 1000)
      loopAsync(3, () => queryClient.invalidateQueries({ queryKey: ['balance', tokenAddress, account?.address]}), 1000)
      reset()
    } catch (error) {
      console.error('Error staking', error)
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
