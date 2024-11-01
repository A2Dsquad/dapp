import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const config = new AptosConfig({network: Network.TESTNET});
export const aptos = new Aptos(config);