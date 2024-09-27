import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function RewardDetails({ rewards }: { rewards: { name: string, amount: string, token: string }[] }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Your reward details</h2>
        <div className="space-y-2">
          {rewards.map((reward, index) => (
            <div key={index.toString()} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <span>{reward.name}</span>
              </div>
              <span>{reward.amount} {reward.token}</span>
            </div>
          ))}
        </div>
        <Button className="w-full mt-8">Claim</Button>
      </CardContent>
    </Card>
  )
}
