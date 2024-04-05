require("dotenv").config();
const { configSchema } = require("../utils/validations/config-schema");

module.exports = () => {
  const { PORT, JWT_KEY } = process.env;
  const { error } = configSchema.validate({ PORT, JWT_KEY });

  if (error) {
    throw new Error(`Config Error: ${error.details.map((i) => i.message).join(", ")}`);
  }
};
