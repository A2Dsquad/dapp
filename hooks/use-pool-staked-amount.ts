import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { surfClient } from '@/lib/surf-client'
import StakerManagerAbi from '@sdk/abis/staker-manager.json'

export function usePoolStakedAmount(tokenAddress: string) {
  const { account } = useWallet()
  const stakerClient = surfClient.useABI(StakerManagerAbi as any)

  return useQuery({
    queryKey: ['pool-staked-amount', account?.address],
    queryFn: async () => {
      try {
        const [tokens, nonnormalizedShares] = await stakerClient.view.staker_nonnormalized_shares({
          functionArguments: [account?.address ?? ''],
          typeArguments: [],
        }) as any

        const userShareInPools = tokens.map((token: { inner: string }, index: number) => ({
          token: token.inner,
          userStaked: nonnormalizedShares[index],
        }))

        const poolStakedAmount = userShareInPools.find((pool: { token: string }) => pool.token === tokenAddress)

        if (!poolStakedAmount) return 0;

        return poolStakedAmount.userStaked
      } catch (error) {
        console.error('Error fetching pool shares', error)
        return null
      }
    },
    enabled: !!account?.address,
  })
}
