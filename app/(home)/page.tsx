"use client";

import { StakingSummary } from "@/app/(home)/_components/staking-summary";
import { RewardDetails } from "@/app/(home)/_components/staking-rewards";
import { AssetTable } from "@/app/(home)/_components/assets-table";
import { usePoolShares } from "@/hooks/use-pool-shares";
import { useGetRewardAmount } from "@/hooks/use-get-reward-amount";
import { fromDecimals } from "@/lib/number";
import BigNumber from "bignumber.js";
import { abbreviateNumber } from "@/lib/number";
import { useUserShares } from "@/hooks/use-user-shares";

export default function StakingPlatform() {
  const fakeReward = { name: "rZkETH", amount: "0", token: "rZkETH" };

  const fakeAssets = [
    {
      name: "amETH",
      apy: "4.18",
      tvl: "9876.54",
      restaked: "432.10",
      share: "1.87",
    },
    {
      name: "amUSDC",
      apy: "3.75",
      tvl: "5678.90",
      restaked: "321.09",
      share: "1.45",
    },
    { name: "amBTC", tvl: "3456.78", restaked: "234.56", share: "0.98" },
    { name: "amLINK", tvl: "2345.67", restaked: "123.45", share: "0.76" },
    { name: "amUNI", tvl: "1234.56", restaked: "98.76", share: "0.54" },
    { name: "amSNX", tvl: "987.65", restaked: "76.54", share: "0.32" },
    { name: "amAAVE", tvl: "876.54", restaked: "65.43", share: "0.21" },
  ];

  const { data: poolShares } = usePoolShares();
  const { data: userShares } = useUserShares();
  const { data: rewardAmount } = useGetRewardAmount();

  const reward = {
    ...fakeReward,
    amount: rewardAmount?.toString() ?? "0",
  };

  const realAssets = [
    {
      name: "amAPT",
      apy: "5.23",
      tvl: fromDecimals(poolShares?.[0]?.totalShares ?? 1),
      restaked: userShares?.[0]?.userStaked
        ? fromDecimals(userShares?.[0]?.userStaked ?? 0)
        : "--",
      share: userShares?.[0]?.userStaked
        ? BigNumber(userShares?.[0]?.userStaked ?? 0)
            .dividedBy(poolShares?.[0]?.totalShares ?? 1)
            .multipliedBy(100)
            .toFixed(2)
        : "--",
    },
  ];
  const assets = [...realAssets, ...fakeAssets];

  const totalRestaked = poolShares?.[0]?.totalShares
    ? fromDecimals(poolShares?.[0]?.totalShares ?? 0)
    : 0;

  return (
    <main className="container mx-auto p-4 pb-12 space-y-6 pt-16">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StakingSummary
            restaked={abbreviateNumber(Number(totalRestaked), 2).toString()}
            claimable={abbreviateNumber(Number(reward.amount), 2).toString()}
          />
        </div>
        <RewardDetails reward={reward} />
      </div>
      <AssetTable assets={assets} />
    </main>
  );
}
