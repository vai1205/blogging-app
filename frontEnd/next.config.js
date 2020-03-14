const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "BLOGGING APP",
    API_DEVELOPMENT: "http://localhost:8000/api",
    PRODUCTION: false
  }
});
