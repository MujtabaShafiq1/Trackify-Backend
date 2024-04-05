const app = require("express")();

// utils
const appLogger = require("./utils/logger");

// startup
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

app.listen(process.env.PORT, () =>
  appLogger.info(`Server Listening on PORT: ${process.env.PORT}`)
);
