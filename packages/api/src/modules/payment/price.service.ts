import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import * as request from "request-promise";
import * as cheerio from "cheerio";
import { PaymentToken, PaymentTokenType } from "@dewo/api/models/PaymentToken";
import * as RandomUserAgent from "random-useragent";
import _ from "lodash";
import CoinGecko from "coingecko-api";

export class PriceService {
  private logger = new Logger(this.constructor.name);
  private coinGecko = new CoinGecko();

  constructor(
    @InjectRepository(PaymentToken)
    private readonly tokenRepo: Repository<PaymentToken>
  ) {}

  public async lookupERC20TokenPrice(
    address: string
  ): Promise<number | undefined> {
    const response = await this.coinGecko.simple.fetchTokenPrice({
      contract_addresses: [address],
      vs_currencies: "usd",
    });

    return response.data[address.toLowerCase()]?.usd;
  }

  public async pollCoinGecko(): Promise<void> {
    this.logger.debug("Polling for CoinGecko prices");

    const tokens = await this.tokenRepo.find({
      type: PaymentTokenType.ERC20,
      address: Not(IsNull()),
    });

    const addresses = tokens.map((t) => t.address!);
    this.logger.debug(`Token addresses to check: ${addresses.length}`);

    const chunks = _.chunk(addresses, 100);
    for (const chunk of chunks) {
      const response = await this.coinGecko.simple.fetchTokenPrice({
        contract_addresses: chunk,
        vs_currencies: "usd",
      });

      this.logger.debug(`CoinGecko respose: ${JSON.stringify(response)}`);

      const updates = tokens
        .filter((token) => !!response.data[token.address!.toLowerCase()]?.usd)
        .map(
          (token): PaymentToken => ({
            ...token,
            usdPrice: response.data[token.address!.toLowerCase()]!.usd,
          })
        );
      await this.tokenRepo.save(updates);
    }
  }

  public async pollCoinMarketCap(): Promise<void> {
    this.logger.log("Polling for CoinMarketCap prices");

    const tokens = await this.tokenRepo
      .createQueryBuilder("token")
      .andWhere(`token."config"->>'coinmarketcapUrl' IS NOT NULL`)
      .getMany();
    const coinmarketcapUrls = _(tokens)
      .map((t) => t.config!.coinmarketcapUrl)
      .uniq()
      .value();

    this.logger.log(
      `Found ${tokens.length} tokens with ${coinmarketcapUrls.length} unique price URLs to update`
    );

    for (const url of coinmarketcapUrls) {
      this.logger.debug(`Finding price: ${JSON.stringify({ url })}`);
      const $ = await request
        .get({
          url,
          gzip: true,
          headers: { "user-agent": RandomUserAgent.getRandom() },
        })
        .then(cheerio.load);
      const valueString = $(".priceValue")
        .text()
        .replace("$", "")
        .replace(/,/g, "");
      if (!valueString) continue;
      const value = Number(valueString);

      this.logger.debug(
        `Found price: ${JSON.stringify({ valueString, value })}`
      );
      if (!isNaN(value)) {
        await this.tokenRepo
          .createQueryBuilder()
          .update({ usdPrice: value })
          .andWhere(`payment_token."config"->>'coinmarketcapUrl' = :url`, {
            url,
          })
          .updateEntity(true)
          .execute();
      }
    }
  }
}
