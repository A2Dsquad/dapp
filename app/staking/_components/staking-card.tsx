"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NumericInput } from "@/components/ui/numeric-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBalance } from "@/hooks/use-balance";
import { useStake } from "@/hooks/use-stake";
import { toCurrency, toDecimals } from "@/lib/number";
import BigNumber from "bignumber.js";
import { usePoolStakedAmount } from "@/hooks/use-pool-staked-amount";
import { fromDecimals } from "@/lib/number";
import { useUnstake } from "@/hooks/use-unstake";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { usePoolShares } from "@/hooks/use-pool-shares";
import { TxSuccessDialog } from "@/components/ui/tx-success-dialog";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { TxFailedDialog } from "@/components/ui/tx-failed-dialog";

interface StakingCardProps {
  assetName: string;
  assetIcon: string;
  tokenAddress: string;
}

const formSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val);
      return !Number.isNaN(num) && num > 0;
    },
    {
      message: "Please enter a valid positive number",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function StakingCard({
  assetName,
  assetIcon,
  tokenAddress,
}: StakingCardProps) {
  const { account } = useWallet();

  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [error, setError] = useState<Error | undefined>();
  const router = useRouter();
  const { data: balance = "0" } = useBalance(tokenAddress);
  const { data: stakedAmount = 0 } = usePoolStakedAmount(tokenAddress);
  const { data: poolShares = [] } = usePoolShares();

  const stakeMutation = useStake(tokenAddress);
  const unstakeMutation = useUnstake(tokenAddress);

  const unstakeTimes =
    typeof window !== "undefined"
      ? localStorage.getItem("unstake-time")?.split(",")
      : null;

  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const unstakeWithdrawalTimes = unstakeTimes
    ? unstakeTimes.map(
        (unstakeTime) =>
          new Date(Number.parseInt(unstakeTime)).getTime() + sevenDays
      )
    : null;
  const now = new Date().getTime();

  const stakedAmountFormatted = fromDecimals(stakedAmount ?? 0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const inputAmount = form.watch("amount");

  const handlePercentageClick = (percentage: number) => {
    let maxAmount = 0;
    if (mode === "withdraw") {
      maxAmount = Number.parseFloat(stakedAmountFormatted.replace(/,/g, ""));
    } else {
      maxAmount = Number.parseFloat(balance.replace(/,/g, ""));
    }

    const newAmount = BigNumber(maxAmount)
      .multipliedBy(percentage)
      .dividedBy(100)
      .toString();
    form.setValue("amount", newAmount.toString());
  };

  const onSubmit = async (data: FormValues) => {
    const amountInDecimal = toDecimals(data.amount);
    try {
      if (mode === "deposit") {
        await stakeMutation.mutateAsync(amountInDecimal);
      } else {
        await unstakeMutation.mutateAsync(amountInDecimal);
      }
    } catch (err) {
      setError(err as Error);
    }
  };

  const isDisabled =
    mode === "withdraw"
      ? stakedAmount === 0 || !inputAmount
      : !balance || !inputAmount;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="-ml-2 flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <img src={assetIcon} alt={assetName} />
            </Avatar>
            <CardTitle className="text-lg font-medium">{assetName}</CardTitle>
          </div>
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <Button
            variant={mode === "deposit" ? "default" : "ghost"}
            onClick={() => setMode("deposit")}
            size="sm"
            className="w-full md:w-auto"
          >
            Restake
          </Button>
          <Button
            variant={mode === "withdraw" ? "default" : "ghost"}
            onClick={() => setMode("withdraw")}
            size="sm"
            className="w-full md:w-auto"
          >
            Unstake
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">
                You are {mode === "deposit" ? "restaking" : "unstaking"}
              </p>

              <div className="flex flex-row w-full justify-between">
                <p className="text-sm font-light mb-3">
                  TVL:{" "}
                  <span className="font-semibold">
                    {toCurrency(
                      fromDecimals(poolShares?.at(0)?.totalShares ?? 0),
                      {
                        suffix: " " + assetName,
                        decimals: 2,
                      }
                    )}
                  </span>
                </p>
                <p className="text-sm font-light mb-3">
                  You restaked:{" "}
                  <span className="font-semibold">
                    {toCurrency(fromDecimals(stakedAmount), {
                      suffix: " " + assetName,
                    })}{" "}
                    (
                    {BigNumber(stakedAmount)
                      .dividedBy(poolShares?.[0]?.totalShares ?? 1)
                      .multipliedBy(100)
                      .toFixed(2)}{" "}
                    %)
                  </span>
                </p>
              </div>
              <div className="bg-secondary p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumericInput
                          {...field}
                          className="text-4xl font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                          placeholder="000.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    {mode === "deposit" ? balance : stakedAmountFormatted}{" "}
                    {assetName}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(25)}
                    >
                      25%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(50)}
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(100)}
                    >
                      Max
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isDirty || isDisabled || !account}
              loading={stakeMutation.isLoading || unstakeMutation.isLoading}
            >
              {mode === "deposit" ? "Restake" : "Unstake"}
            </Button>
          </form>
        </Form>
        {mode === "withdraw" &&
          account &&
          unstakeTimes &&
          unstakeWithdrawalTimes && (
            <Alert className="mt-10">
              <AlertTitle className="flex items-center">
                <Terminal className="h-6 w-6 mr-2" />
                Unstake in queue
              </AlertTitle>
              <AlertDescription>
                <p className="mb-2 mt-2">
                  Your unstake requests (withdrawable after 7 days):
                </p>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request time</TableHead>
                      <TableHead>Claim time</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unstakeTimes.map((unstakeTime, index) => (
                      <TableRow key={index.toString()}>
                        <TableCell>
                          {new Date(+unstakeTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            +unstakeWithdrawalTimes[index]
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                            disabled
                            className="ml-auto"
                            onClick={() => {
                              toast.info("Coming soon");
                            }}
                          >
                            {unstakeWithdrawalTimes[index] > now
                              ? "Pending"
                              : "Ready"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AlertDescription>
            </Alert>
          )}
        <TxSuccessDialog
          open={stakeMutation.data || unstakeMutation.data}
          txLink={`https://explorer.aptoslabs.com/txn/${
            stakeMutation.data?.hash || unstakeMutation.data?.hash
          }?network=testnet`}
          onOpenChange={() => {
            stakeMutation.reset();
            unstakeMutation.reset();
          }}
        />
        <TxFailedDialog
          open={error !== undefined}
          error={error as any}
          onOpenChange={() => {
            setError(undefined);
            stakeMutation.reset();
            unstakeMutation.reset();
          }}
        />
      </CardContent>
    </Card>
  );
}
