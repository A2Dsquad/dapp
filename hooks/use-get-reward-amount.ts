import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'

interface RewardResponse {
  id: number,
  earner: string,
  rewardToken: string,
  totalClaimed: string,
  pendingClaimed: string
}

export function useGetRewardAmount() {
  const { account } = useWallet()

  return useQuery({
    queryKey: ['get-reward-amount', account?.address],
    queryFn: async () => {
      if (!account?.address) return 0
      try {
        const rewardResponse = await fetch(`https://test.lotusfarm.online/api/rewards/${account?.address}`)
        const data = await rewardResponse.json() as RewardResponse
        return Number(data.pendingClaimed)
      } catch (error) {
        console.error('Error fetching reward amount', error)
        return 0
      }
    },
    enabled: !!account?.address,
  })
}
