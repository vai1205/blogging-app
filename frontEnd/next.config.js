const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "BLOGGING APP",
    API_DEVELOPMENT: "http://localhost:8000/api",
    PRODUCTION: false,
    DOMAIN_DEVELOPMENT: "http://localhost:3000",
    DOMAIN_PRODUCTION:"",
    FB_APP_ID:"368520860761335"
  }
});
