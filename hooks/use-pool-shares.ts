import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { surfClient } from '@/lib/surf-client'
import StakerManagerAbi from '@sdk/abis/staker-manager.json'
import StakingPoolAbi from '@sdk/abis/staking-pool.json'

const mapTokenToPool = {
  '0x3a97789007a67518d51c1733caef0c0a60d5db819e64d9bb5abc004f2df934a2': '0x7609205655ba8dd9c6882d2a8e025e3262b244c1c9b174f2711f688c49f6a6e2',
}

export function usePoolShares() {
  const { account } = useWallet()
  const stakerClient = surfClient.useABI(StakerManagerAbi as any)
  const stakingPoolClient = surfClient.useABI(StakingPoolAbi as any)

  return useQuery({
    queryKey: ['pool-shares', account?.address],
    queryFn: async () => {
      try {
        const [tokens, nonnormalizedShares] = await stakerClient.view.staker_nonnormalized_shares({
          functionArguments: [account?.address ?? ''],
          typeArguments: [],
        }) as any

        const poolTotalShares = await Promise.all(tokens.map(async (token: { inner: string }) => {
          const [amount] = await stakingPoolClient.view.total_shares({
            functionArguments: [mapTokenToPool[token.inner as keyof typeof mapTokenToPool]],
            typeArguments: [],
          }) as any

          return amount
        }));

        const userShareInPools = tokens.map((token: { inner: string }, index: number) => ({
          token: token.inner,
          userStaked: nonnormalizedShares[index],
          poolStaked: poolTotalShares[index],
        }))

        return userShareInPools
      } catch (error) {
        console.error('Error fetching pool shares', error)
        return null
      }
    },
    enabled: !!account?.address,
  })
}
