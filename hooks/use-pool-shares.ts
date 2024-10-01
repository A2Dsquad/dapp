import { useQuery } from '@tanstack/react-query'
import { surfClient } from '@/lib/surf-client'
import StakingPoolAbi from '@sdk/abis/staking-pool.json'
import { mapTokenToPool } from '@/lib/constants'

export function usePoolShares() {
  const stakingPoolClient = surfClient.useABI(StakingPoolAbi as any)

  return useQuery({
    queryKey: ['pool-shares'],
    queryFn: async () => {
      try {
        const poolTotalShares = await Promise.all(Object.entries(mapTokenToPool).map(async ([tokenAddress, poolAddress]) => {
          const [totalShares] = await stakingPoolClient.view.total_shares({
            functionArguments: [poolAddress],
            typeArguments: [],
          }) as any

          return {
            totalShares,
            tokenAddress,
          }
        }));

        return poolTotalShares
      } catch (error) {
        console.error('Error fetching pool shares', error)
        return null
      }
    },
    enabled: true,
  })
}
