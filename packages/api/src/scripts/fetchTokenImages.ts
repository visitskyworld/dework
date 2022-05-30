import { Injectable, Logger, Module } from "@nestjs/common";
import { AppBootstrapModuleImports } from "../modules/app/app.module";
import { NestFactory } from "@nestjs/core";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentToken, PaymentTokenType } from "../models/PaymentToken";
import { TaskSearchModule } from "../modules/task/search/task.search.module";
import { FileUploadModule } from "../modules/fileUpload/fileUpload.module";
import { FileUploadService } from "../modules/fileUpload/fileUpload.service";
import fetch from "node-fetch";
import request from "request";
import Bluebird from "bluebird";
import { ethers } from "ethers";
import { EthereumConfig, PaymentNetwork } from "../models/PaymentNetwork";

const TokenApiURLs = {
  ETHEREUM: ["https://tokens.coingecko.com/uniswap/all.json"],
  BSC: ["https://tokens.pancakeswap.finance/pancakeswap-extended.json"],
  GNOSIS: [
    "https://unpkg.com/@1hive/default-token-list@5.17.1/build/honeyswap-default.tokenlist.json",
  ],
  POLYGON: [
    "https://unpkg.com/quickswap-default-token-list@1.0.91/build/quickswap-default.tokenlist.json",
  ],
  AVALANCHE: [
    "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json",
  ],
  FANTOM: [
    "https://raw.githubusercontent.com/Crocoswap/tokenlists/main/aeb.tokenlist.json",
  ],
  ARBITRUM: ["https://bridge.arbitrum.io/token-list-42161.json"],
  CELO: [
    "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json",
  ],
  HARMONY: [
    "https://raw.githubusercontent.com/DefiKingdoms/community-token-list/main/src/defikingdoms-default.tokenlist.json",
    "https://raw.githubusercontent.com/DefiKingdoms/community-token-list/main/build/defikingdoms-community.tokenlist.json",
  ],
  OPTIMISM: ["https://static.optimism.io/optimism.tokenlist.json"],
  MOONRIVER: ["https://tokens.coingecko.com/moonriver/all.json"],
  METIS: ["https://tokens.coingecko.com/metis-andromeda/all.json"],
  CRONOS: ["https://tokens.coingecko.com/cronos/all.json"],
  BOBA: ["https://tokens.coingecko.com/boba/all.json"],
};
interface TokenData {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
  }[];
}

@Injectable()
export class FetchTokenService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(PaymentToken)
    private readonly tokenRepo: Repository<PaymentToken>,
    @InjectRepository(PaymentNetwork)
    private readonly networkRepo: Repository<PaymentNetwork>,
    private readonly fileUploadService: FileUploadService
  ) {}

  private exists(url: string): Promise<boolean> {
    return new Promise((res) =>
      request(url, (error, response) => {
        if (error || response.statusCode === 404) res(false);
        else res(true);
      })
    );
  }

  private async getImageUrl(
    token: TokenData["tokens"][number],
    network: PaymentNetwork
  ): Promise<string | undefined> {
    const imageUrls = [
      token.logoURI,
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
        network.name.split("-")[0]
      }/assets/${token.address}/logo.png`,
    ].filter((t): t is string => !!t);

    for (const imageUrl of imageUrls) {
      const exists = await this.exists(imageUrl);
      this.logger.debug(
        `Checking image url: ${JSON.stringify({ token, imageUrl, exists })}`
      );
      if (exists) {
        return this.fileUploadService.uploadFileFromUrl(imageUrl, "tokens");
      }
    }

    return undefined;
  }

  public async run() {
    const networks = await this.networkRepo.find();
    const tokens = await this.tokenRepo.find();

    const urls = Object.values(TokenApiURLs).flat();
    for (const url of urls) {
      const data = await fetch(url).then(
        (res): Promise<TokenData> => res.json()
      );

      await Bluebird.map(
        data.tokens,
        async (token, index) => {
          const address = ethers.utils.getAddress(token.address);
          this.logger.log(
            `Processing token: ${JSON.stringify({
              token: [index + 1, data.tokens.length].join("/"),
              url: [urls.indexOf(url) + 1, urls.length].join("/"),
            })}`
          );

          const network = networks.find(
            (n) => (n.config as EthereumConfig).chainId === token.chainId
          );
          if (!network) {
            this.logger.warn(`Network with chain ${token.chainId} not found`);
            return;
          }

          const existing = tokens.find(
            (t) =>
              t.type === PaymentTokenType.ERC20 &&
              t.address === address &&
              t.networkId === network?.id
          );

          if (!!existing?.imageUrl) return;

          const imageUrl = await this.getImageUrl(token, network).catch(
            () => existing?.imageUrl
          );
          this.logger.log(
            `Saving token: ${JSON.stringify({
              exists: !!existing,
              token,
              imageUrl,
            })}`
          );
          await this.tokenRepo.save({
            ...existing,
            type: PaymentTokenType.ERC20,
            address,
            networkId: network.id,
            name: token.name,
            symbol: token.symbol,
            exp: token.decimals,
            imageUrl,
          });
        },
        { concurrency: 40 }
      );
    }
  }
}

@Module({
  imports: [
    ...AppBootstrapModuleImports!,
    TaskSearchModule,
    FileUploadModule,
    TypeOrmModule.forFeature([PaymentToken, PaymentNetwork]),
  ],
  providers: [FetchTokenService],
})
export class FetchTokenModule {}

async function run() {
  const app = await NestFactory.create(FetchTokenModule);
  await app.init();
  const service = app.get(FetchTokenService);
  await service.run();
  await app.close();
  process.exit(0);
}

run();
