const app = require("./app");
const env = require("./config/env");

const port = env.port;

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
