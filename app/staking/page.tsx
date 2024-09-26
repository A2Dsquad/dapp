import { StakingCard } from '@/app/staking/_components/staking-card'

export default function StakingPage() {
  return (
    <main
      className="container mx-auto p-4 flex items-center justify-center -mt-20"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      <StakingCard
        assetName="amAPT"
        assetIcon="https://w7.pngwing.com/pngs/1007/775/png-transparent-bnb-cryptocurrencies-icon.png"
        balance="1,000.00"
      />
    </main>
  )
}
