import { getWalletClient } from "@wagmi/core";
import axios from "axios";
import { toBytes } from "viem";
import { userOperationType } from "../types";

export type SendUserOperationArgs = {
  userOp: userOperationType;
  userOpHash: `0x${string}`;
  chainId: number;
  accountType: number;
  appId: string;
};

export type SendUserOperationResult = {
  userOpHash: `0x${string}`;
};

export async function sendUserOperation({
  userOp,
  userOpHash,
  chainId,
  accountType,
  appId,
}: SendUserOperationArgs): Promise<SendUserOperationResult> {
  const walletClient = await getWalletClient();
  if (!walletClient) throw new Error("Wallet client not found");
  const signature = await walletClient.signMessage({
    message: { raw: toBytes(userOpHash) },
  });
  const unsigned_options = {
    method: "POST",
    url: "https://api.moonchute.xyz/userop",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-app-id": appId,
    },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "mc_sendUserOp",
      params: [
        {
          userOp,
          chainId,
          signature,
          accountType,
        },
      ],
    },
  };
  const res = await axios.request(unsigned_options);
  if (res.status !== 200) {
    throw new Error(`Failed to send user operation: ${res.data}`);
  }
  return {
    userOpHash: res.data,
  };
}
