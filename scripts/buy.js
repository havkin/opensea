const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const MnemonicWalletSubprovider = require("@0x/subproviders").MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");

const Web3 = require('web3');


const MNEMONIC = "leopard improve wage cube hundred double vault nice laundry crawl acid start";
const NODE_API_KEY = "e4e21ad7acef4df2beb53ec965feb838";
const isInfura = true;
const FACTORY_CONTRACT_ADDRESS = "0xEA9822BDa90F6e56718dEDFAcBaD22592A2ed7c7";
const NFT_CONTRACT_ADDRESS = "0x2c9F4969BcE3107b43b4776D7B517dc4A373040C";
const OWNER_ADDRESS = "0xdBe4B155fc40680131A9660C40e9E666AF292238";
const NETWORK = "rinkeby";
const API_KEY = process.env.API_KEY || ""; // API key is optional but useful if you're doing a high volume of requests.

if (!MNEMONIC || !NODE_API_KEY || !NETWORK || !OWNER_ADDRESS) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, API key, nft contract, and factory contract address."
  );
  return;
}

if (!FACTORY_CONTRACT_ADDRESS && !NFT_CONTRACT_ADDRESS) {
  console.error("Please either set a factory or NFT contract address.");
  return;
}

const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: MNEMONIC,
  baseDerivationPath: BASE_DERIVATION_PATH,
});
const network = NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
const infuraRpcSubprovider = new RPCSubprovider({
  rpcUrl: isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY,
});

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(infuraRpcSubprovider);
providerEngine.start();

const seaport = new OpenSeaPort(
  providerEngine,
  {
    networkName: NETWORK === "mainnet" || NETWORK === "live" ? Network.Main : Network.Rinkeby,
    apiKey: API_KEY,
  },
  arg => console.log(arg)
);

async function main() {

  seaport.addListener(opensea.EventType.CancelOrder, ({ order, accountAddress }) => {
    console.info("cancel")
  })
  seaport.addListener(opensea.EventType.CreateOrder, ({ order, accountAddress }) => {
    console.info("create", { order, accountAddress })
  })


// console.log('cancel buy order');

// const order = await seaport.api.getOrder({
//   asset_contract_address: "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656",
//   token_id: "35227045098423169601976404215786444024230025373824518128793712840907841077249",
// });

// await seaport.cancelOrder({
//   accountAddress: OWNER_ADDRESS,
//   order
// });


const offer = await seaport.createBuyOrder({
  asset: {
    tokenId: "35227045098423169601976404215786444024230025373824518128793712840907841077249",
    tokenAddress: "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656",
    schemaName: "ERC1155",
  },
  accountAddress: OWNER_ADDRESS,
  // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
  startAmount: 0.02,
})

// console.log("order", offer);
  // Example: simple fixed-price sale of an item owned by a user.
  // console.log("Auctioning an item for a fixed price...");
  // const fixedPriceSellOrder = await seaport.createSellOrder({
  //   asset: {
  //     tokenId: "1",
  //     tokenAddress: NFT_CONTRACT_ADDRESS,
  //   },
  //   startAmount: 0.05,
  //   expirationTime: 0,
  //   accountAddress: OWNER_ADDRESS,
  // });
  // console.log(`Successfully created a fixed-price sell order! ${fixedPriceSellOrder.asset.openseaLink}\n`);

  // // // Example: Dutch auction.
  // console.log("Dutch auctioning an item...");
  // const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
  // const dutchAuctionSellOrder = await seaport.createSellOrder({
  //   asset: {
  //     tokenId: "2",
  //     tokenAddress: NFT_CONTRACT_ADDRESS,
  //   },
  //   startAmount: 0.05,
  //   endAmount: 0.01,
  //   expirationTime: expirationTime,
  //   accountAddress: OWNER_ADDRESS,
  // });
  // console.log(`Successfully created a dutch auction sell order! ${dutchAuctionSellOrder.asset.openseaLink}\n`);

  // // Example: English auction.
  // console.log("English auctioning an item in DAI...");
  // const wethAddress =
  //   NETWORK === "mainnet" || NETWORK === "live"
  //     ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  //     : "0xc778417e063141139fce010982780140aa0cd5ab";
  // const englishAuctionSellOrder = await seaport.createSellOrder({
  //   asset: {
  //     tokenId: "3",
  //     tokenAddress: NFT_CONTRACT_ADDRESS,
  //   },
  //   startAmount: 0.03,
  //   expirationTime: expirationTime,
  //   waitForHighestBid: true,
  //   paymentTokenAddress: wethAddress,
  //   accountAddress: OWNER_ADDRESS,
  // });
  // console.log(`Successfully created an English auction sell order! ${englishAuctionSellOrder.asset.openseaLink}\n`);
}

main();
