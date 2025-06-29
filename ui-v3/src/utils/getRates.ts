/* eslint-disable @typescript-eslint/no-explicit-any */
import { TokenMarketData } from "@/hooks/useGetRates";
import axios from "axios";

export async function getRates(symbol?: string) {
	const response = (await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')).data
	const formattedData: { [key: string]: TokenMarketData } = response.reduce((acc: any, item: any) => {
		if (!acc || !item) return
		acc[item.symbol] = item;
		return acc;
	}, {});

	if (formattedData) {
		if (symbol) return formattedData[symbol]
		return formattedData
	} else return {}
}
