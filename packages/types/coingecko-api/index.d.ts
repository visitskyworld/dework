declare module "coingecko-api" {
  class CoinGecko {
    public static API_VERSION: string;
    public static REQUESTS_PER_SECOND: number;
    public static ORDER: object;
    public static STATUS_UPDATE_CATEGORY: object;
    public static STATUS_UPDATE_PROJECT_TYPE: object;
    public static EVENT_TYPE: object;
    public static TIMEOUT: number;

    simple: {
      fetchTokenPrice<
        TAddress extends string,
        TCurrency extends string
      >(payload: {
        contract_addresses: TAddress[];
        vs_currencies?: TCurrency;
      }): Promise<{
        success: boolean;
        message: string;
        code: number;
        data: Partial<Record<TAddress, Record<TCurrency, number>>>;
      }>;
    };
  }

  export default CoinGecko;
}
