import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useClaimReward } from '@/hooks/use-claim-reward'

export function RewardDetails({
  reward,
}: { reward: { name: string; amount: string; token: string } }) {
  const claimReward = useClaimReward()

  const handleClaim = () => {
    claimReward.mutate()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Your reward details</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="https://cryptoeq-db.s3.amazonaws.com/16558499261041876703" className="w-6 h-6 bg-gray-200 rounded-full" alt="reward token" />
              <span>{reward.name}</span>
            </div>
            <span>
              {reward.amount} {reward.token}
            </span>
          </div>
        </div>
        <Button className="w-full mt-8" disabled={!Number(reward.amount)} onClick={handleClaim} loading={claimReward.isPending}>Claim</Button>
      </CardContent>
    </Card>
  )
}
