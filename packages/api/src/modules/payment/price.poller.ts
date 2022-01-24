import { Controller, Injectable, Logger, Post, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import * as request from "request-promise";
import * as cheerio from "cheerio";
import { ConfigType } from "../app/config";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import * as RandomUserAgent from "random-useragent";
import _ from "lodash";
import { Interval } from "@nestjs/schedule";
import { Response } from "express";

@Controller("prices")
@Injectable()
export class PricePoller {
  // implements OnModuleInit {
  private logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(PaymentToken)
    private readonly tokenRepo: Repository<PaymentToken>,
    readonly config: ConfigService<ConfigType>
  ) {}

  // async onModuleInit() {
  //   await this.poll();
  // }

  @Post("update")
  public async updatePrices(@Res() res: Response) {
    await this.poll();
    res.json({ ok: true });
  }

  @Interval(1 * 60 * 60 * 1000)
  async cron() {
    await this.poll();
  }

  public async poll(): Promise<void> {
    this.logger.log("Polling for prices");

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
