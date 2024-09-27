import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { surfClient } from '@/lib/surf-client'
import PrimaryFAStoreAbi from '@sdk/abis/primary-fungible-store.json'
import { faMetdataType } from '@sdk/constants'
import { fromDecimals } from '@/lib/number'

export function useBalance(tokenAddress: string) {
  const { account } = useWallet()
  const storeClient = surfClient.useABI(PrimaryFAStoreAbi as any)

  return useQuery({
    queryKey: ['balance', tokenAddress, account?.address],
    queryFn: async () => {
      try {
        const [balance] = await storeClient.view.balance({
          functionArguments: [account?.address ?? '', tokenAddress] as unknown as [],
          typeArguments: [faMetdataType],
        })
        return fromDecimals(balance as string)
      } catch (error) {
        console.error('Error fetching balance', error)
        return '0'
      }
    },
    enabled: !!account?.address && !!tokenAddress,
  })
}
