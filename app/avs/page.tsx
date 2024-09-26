import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface AVS {
  id: string;
  name: string;
  avatar: string;
  description: string;
  totalRestaked: string;
  numOperators: number;
  numStakers: number;
  rewardTokens: string;
}

const avsData: AVS[] = Array.from({ length: 6 }, (_, index) => ({
  id: `0x73984...ab43271${index}`,
  name: `AVS ${index + 1}`,
  avatar: 'https://w7.pngwing.com/pngs/1007/775/png-transparent-bnb-cryptocurrencies-icon.png',
  description: `AVS ${index + 1} provides secure and efficient validation services for the network.`,
  totalRestaked: `$${Math.floor(Math.random() * 100000) + 10000}K`,
  numOperators: Math.floor(Math.random() * 10) + 1,
  numStakers: Math.floor(Math.random() * 100) + 1,
  rewardTokens: `${Math.floor(Math.random() * 1000) + 100} APT`,
}))

function AVSCard({ avs }: { avs: AVS }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Avatar className="w-16 h-16">
            <img src={avs.avatar} alt={avs.name} />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{avs.name}</h2>
            <div className="flex items-center text-muted-foreground">
              <span>{avs.id}</span>
              <Button variant="ghost" size="icon" className="ml-2">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base text-muted-foreground mb-4">{avs.description}</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground">Total Restaked</p>
            <p className="font-semibold">{avs.totalRestaked}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground">Num. Operators</p>
            <p className="font-semibold">{avs.numOperators}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground">Num. Stakers</p>
            <p className="font-semibold">{avs.numStakers}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground">Reward Tokens</p>
            <p className="font-semibold">{avs.rewardTokens}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AVSPage() {
  return (
      <main className="container mx-auto p-4 pt-16" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avsData.map((avs) => (
            <AVSCard key={avs.id} avs={avs} />
          ))}
        </div>
      </main>
  )
}
