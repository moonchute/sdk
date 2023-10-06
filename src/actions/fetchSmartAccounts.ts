import axios from "axios";

export type SmartAccount = {
  address: string;
  factoryAddress: string;
  validator: string | null;
  provider: string;
};

export type FetchSmartAccountsArgs = {
  address: string;
  chainId: number;
  apikey: string | undefined;
};

export type FetchSmartAccountsResult = {
  smartAccount: SmartAccount[] | undefined;
};

export async function fetchSmartAccounts({
  address,
  chainId,
  apikey,
}: FetchSmartAccountsArgs): Promise<FetchSmartAccountsResult> {
  let smartAccount: SmartAccount[] | undefined = undefined;
  try {
    if (!apikey) {
      throw new Error("API key is required");
    }
    const { data } = await axios.get(
      `https://api.moonchute.xyz/account?address=${address}&chainId=${chainId}&apiKey=${apikey}`
    );
    smartAccount = data.smartAccount;
  } catch (err) {}

  return { smartAccount };
}
