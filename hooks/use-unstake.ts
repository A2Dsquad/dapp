import { useWallet } from '@aptos-labs/wallet-adapter-react'
import WithdrawalABI from '@sdk/abis/withdrawal.json'
import { createEntryPayload } from '@thalalabs/surf'
import { useSubmitTransaction } from '@thalalabs/surf/hooks'

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

  const mutateAsync = async (amount: string) => {
    if (!account) return

    try {
      const payload = createEntryPayload(WithdrawalABI as any, {
        function: 'queue_withdrawal',
        typeArguments: [],
        functionArguments: [[tokenAddress], [amount]] as unknown as [],
      })

      await submitTransaction(payload)
      localStorage.setItem('unstake-time', Date.now().toString())
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
