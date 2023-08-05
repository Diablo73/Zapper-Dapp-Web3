import React from "react";
import "../App.css";
import {Input, Select, CryptoLogos, Avatar} from "@web3uikit/core"

function WalletInputs({chain, wallet, setChain, setWallet}) {

	function getChains() {
		if (wallet == "") {
			setWallet("0x165CD37b4C644C2921454429E7F9358d18A45e14");
		}
		return [{
			id: "eth",
			label: "Ethereum",
			value: "0x1",
			prefix: <CryptoLogos chain="ethereum"/>
		},
		{
			id: "matic",
			label: "Polygon",
			value: "0x89",
			prefix: <CryptoLogos chain="polygon"/>
		},
		{
			id: "sep",
			label: "Sepolia",
			value: "0xaa36a7",
			prefix: <Avatar
				avatarBackground="#eeaaee"
				isRounded
				text="SE"
				theme="letters"
			/>
		},
		{
			id: "eth",
			label: "Goerli",
			value: "0x5",
			prefix: <Avatar
				avatarBackground="#2288dd"
				isRounded
				text="GO"
				theme="letters"
			/>
		},
		{
			id: "eth",
			label: "Fantom",
			value: "0xfa",
			prefix: <CryptoLogos chain="fantom"/>
		},
		{
			id: "eth",
			label: "Cronos",
			value: "0x19",
			prefix: <CryptoLogos chain="cronos"/>
		}
	];
	}


	return (
		<>
			<div className="header">
				<div className="title">
					<svg width="40" height="40" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="logo_exterior" d="M500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500C388.071 500 500 388.071 500 250Z" fill="#784FFE"></path><path id="logo_interior" fill-rule="evenodd" clip-rule="evenodd" d="M154.338 187.869L330.605 187L288.404 250.6L388 250.118L345.792 312.652L168.382 313.787L211.25 250.633L112 250.595L154.338 187.869Z" fill="white"></path></svg>
					<h1>Zapper</h1>
				</div>

				<div className="walletInputs">
					<Input
						id="Wallet"
						label="Wallet Address"
						labelBgColor="rgb(33, 33, 38)"
						value={wallet}
						style={{height: "50px"}}
						width="480px"
						autoFocus="true"
						onChange={(e) => setWallet(e.target.value)}
					/>
					<Select
						defaultOptionIndex={0}
						id="Chain"
						onChange={(e) => setChain(e.value)}
						options={
							getChains()
						}
					/>
				</div>
			</div>
		</>
	);
}

export default WalletInputs;