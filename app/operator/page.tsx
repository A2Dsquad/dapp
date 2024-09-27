'use client'

import { OperatorTable } from '@/app/operator/_components/operator-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fakeOperators } from '@/lib/constants'
import { useDelegatedOperator } from '@/hooks/use-delegated-operator'

export default function OperatorPage() {
  const { data: delegatedOperator } = useDelegatedOperator()

  const operators = fakeOperators.map((operator) => ({
    ...operator,
    isDelegated: operator.address === delegatedOperator,
  }))

  return (
    <main className="container mx-auto p-4 pt-16" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Operators</CardTitle>
        </CardHeader>
        <CardContent>
          <OperatorTable operators={operators} />
        </CardContent>
      </Card>
    </main>
  )
}
