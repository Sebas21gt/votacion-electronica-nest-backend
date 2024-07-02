module.exports = {
  apps: [{
    name: "back_plataform",
    script: './main.js',
    watch: '.',
    args: "start",
    env_dev: {
      NODE_ENV: "dev",
      APP_PORT: "3000",
      DB_TYPE: "postgres",
      DB_HOST: "127.0.0.1",
      DB_PORT: "5432",
      DB_USERNAME: "postgres",
      DB_PASSWORD: "admin123",
      DB_NAME: "voting",
      JWT_ACCESS_TOKEN: "claveSecret",
      ROUNDS_SECURITY: "11",
      JWT_ACCESS_TOKEN_EXPIRATION_TIME: "28800",
      BLOCKCHAIN_NODE_URL: "https://rpc.testnet.fantom.network",
      CONTRACT_ADDRESS_VOTE: "0xB20625597cf357fe410d1e088aBCA49B22C3ef6F",
      PRIVATE_KEY_OWNER: "36e18c58d99a11bdc1fb0cf8f04096715d2d73b43f90c0eba5f83eaf77d7ae6c"
    },
    env_pro: {
      NODE_ENV: "pro",
      APP_PORT: "3000",
      DB_TYPE: "postgres",
      DB_HOST: "127.0.0.1",
      DB_PORT: "5432",
      DB_USERNAME: "postgres",
      DB_PASSWORD: "admin123",
      DB_NAME: "voting",
      JWT_ACCESS_TOKEN: "claveSecret",
      ROUNDS_SECURITY: "11",
      JWT_ACCESS_TOKEN_EXPIRATION_TIME: "28800",
      // BLOCKCHAIN_NODE_URL: "https://rpc.testnet.fantom.network",
      BLOCKCHAIN_NODE_URL: "http://127.0.0.1:8545",
      CONTRACT_ADDRESS_VOTE: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      PRIVATE_KEY_OWNER: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      // CONTRACT_ADDRESS_VOTE: "0xB20625597cf357fe410d1e088aBCA49B22C3ef6F",
      // PRIVATE_KEY_OWNER: "36e18c58d99a11bdc1fb0cf8f04096715d2d73b43f90c0eba5f83eaf77d7ae6c"
    },
  },
  ],
};
