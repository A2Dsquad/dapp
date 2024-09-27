'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Copy } from 'lucide-react'
import { fakeOperators } from '@/lib/constants'
import { useParams } from 'next/navigation'
import { useDelegatedOperator } from '@/hooks/use-delegated-operator'
import { shortenAddress } from '@/lib/utils'
import { useDelegate } from '@/hooks/use-delegate'
import { useUndelegate } from '@/hooks/use-undelegate'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Terminal } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WalletSelector } from '@/components/wallet-selector'

function OperatorInfo({ operator }: { operator: (typeof fakeOperators)[0] }) {
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
              <span>{shortenAddress(operator.address)}</span>
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
            <p className="text-4xl font-bold">{operator.stakers}</p>
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
}: { stake: string; selectedOperator?: (typeof fakeOperators)[0]; onDelegateToggle: () => void }) {
  const { account } = useWallet()
  const undelegateTime =
    typeof window !== 'undefined' ? localStorage.getItem('undelegate-time') : null

  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const withdrawalTime = undelegateTime
    ? new Date(Number.parseInt(undelegateTime)).getTime() + sevenDays
    : null
  const now = new Date().getTime()

  const isWithdrawalAvailable = withdrawalTime && now > withdrawalTime

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Your stake</p>
          <p className="text-3xl font-bold">{account ? `$${stake}` : '--'}</p>
        </div>
        {!account && (
          <WalletSelector className="w-full" />
        )}
        {account && undelegateTime && !isWithdrawalAvailable && (
          <div>
            <Alert>
              <Terminal className="h-5 w-5" />
              <AlertTitle>Undelegate in progress</AlertTitle>
              <AlertDescription>
                You have undelegated at {new Date(Number.parseInt(undelegateTime)).toLocaleString()}
                . You can withdraw your stake in 7 days.
              </AlertDescription>
            </Alert>
          </div>
        )}
        {account && !undelegateTime && (
          <>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your selected operator</p>
              {selectedOperator ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <img src={selectedOperator.avatar} alt={selectedOperator.name} />
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedOperator.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {shortenAddress(selectedOperator.address)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">None</div>
              )}
            </div>
            <Button
              className="w-full"
              variant={selectedOperator?.isDelegated ? 'destructive' : 'default'}
              onClick={onDelegateToggle}
            >
              {selectedOperator?.isDelegated ? 'Undelegate' : 'Delegate'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function OperatorDetailPage() {
  const { id } = useParams()
  const { account } = useWallet()

  const { data: delegatedOperator } = useDelegatedOperator()
  const delegateMutation = useDelegate()
  const undelegateMutation = useUndelegate()

  const operators = fakeOperators.map((operator) => ({
    ...operator,
    isDelegated: operator.address === delegatedOperator,
  }))

  const currentOperator = operators.find((operator) => operator.address === id)
  const selectedOperator = operators.find((operator) => operator.isDelegated)

  const handleDelegateToggle = async () => {
    if (!currentOperator || !account) return
    if (undelegateMutation.isLoading || delegateMutation.isLoading) return

    if (currentOperator.isDelegated) {
      await undelegateMutation.mutateAsync()
      localStorage.setItem('undelegate-time', Date.now().toString())
    } else {
      if (delegatedOperator && delegatedOperator !== currentOperator.address) {
        await undelegateMutation.mutateAsync()
        localStorage.setItem('undelegate-time', Date.now().toString())
      }
      await delegateMutation.mutateAsync(currentOperator.address)
    }
  }

  if (!currentOperator) {
    return (
      <main className="container mx-auto p-4 pt-16" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div>Operator not found</div>
      </main>
    )
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
