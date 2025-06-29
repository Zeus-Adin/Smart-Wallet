import { getRates } from "@/utils/getRates";
import { useEffect, useState } from "react";

export type TokenMarketData = {
	ath: number
	ath_change_percentage: number
	ath_date: string
	atl: number
	atl_change_percentage: number
	atl_date: string
	circulating_supply: number
	current_price: number
	fully_diluted_valuation: number
	high_24h: number
	id: string
	image: string
	last_updated: string
	low_24h: number
	market_cap: number
	market_cap_change_24h: number
	market_cap_change_percentage_24h: number
	market_cap_rank: number
	max_supply: number
	name: string
	price_change_24h: number
	price_change_percentage_24h: number
	roi: {
	  times: number
	  currency: string
	  percentage: number
	} | null
	symbol: string
	total_supply: number
	total_volume: number
}

export default function useGetRates(symbol?: string) {
	const [rates, setRates] = useState<{ [key: string]: TokenMarketData } | TokenMarketData>()
	const [loading, setLoading] = useState(false)

	const storageKey = `rates-cache-${symbol ? symbol : ""}`

	useEffect(() => {
		async function fetchData() {
			setLoading(true)

			const cached = localStorage.getItem(storageKey)
			const now = Date.now()

			if (cached) {
				try {
					const parsed = JSON.parse(cached)

					if(now - parsed.timestamp < 5 * 60 * 1000) {
						setRates(parsed)
						setLoading(false)
						return
					}
				} catch (error) {
					localStorage.removeItem(storageKey)
				}					
			}

			const res = await getRates(symbol)
			localStorage.setItem(storageKey, JSON.stringify({ timestamp: Date.now(), ...res }))
			
			setRates(res)
			setLoading(false)
		}
		fetchData()
	}, [symbol])

	return { rates, loading }
}
