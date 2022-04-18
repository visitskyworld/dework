import * as Sentry from "@sentry/nextjs";
import { Constants } from "@dewo/app/util/constants";

Sentry.init({
  dsn: Constants.SENTRY_DSN,
  environment: Constants.ENVIRONMENT,
  release: `dework-app@${require("../../package.json").version}+${Date.now()}`,
  ignoreErrors: ["ResizeObserver loop limit exceeded"],
});
