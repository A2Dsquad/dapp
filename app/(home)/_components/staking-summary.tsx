import { Card, CardContent } from "@/components/ui/card"

export function StakingSummary({ restaked, claimable }: { restaked: string, claimable: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2 text-muted-foreground">You restaked</h2>
          <p className="text-4xl font-bold">${restaked}K</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2 text-muted-foreground">Your claimable rewards</h2>
          <p className="text-4xl font-bold">${claimable}K</p>
        </CardContent>
      </Card>
    </div>
  )
}
