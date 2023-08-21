const Moralis = require("moralis").default;
const express = require("express")
const cors = require("cors")
const app = express()
const fs = require("fs");
const axios = require("axios");
const csvParser = require("csv-parser");
const port = 8080
const { Web3 } = require("web3");
require("dotenv").config();
app.use(cors())
Moralis.start({ "apiKey": getAPIKey() });

let web3Chains = new Map();


app.get("/", (req, res) => {
	res.send("If you are seeing this message, then it means that the backend NodeJS server is up and running.<br>Please wait for some time while the frontend ReactJS server boots up...")
});

app.get("/api/test", (req, res) => {
	res.send("Hello World! : " + process.env.BACKEND_API_URL)
});

app.listen(port, () => {
	initializeWeb3Chains();
	console.log(`Example app listening on port ${port}`)
});


app.get("/api/getAvailableChains", async (req, res) => {
	res.send("NOT IMPLEMENTED YET...");
});


app.get("/api/v2/nativeBalance", async (req, res) => {

	try {
		const response_getBalance = await web3Chains.get(chain).web3.eth.getBalance(address);
		console.log("response_getBalance : " + response_getBalance);

		const response_coinloreTicker = await axios.get(
			"https://api.coinlore.net/api/ticker/?id=" + web3Chains.get(chain).coinloreID);
		console.log("response_coinloreTicker : " + JSON.stringify(response_coinloreTicker.data));
		const response_coinloreTickerUSD = response_coinloreTicker.data[0].price_usd;

		response = {
			"balance": Number(response_getBalance),
			"usd": response_coinloreTickerUSD
		};

		res.send(response);
	} catch (e) {
		console.log(e);
		res.send(e);
	}
});


app.get("/api/tokenBalances", async (req, res) => {

	try {
		const { address, chain } = req.query;

		const response_getWalletTokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
			"address": address,
			"chain": chain
		});
		console.log(response_getWalletTokenBalances);

		let tokens = response_getWalletTokenBalances.raw;
		let legitTokens = [];
		for (let i = 0; i < tokens.length; i++) {
			try {
				if (isMoralisAPILimitReached(i)) {
					break;
				}
				const response_getTokenPrice = await Moralis.EvmApi.token.getTokenPrice({
					address: tokens[i].token_address,
					chain: chain,
				});
				console.log(response_getTokenPrice);
				if (response_getTokenPrice.raw.usdPrice > 0.01) {
					tokens[i].usd = response_getTokenPrice.raw.usdPrice;
					legitTokens.push(tokens[i]);
				} else {
					console.log("Shit Coin");
				}
			} catch (e) {
				console.log(e);
			}
		}
		res.send(legitTokens);
	} catch (e) {
		console.log(e);
		res.send(e);
	}
});


app.get("/api/tokenTransfers", async (req, res) => {

	try {
		const { address, chain } = req.query;

		const response_getWalletTokenTransfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
			"address": address,
			"chain": chain
		});
		console.log(response_getWalletTokenTransfers);

		const userTrans = response_getWalletTokenTransfers.raw.result;

		let userTransDetails = [];
    
		for (let i = 0; i < userTrans.length; i++) {
			try {
				if (isMoralisAPILimitReached(i)) {
					break;
				}
				const response_getTokenMetadata = await Moralis.EvmApi.token.getTokenMetadata({
					addresses: [userTrans[i].address],
					chain: chain,
				});
				console.log(response_getTokenMetadata);
				if (response_getTokenMetadata.raw) {
					userTrans[i].decimals = response_getTokenMetadata.raw[0].decimals;
					userTrans[i].symbol = response_getTokenMetadata.raw[0].symbol;
					userTransDetails.push(userTrans[i]);
				} else {
					console.log("No details for coin");
				}
			} catch (e) {
				console.log(e);
			}
		}

		res.send(userTransDetails);
	} catch (e) {
		console.log(e);
		res.send(e);
	}
});


app.get("/api/nftBalance", async (req, res) => {
  
	try {
		const { address, chain } = req.query;

		const response_getWalletNFTs = await Moralis.EvmApi.nft.getWalletNFTs({
			address: address,
			chain: chain,
		});
		console.log(response_getWalletNFTs);
		const userNFTs = response_getWalletNFTs.raw;

		res.send(userNFTs);
	} catch (e) {
		console.log(e);
		res.send(e);
	}
});  


function getAPIKey() {
	const listOfAPIKeys = process.env.MORALIS_API_KEY.split(",");
	return listOfAPIKeys[Math.floor(new Date().getHours() / 6)]
}

function isMoralisAPILimitReached(i) {
	return i >= process.env.MORALIS_API_CALL_LIMIT;
}

function initializeWeb3Chains() {
	let csvData;
	try {
		csvData = fs.readFileSync("./resources/web3_chains.csv").toString().split("\n");
	} catch (e) {
		console.log(e);
	}
	console.log(csvData);

	for (let i = 0; i < csvData.length; i++) {
		if (!csvData[i]) {
			continue;
		}
		const chain = csvData[i].trim().split(",");
		let chainMap = {};
		chainMap.name = chain[0];
		chainMap.chainID = chain[1];
		chainMap.coinloreID = chain[2];
		chainMap.rpcURL = chain[3];
		chainMap.explorerURL = chain[4];
		try {
		chainMap.web3 = new Web3(new Web3.providers.HttpProvider(chainMap.rpcURL));
		} catch (Error) {
			console.log("ERROR : While setting up Web3 Object : " + chainMap.name + " : " + Error);
			continue;
		}
		web3Chains.set(chainMap.chainID, chainMap);
	}	
}


// ######################## DEPRECATED APIs ##########################


app.get("/api/v1/nativeBalance", async (req, res) => {
	console.log("DEPRECATED API!!!");
	
	try {
		const { address, chain } = req.query;
		console.log("userAddress = " + address + " : chain = " + chain);

		const response_getNativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
			"address": address,
			"chain": chain
		});
		console.log(response_getNativeBalance);

		const balance = response_getNativeBalance.raw;

		let nativeCurrency;
		let makeGetTokenPriceCall = true;
		if (chain === "0x1") {
			nativeCurrency = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
		} else if (chain === "0x89") {
			nativeCurrency = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
		} else if (chain === "0xaa36a7") {
			makeGetTokenPriceCall = false;
			balance.usd = 1;
		} else if (chain === "0x5") {
			makeGetTokenPriceCall = false;
			balance.usd = 1;
		}

		let response_getTokenPrice;
		if (makeGetTokenPriceCall) {
			response_getTokenPrice = await Moralis.EvmApi.token.getTokenPrice({
				address: nativeCurrency,
				chain: chain
			});
			console.log(response_getTokenPrice);
			balance.usd = response_getTokenPrice.raw.usdPrice;
		}

		res.send(balance);
	} catch (e) {
		console.log(e);
		res.send(e);
	}
});
