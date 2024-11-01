"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import type { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { useToast } from "@/components/ui/use-toast";

import { useAutoConnect } from "./auto-connect-provider";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const { autoConnect } = useAutoConnect();
  const { toast } = useToast();

  const wallets = [
    new BitgetWallet(),
    new FewchaWallet(),
    new MartianWallet(),
    new MSafeWalletAdapter(),
    new PontemWallet(),
    new TrustWallet(),
    new OKXWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={autoConnect}
      dappConfig={{
        network: Network.TESTNET,
        aptosApiKey: process.env.NEXT_PUBLIC_APTOS_API_KEY,
        aptosConnect: { dappId: "57fa42a9-29c6-4f1e-939c-4eefa36d9ff5" },
        mizuwallet: {
          manifestURL:
            "https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json",
        },
      }}
      onError={(error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
