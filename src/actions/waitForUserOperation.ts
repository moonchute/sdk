import { getPublicClient } from "@wagmi/core";
import axios from "axios";
import type { CallParameters } from "viem";
import { hexToString } from "viem";

const MAX_RETRIES = 6;
const BACK_OFF_BASE = 200;

export type WaitForUserOperationArgs = {
  appId: string;
  userOpHash: `0x${string}`;
  chainId: number;
  confirmations?: number;
  onReplaced?: any;
  timeout?: number;
};

export type WaitForUserOperationResult = {
  userOpReceipt: any;
  txReceipt: any;
};

type getUoReceiptArgs = {
  userOpHash: `0x${string}`;
  chainId: number;
  appId: string;
};

type getTxReceiptArgs = {
  chainId: number;
  txHash: `0x{string}`;
  confirmations?: number;
  onReplaced?: any;
  timeout?: number;
};

export async function waitForUserOperation({
  userOpHash,
  appId,
  chainId,
  confirmations = 1,
  onReplaced,
  timeout = 0,
}: WaitForUserOperationArgs): Promise<WaitForUserOperationResult> {
  const userOpReceipt = await getUoReceipt({ userOpHash, chainId, appId });
  const txReceipt = await getTxReceipt({
    chainId,
    txHash: userOpReceipt.receipt.transactionHash,
    confirmations,
    onReplaced,
    timeout,
  });
  return {
    userOpReceipt,
    txReceipt,
  };
}

async function getUoReceipt({ userOpHash, chainId, appId }: getUoReceiptArgs) {
  const options = {
    method: "POST",
    url: "http://localhost:3002/userop",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-app-id": appId,
    },
    data: {
      method: "mc_getUserOpReceipt",
      userOpHash,
      chainId,
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await axios.request(options);
      if (res.status === 200) {
        return { ...res.data };
      }
      throw new Error(`Failed to get userop receipt: ${res.data}`);
    } catch (error) {
      if (attempt === MAX_RETRIES - 1) {
        throw error;
      }
      const delay = ~~(1 << attempt) * BACK_OFF_BASE;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function getTxReceipt({
  chainId,
  txHash,
  confirmations,
  onReplaced,
  timeout,
}: getTxReceiptArgs) {
  const publicClient = getPublicClient({ chainId });

  const txReceipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations,
    onReplaced,
    timeout,
  });
  if (txReceipt.status === "reverted") {
    const txn = await publicClient.getTransaction({
      hash: txReceipt.transactionHash,
    });
    const code = (await publicClient.call({
      ...txn,
      gasPrice: txn.type !== "eip1559" ? txn.gasPrice : undefined,
      maxFeePerGas: txn.type === "eip1559" ? txn.maxFeePerGas : undefined,
      maxPriorityFeePerGas:
        txn.type === "eip1559" ? txn.maxPriorityFeePerGas : undefined,
    } as CallParameters)) as unknown as string;
    const reason = hexToString(`0x${code.substring(138)}`);
    throw new Error(reason);
  }

  return txReceipt;
}
