import { createSurfClient } from '@thalalabs/surf';
import { Aptos, Network, AptosConfig } from '@aptos-labs/ts-sdk';

export const surfClient = createSurfClient(
  new Aptos(new AptosConfig({ network: Network.TESTNET }))
)
