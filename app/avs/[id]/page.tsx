import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface AVSDetail {
  id: string;
  name: string;
  avatar: string;
  delegatedTVL: string;
  restakers: number;
  operators: number;
  about: string;
  weeklyRewards: {
    token: string;
    amount: string;
    icon: string;
  }[];
}

const avsDetail: AVSDetail = {
  id: '0x73984...ab432714',
  name: 'AVS 1',
  avatar: 'https://w7.pngwing.com/pngs/1007/775/png-transparent-bnb-cryptocurrencies-icon.png',
  delegatedTVL: '$217.57K',
  restakers: 100,
  operators: 100,
  about: 'AVS 1 is a leading validator service in the network, providing secure and efficient validation for various blockchain operations. With a strong focus on reliability and performance, AVS 1 ensures the integrity of transactions and smart contract executions.',
  weeklyRewards: [
    { token: 'APT', amount: '156 APT', icon: 'https://w7.pngwing.com/pngs/1007/775/png-transparent-bnb-cryptocurrencies-icon.png' },
    { token: 'Token 1', amount: '156 TK', icon: 'https://w7.pngwing.com/pngs/1007/775/png-transparent-bnb-cryptocurrencies-icon.png' },
  ],
}

function StatsCard({ avs }: { avs: AVSDetail }) {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 border rounded-lg bg-muted">
        <div>
        <p className="text-sm text-muted-foreground">Delegated TVL</p>
        <p className="text-4xl font-bold">{avs.delegatedTVL}</p>
        </div>
        <div>
        <p className="text-sm text-muted-foreground">Restakers</p>
        <p className="text-4xl font-bold">{avs.restakers}</p>
        </div>
        <div>
        <p className="text-sm text-muted-foreground">Operators</p>
        <p className="text-4xl font-bold">{avs.operators}</p>
        </div>
    </div>
  )
}


function AvsInfo({ avs }: { avs: AVSDetail }) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
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
          <StatsCard avs={avsDetail} />
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">About {avs.name}</h3>
            <p className="text-muted-foreground">{avs.about}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  

function WeeklyRewardsCard({ rewards }: { rewards: AVSDetail['weeklyRewards'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Weekly Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          {rewards.map((reward, index) => (
            <div key={index.toString()} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <img src={reward.icon} alt={reward.token} />
                </Avatar>
                <span className="text-muted-foreground">{reward.token}</span>
              </div>
              <span className="font-semibold">{reward.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AVSDetailPage() {
  return (
    <main className="container mx-auto p-4 pt-16" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AvsInfo avs={avsDetail} />
        </div>
        <div>
          <WeeklyRewardsCard rewards={avsDetail.weeklyRewards} />
        </div>
      </div>
    </main>
  )
}
