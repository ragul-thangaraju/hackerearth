const config = (() => {
  if (process.env.NODE_ENV) {
    console.log("Environment : " + process.env.NODE_ENV);
  }
  switch (process.env.NODE_ENV) {
    case "local":
      return {
        host: "0.0.0.0",
        port: 8080,
        secret: "thisissecret",
        mongodb:
          "mongodb+srv://admin:admin@ragul.3diua.mongodb.net/Ragul?retryWrites=true&w=majority",
      };
      
    default:
      return {
        host: "0.0.0.0",
        port: 8080,
        secret: "thisissecret",
        mongodb:
          "mongodb+srv://admin:admin@ragul.3diua.mongodb.net/Ragul?retryWrites=true&w=majority",
      };
  }
})();

module.exports = {
  config: config,
};
