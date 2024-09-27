import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { surfClient } from '@/lib/surf-client'
import StakerManagerAbi from '@sdk/abis/staker-manager.json'

export function useDelegatedOperator() {
  const { account } = useWallet()
  const stakerClient = surfClient.useABI(StakerManagerAbi as any)

  return useQuery({
    queryKey: ['delegated-operator', account?.address],
    queryFn: async () => {
      try {
        const [operator] = await stakerClient.view.delegate_of({
          functionArguments: [account?.address ?? ''],
          typeArguments: [],
        }) as any

        if (operator === '0x0') return null

        return operator
      } catch (error) {
        console.error('Error fetching pool shares', error)
        return null
      }
    },
    enabled: !!account?.address,
  })
}
