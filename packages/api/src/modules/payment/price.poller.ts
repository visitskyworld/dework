import { Controller, Logger, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { PriceService } from "./price.service";

@Controller("prices")
export class PricePoller {
  private logger = new Logger(this.constructor.name);

  constructor(private readonly service: PriceService) {}

  @Post("update")
  public async updatePrices(@Res() res: Response) {
    await this.service
      .pollCoinGecko()
      .catch((error) =>
        this.logger.error(`Error polling CoinGecko: ${error.message}`)
      );
    await this.service
      .pollCoinMarketCap()
      .catch((error) =>
        this.logger.error(`Error polling CoinMarketCap: ${error.message}`)
      );
    res.json({ ok: true });
  }
}
