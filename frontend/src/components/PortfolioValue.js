import React from "react";
import { useState, useEffect } from "react";

function PortfolioValue({ tokens, nativeValue, chain }) {
	const [totalValue, setTotalValue] = useState(0);

	useEffect(() => {
		let val = Number(nativeValue);
		if (chain === "0x1") {
			for (let i = 0; i < tokens.length; i++) {
				val = val + Number(tokens[i].val);
			}
		}

		setTotalValue(val.toFixed(2));
	}, [nativeValue, tokens, chain]);

	return (
		<>
			<h1>Portfolio Total Value</h1>
			<p>
				<span>Total Balance: ${totalValue}</span>
			</p>
		</>
	);
}

export default PortfolioValue;