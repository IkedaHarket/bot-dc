import App from "./App";

import config from "./config";
import { Logger } from "./helpers/logger";

const logger : Logger = new Logger();

const app = new App({token: config.token, logger});

app.start();
