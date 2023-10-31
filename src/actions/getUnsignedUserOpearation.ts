import axios from "axios";
import type { Address } from "viem";
import { userOperationType } from "../types";

export type GetUnsignedUserOperationArgs = {
  account?: Address;
  owner?: Address;
  chainId: number;
  apikey: string;
  to: Address;
  value: string;
  data: `0x${string}`;
  isPaymaster: boolean;
};

export type GetUnsignedUserOperationResult = {
  userOpHash: `0x${string}`;
  accountType: number;
  userOp: userOperationType;
  chainId: number;
};

export async function getUnsignedUserOperation({
  account,
  owner,
  chainId,
  apikey,
  to,
  value,
  data,
  isPaymaster = true,
}: GetUnsignedUserOperationArgs): Promise<GetUnsignedUserOperationResult> {
  const unsigned_options = {
    method: "POST",
    url: "https://api.moonchute.xyz/userop",
    headers: { accept: "application/json", "content-type": "application/json" },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "mc_getUnsignedUserOp",
      params: [
        {
          account,
          owner,
          chainId,
          to,
          value,
          data,
          isPaymaster,
        },
      ],
    },
  };
  const res = await axios.request(unsigned_options);
  if (res.status !== 200) {
    throw new Error(`Failed to get unsigned user operation: ${res.data}`);
  }
  return res.data;
}
