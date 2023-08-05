import "./App.css";
import { useState } from "react";
import WalletInputs from "./components/WalletInputs";
import NativeTokens from "./components/NativeTokens";
import Tokens from "./components/Tokens";
import PortfolioValue from "./components/PortfolioValue";
import TransferHistory from "./components/TransferHistory";
import Nfts from "./components/Nfts";
import { Avatar, TabList, Tab } from "@web3uikit/core";

function App() {

	const [wallet, setWallet] = useState("");
	const [chain, setChain] = useState("0x1");
	const [nativeBalance, setNativeBalance] = useState(0);
	const [nativeValue, setNativeValue] = useState(0);
	const [tokens, setTokens] = useState([]);
	const [transfers, setTransfers] = useState([]);
	const [nfts, setNfts] = useState([]);
	const [filteredNfts, setFilteredNfts] = useState([]);


	return (
		<div className="App">
			<WalletInputs
				chain={chain}
				setChain={setChain}
				wallet={wallet}
				setWallet={setWallet}
			/>
			<div className="content">
				<PortfolioValue
					nativeValue={nativeValue}
					tokens={tokens}
				/>
				<TabList>
					<Tab tabKey={1} tabName={"Tokens"}>
						<NativeTokens
							wallet={wallet}
							chain={chain}
							nativeBalance={nativeBalance}
							setNativeBalance={setNativeBalance}
							nativeValue={nativeValue}
							setNativeValue={setNativeValue}
						/>
						<Tokens
							wallet={wallet}
							chain={chain}
							tokens={tokens}
							setTokens={setTokens}
						/>	
					</Tab>
					<Tab tabKey={2} tabName={"Transfers"}>
						<TransferHistory 
							chain={chain} 
							wallet={wallet}
							transfers={transfers}
							setTransfers={setTransfers}
						/>
					</Tab>
					<Tab tabKey={3} tabName={"NFT's"}>
						<Nfts 
							wallet={wallet} 
							chain={chain}
							nfts={nfts}
							setNfts={setNfts}
							filteredNfts={filteredNfts}
							setFilteredNfts={setFilteredNfts}
						/>
					</Tab>
				</TabList>	
			</div>
		</div>
	);
}

export default App;
