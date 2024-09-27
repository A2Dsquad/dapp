import { useWallet } from '@aptos-labs/wallet-adapter-react'
import StakerManagerABI from '@sdk/abis/staker-manager.json'
import { createEntryPayload } from '@thalalabs/surf';
import { useSubmitTransaction } from '@thalalabs/surf/hooks';

export function useStake(tokenAddress: string) {
  const { account } = useWallet()
  const {
    isIdle,
    reset,
    isLoading: submitIsLoading,
    error: submitError,
    submitTransaction,
    data: submitResult,
  } = useSubmitTransaction();

  const mutateAsync = async (amount: string) => {
    if (!account) return

    const payload = createEntryPayload(StakerManagerABI as any, {
      function: 'stake_asset_entry',
      typeArguments: [],
      functionArguments: [tokenAddress, amount] as unknown as [],
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
