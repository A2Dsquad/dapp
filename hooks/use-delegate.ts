import { useWallet } from '@aptos-labs/wallet-adapter-react'
import StakerManagerABI from '@sdk/abis/staker-manager.json'
import { createEntryPayload } from '@thalalabs/surf'
import { useSubmitTransaction } from '@thalalabs/surf/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { loopAsync } from '@/lib/utils'

export function useDelegate() {
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

  const mutateAsync = async (operator: string) => {
    if (!account) return

    try {
      const payload = createEntryPayload(StakerManagerABI as any, {
        function: 'delegate',
        typeArguments: [],
        functionArguments: [operator] as unknown as [],
      })

      await submitTransaction(payload)
      toast.success('Delegated successfully')
      loopAsync(3, () => queryClient.invalidateQueries({ queryKey: ['delegated-operator'] }), 1000)
      reset()
    } catch (error) {
      console.error('Error delegating', error)
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
