export class ConfigService {
	getClientConfig(walletAddress: string) {
      // Automatic detection based on address prefix
      // Mainnet: SP, SM; Testnet: ST, SN
      if (/^(ST|SN)/i.test(walletAddress)) {
         return {
            api: "https://api.testnet.hiro.so",
            chain: "testnet",
         };
      } else {
         return {
            api: "https://api.mainnet.hiro.so", // fixed mainnet endpoint
            chain: "mainnet",
         };
      }
   }
}