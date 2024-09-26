'use client'

import { useState } from 'react'
import { OperatorTable } from '@/app/operator/_components/operator-table'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const initialOperators = [
  { id: '1', name: 'Operator1', avatar: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/8f/8f2f5e259a894a47df09cd62ea4db067867515c9_full.jpg', totalRestaked: '$18M', stakers: 106, avssSecured: 3, isDelegate: true },
  { id: '2', name: 'Operator2', avatar: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/8f/8f2f5e259a894a47df09cd62ea4db067867515c9_full.jpg', totalRestaked: '$12M', stakers: 156, avssSecured: 1, isDelegate: false },
]

export default function OperatorPage() {
  const [operators, setOperators] = useState(initialOperators)

  const handleDelegateToggle = (operatorId: string) => {
    setOperators(operators.map(op => 
      op.id === operatorId ? { ...op, isDelegate: !op.isDelegate } : op
    ))
  }

  return (
      <main className="container mx-auto p-4 pt-16" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Operators</CardTitle>
          </CardHeader>
          <CardContent>
            <OperatorTable operators={operators} onDelegateToggle={handleDelegateToggle} />
          </CardContent>
        </Card>
    </main>
  )
}
