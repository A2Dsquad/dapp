'use client'

import { StakingSummary } from '@/app/(home)/_components/staking-summary'
import { RewardDetails } from '@/app/(home)/_components/staking-rewards'
import { AssetTable } from '@/app/(home)/_components/assets-table'
import { usePoolShares } from '@/hooks/use-pool-shares'
import { fromDecimals } from '@/lib/number'
import BigNumber from 'bignumber.js'

export default function StakingPlatform() {
  const fakeRewards = [
    { name: 'ETH', amount: '0.05', token: 'ETH' },
    { name: 'USDC', amount: '10.00', token: 'USDC' },
    { name: 'APT', amount: '25.50', token: 'APT' },
  ]

  const fakeAssets = [
    { name: 'amAPT', apy: '5.23', tvl: '1,234.56', restaked: '567.89', share: '2.34' },
    { name: 'amETH', apy: '4.18', tvl: '9,876.54', restaked: '432.10', share: '1.87' },
    { name: 'amUSDC', apy: '3.75', tvl: '5,678.90', restaked: '321.09', share: '1.45' },
    { name: 'amBTC', tvl: '3,456.78', restaked: '234.56', share: '0.98' },
    { name: 'amLINK', tvl: '2,345.67', restaked: '123.45', share: '0.76' },
    { name: 'amUNI', tvl: '1,234.56', restaked: '98.76', share: '0.54' },
    { name: 'amSNX', tvl: '987.65', restaked: '76.54', share: '0.32' },
    { name: 'amAAVE', tvl: '876.54', restaked: '65.43', share: '0.21' },
  ]

  const { data: poolShares } = usePoolShares()

  const refinedAssets = fakeAssets.map(asset => ({
    ...asset,
    restaked: fromDecimals(poolShares?.[0]?.userStaked ?? 0),
    share: BigNumber(poolShares?.[0]?.userStaked ?? 0).dividedBy(poolShares?.[0]?.poolStaked ?? 1).multipliedBy(100).toFixed(2),
  }))


  return (
    <main className="container mx-auto p-4 pb-12 space-y-6 pt-16">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StakingSummary restaked="1,234.56" claimable="78.90" />
        </div>
        <RewardDetails rewards={fakeRewards} />
      </div>
      <AssetTable assets={refinedAssets} />
    </main>
  )
}
