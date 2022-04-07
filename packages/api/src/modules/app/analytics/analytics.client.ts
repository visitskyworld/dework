import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Amplitude from "@amplitude/node";
import { ConfigType } from "../config";

@Injectable()
export class AnalyticsClient {
  private logger = new Logger(this.constructor.name);
  public client?: Amplitude.NodeClient;

  constructor(readonly config: ConfigService<ConfigType>) {
    const amplitudeApiKey = config.get("AMPLITUDE_API_KEY");
    if (!!amplitudeApiKey) {
      this.client = Amplitude.init(amplitudeApiKey);
    } else {
      this.logger.warn(
        "Amplitude event logging not enabled! Set env var AMPLITUDE_API_KEY to enable."
      );
    }
  }
}
