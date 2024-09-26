'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Copy } from 'lucide-react'

interface Operator {
  id: string
  name: string
  avatar: string
  delegatedTVL: string
  restakers: number
  avssSecured: number
  about: string
}

const operators: Operator[] = [
  {
    id: '0x87384...ab432714',
    name: 'Operator1',
    avatar:
      'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/8f/8f2f5e259a894a47df09cd62ea4db067867515c9_full.jpg',
    delegatedTVL: '$217.57K',
    restakers: 100,
    avssSecured: 100,
    about:
      'Operator1 is a leading validator in the network with a strong track record of performance and reliability. Operator1 is a leading validator in the network with a strong track record of performance and reliability.',
  },
  {
    id: '0x73984...ab432714',
    name: 'Operator2',
    avatar:
      'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/8f/8f2f5e259a894a47df09cd62ea4db067867515c9_full.jpg',
    delegatedTVL: '$217.57K',
    restakers: 100,
    avssSecured: 100,
    about:
      'Operator2 offers competitive staking rewards and has a robust infrastructure to support network operations.',
  },
]

function OperatorInfo({ operator }: { operator: Operator }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <img src={operator.avatar} alt={operator.name} />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{operator.name}</h2>
            <div className="flex items-center text-muted-foreground">
              <span>{operator.id}</span>
              <Button variant="ghost" size="icon" className="ml-2">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 border rounded-lg bg-muted">
          <div>
            <p className="text-sm text-muted-foreground">Delegated TVL</p>
            <p className="text-4xl font-bold">{operator.delegatedTVL}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Restakers</p>
            <p className="text-4xl font-bold">{operator.restakers}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AVS Secured</p>
            <p className="text-4xl font-bold">{operator.avssSecured}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">About {operator.name}</h3>
          <p className="text-muted-foreground">{operator.about}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StakeInfo({
  stake,
  selectedOperator,
  onDelegateToggle,
}: { stake: string; selectedOperator: Operator; onDelegateToggle: () => void }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Your stake</p>
          <p className="text-3xl font-bold">${stake}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Your selected operator</p>
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <img src={selectedOperator.avatar} alt={selectedOperator.name} />
            </Avatar>
            <div>
              <p className="font-semibold">{selectedOperator.name}</p>
              <p className="text-xs text-muted-foreground">{selectedOperator.id}</p>
            </div>
          </div>
        </div>
        <Button
          className="w-full"
          variant={selectedOperator.name === 'Operator2' ? 'destructive' : 'default'}
          onClick={onDelegateToggle}
        >
          {selectedOperator.name === 'Operator2' ? 'Undelegate' : 'Delegate'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function OperatorDetailPage() {
  const [currentOperator, setCurrentOperator] = useState(operators[0])
  const [selectedOperator, setSelectedOperator] = useState(operators[1])

  const handleDelegateToggle = () => {
    setSelectedOperator(selectedOperator === operators[0] ? operators[1] : operators[0])
  }

  return (
    <main className="container mx-auto p-4 pt-16" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <OperatorInfo operator={currentOperator} />
        </div>
        <div>
          <StakeInfo
            stake="5000"
            selectedOperator={selectedOperator}
            onDelegateToggle={handleDelegateToggle}
          />
        </div>
      </div>
    </main>
  )
}
