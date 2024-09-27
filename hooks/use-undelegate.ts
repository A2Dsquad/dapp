import { useWallet } from '@aptos-labs/wallet-adapter-react'
import WithdrawalABI from '@sdk/abis/withdrawal.json'
import { createEntryPayload } from '@thalalabs/surf'
import { useSubmitTransaction } from '@thalalabs/surf/hooks'
import { useQueryClient } from '@tanstack/react-query'

export function useUndelegate() {
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

  const mutateAsync = async () => {
    if (!account) return

    try {
      const payload = createEntryPayload(WithdrawalABI as any, {
        function: 'undelegate',
        typeArguments: [],
        functionArguments: [account.address] as unknown as [],
      })

        await submitTransaction(payload)
      queryClient.invalidateQueries({ queryKey: ['delegated-operator'] })
      reset()
    } catch (error) {
      console.error('Error undelegating', error)
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
