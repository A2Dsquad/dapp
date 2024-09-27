import { useWallet } from '@aptos-labs/wallet-adapter-react'
import StakerManagerABI from '@sdk/abis/staker-manager.json'
import { createEntryPayload } from '@thalalabs/surf';
import { useSubmitTransaction } from '@thalalabs/surf/hooks';

export function useDelegate() {
  const { account } = useWallet()
  const {
    isIdle,
    reset,
    isLoading: submitIsLoading,
    error: submitError,
    submitTransaction,
    data: submitResult,
  } = useSubmitTransaction();

  const mutateAsync = async (operator: string) => {
    if (!account) return

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const payload = createEntryPayload(StakerManagerABI as any, {
      function: 'delegate',
      typeArguments: [],
      functionArguments: [operator] as unknown as [],
    })

    await submitTransaction(payload)
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
