'use client'

import { StakingCard } from '@/app/staking/_components/staking-card'
import { useParams } from 'next/navigation'

export default function StakingPage() {
  const { id } = useParams()

  return (
    <main
      className="container mx-auto p-4 flex items-center justify-center -mt-20"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      <StakingCard
        tokenAddress={id as string}
        assetName="amAPT"
        assetIcon="https://s2.coinmarketcap.com/static/img/coins/200x200/29034.png"
      />
    </main>
  )
}
