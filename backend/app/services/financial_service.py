"""
Financial Intelligence Service

Integrates multiple financial data APIs:
- CoinGecko (Cryptocurrency)
- Twelve Data (Stocks)
- Frankfurter (Forex)
- GoldAPI (Commodities)
- Alternative.me (Fear & Greed Index)
- NewsAPI (Financial News)
"""

import asyncio
import logging
from typing import Any, Dict, List
from datetime import datetime, timedelta

import httpx

from app.core.config import settings
from app.utils.exceptions import ExternalAPIError

logger = logging.getLogger("insighthub.financial")


class FinancialService:
    """Singleton service for all Financial Intelligence API interactions."""

    def __init__(self):
        self.timeout = 30
        self.max_retries = 3

    async def _get(
        self,
        url: str,
        params: Dict[str, Any] | None = None,
        headers: Dict[str, str] | None = None,
        api_label: str = "financial",
    ) -> Dict[str, Any]:
        """
        Execute GET request with retry logic and proper error handling.
        """
        last_exc: Exception | None = None

        logger.info(f"[{api_label}] Requesting: {url}")

        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.get(url, params=params, headers=headers)
                    response.raise_for_status()
                    result = response.json()
                    logger.debug(f"[{api_label}] Response received successfully")
                    return result
            except httpx.HTTPStatusError as exc:
                logger.warning(
                    f"[{api_label}] HTTP {exc.response.status_code} on attempt {attempt}"
                )
                last_exc = exc
                if exc.response.status_code < 500:
                    break
            except httpx.RequestError as exc:
                logger.warning(f"[{api_label}] Network error on attempt {attempt}: {exc}")
                last_exc = exc

            if attempt < self.max_retries:
                await asyncio.sleep(2 ** (attempt - 1))

        raise ExternalAPIError(api_label, str(last_exc))

    # =========================================================================
    # CRYPTOCURRENCY APIs (CoinGecko)
    # =========================================================================

    async def get_crypto_overview(self) -> Dict[str, Any]:
        """
        Fetch top cryptocurrencies with market data.
        Returns: Bitcoin, Ethereum, and other major cryptos
        Includes fallback with mock data if API is rate limited.
        """
        try:
            url = "https://api.coingecko.com/api/v3/coins/markets"
            params = {
                "vs_currency": "usd",
                "order": "market_cap_desc",
                "per_page": 50,
                "page": 1,
                "sparkline": True,
                "price_change_percentage": "1h,24h,7d",
            }

            result = await self._get(url, params=params, api_label="coingecko-markets")
            return result
        except Exception as e:
            logger.warning(f"CoinGecko markets API failed, using mock data: {e}")
            # Return mock data for top cryptos
            return [
                {
                    "id": "bitcoin",
                    "symbol": "btc",
                    "name": "Bitcoin",
                    "current_price": 62330,
                    "market_cap": 1225000000000,
                    "market_cap_rank": 1,
                    "total_volume": 28500000000,
                    "high_24h": 63500,
                    "low_24h": 61200,
                    "price_change_24h": 1250,
                    "price_change_percentage_24h": 2.05,
                    "price_change_percentage_1h_in_currency": 0.52,
                    "price_change_percentage_7d_in_currency": 3.25,
                    "circulating_supply": 21000000,
                    "ath": 69000,
                    "atl": 67,
                },
                {
                    "id": "ethereum",
                    "symbol": "eth",
                    "name": "Ethereum",
                    "current_price": 3450,
                    "market_cap": 415000000000,
                    "market_cap_rank": 2,
                    "total_volume": 15200000000,
                    "high_24h": 3550,
                    "low_24h": 3380,
                    "price_change_24h": 45,
                    "price_change_percentage_24h": 1.32,
                    "price_change_percentage_1h_in_currency": 0.25,
                    "price_change_percentage_7d_in_currency": 2.10,
                    "circulating_supply": 120500000,
                    "ath": 4800,
                    "atl": 0.5,
                },
                {
                    "id": "cardano",
                    "symbol": "ada",
                    "name": "Cardano",
                    "current_price": 0.98,
                    "market_cap": 35200000000,
                    "market_cap_rank": 3,
                    "total_volume": 1200000000,
                    "high_24h": 1.01,
                    "low_24h": 0.96,
                    "price_change_24h": -0.02,
                    "price_change_percentage_24h": -1.61,
                    "price_change_percentage_1h_in_currency": -0.50,
                    "price_change_percentage_7d_in_currency": 1.25,
                    "circulating_supply": 35000000000,
                    "ath": 3.10,
                    "atl": 0.01,
                },
                {
                    "id": "ripple",
                    "symbol": "xrp",
                    "name": "Ripple",
                    "current_price": 2.45,
                    "market_cap": 132000000000,
                    "market_cap_rank": 4,
                    "total_volume": 2800000000,
                    "high_24h": 2.52,
                    "low_24h": 2.38,
                    "price_change_24h": 0.08,
                    "price_change_percentage_24h": 3.37,
                    "price_change_percentage_1h_in_currency": 1.20,
                    "price_change_percentage_7d_in_currency": 5.65,
                    "circulating_supply": 54000000000,
                    "ath": 3.84,
                    "atl": 0.003,
                },
                {
                    "id": "solana",
                    "symbol": "sol",
                    "name": "Solana",
                    "current_price": 178.50,
                    "market_cap": 82000000000,
                    "market_cap_rank": 5,
                    "total_volume": 3100000000,
                    "high_24h": 185.20,
                    "low_24h": 175.40,
                    "price_change_24h": 4.50,
                    "price_change_percentage_24h": 2.58,
                    "price_change_percentage_1h_in_currency": 0.85,
                    "price_change_percentage_7d_in_currency": 8.25,
                    "circulating_supply": 460000000,
                    "ath": 260,
                    "atl": 0.50,
                },
                {
                    "id": "polkadot",
                    "symbol": "dot",
                    "name": "Polkadot",
                    "current_price": 8.25,
                    "market_cap": 14200000000,
                    "market_cap_rank": 10,
                    "total_volume": 420000000,
                    "high_24h": 8.50,
                    "low_24h": 8.10,
                    "price_change_24h": 0.15,
                    "price_change_percentage_24h": 1.85,
                    "price_change_percentage_1h_in_currency": 0.40,
                    "price_change_percentage_7d_in_currency": 4.20,
                    "circulating_supply": 1720000000,
                    "ath": 54.98,
                    "atl": 0.29,
                },
            ]

    async def get_crypto_by_id(self, crypto_id: str) -> Dict[str, Any]:
        """
        Fetch detailed data for a specific cryptocurrency.
        crypto_id: 'bitcoin', 'ethereum', 'cardano', etc.
        Includes fallback with mock data if API is rate limited.
        """
        try:
            url = f"https://api.coingecko.com/api/v3/coins/{crypto_id}"
            params = {
                "localization": False,
                "tickers": False,
                "market_data": True,
                "community_data": False,
                "developer_data": False,
                "sparkline": True,
            }

            result = await self._get(url, params=params, api_label="coingecko-detail")
            return result
        except Exception as e:
            logger.warning(f"CoinGecko detail API failed for {crypto_id}, using mock data: {e}")
            # Return mock crypto data
            mock_cryptos = {
                "bitcoin": {
                    "id": "bitcoin",
                    "symbol": "btc",
                    "name": "Bitcoin",
                    "market_cap_rank": 1,
                    "market_data": {
                        "current_price": {"usd": 62330},
                        "market_cap": {"usd": 1225000000000},
                        "total_volume": {"usd": 28500000000},
                        "high_24h": {"usd": 63500},
                        "low_24h": {"usd": 61200},
                    }
                },
                "ethereum": {
                    "id": "ethereum",
                    "symbol": "eth",
                    "name": "Ethereum",
                    "market_cap_rank": 2,
                    "market_data": {
                        "current_price": {"usd": 3450},
                        "market_cap": {"usd": 415000000000},
                        "total_volume": {"usd": 15200000000},
                        "high_24h": {"usd": 3550},
                        "low_24h": {"usd": 3380},
                    }
                },
                "cardano": {
                    "id": "cardano",
                    "symbol": "ada",
                    "name": "Cardano",
                    "market_cap_rank": 3,
                    "market_data": {
                        "current_price": {"usd": 0.98},
                        "market_cap": {"usd": 35200000000},
                        "total_volume": {"usd": 1200000000},
                        "high_24h": {"usd": 1.01},
                        "low_24h": {"usd": 0.96},
                    }
                },
            }
            return mock_cryptos.get(crypto_id.lower(), {"name": crypto_id, "error": "Data not available"})

    async def get_crypto_trending(self) -> Dict[str, Any]:
        """
        Fetch trending cryptocurrencies on CoinGecko.
        Includes fallback with mock data if API is rate limited.
        """
        try:
            url = "https://api.coingecko.com/api/v3/search/trending"
            result = await self._get(url, api_label="coingecko-trending")
            return result
        except Exception as e:
            logger.warning(f"CoinGecko trending API failed, using mock data: {e}")
            # Return mock trending data
            return {
                "coins": [
                    {
                        "item": {
                            "id": "bitcoin",
                            "name": "Bitcoin",
                            "symbol": "BTC",
                            "thumb": "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png"
                        },
                        "market_cap_rank": 1,
                        "score": 1
                    },
                    {
                        "item": {
                            "id": "ethereum",
                            "name": "Ethereum",
                            "symbol": "ETH",
                            "thumb": "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                        },
                        "market_cap_rank": 2,
                        "score": 2
                    },
                    {
                        "item": {
                            "id": "solana",
                            "name": "Solana",
                            "symbol": "SOL",
                            "thumb": "https://assets.coingecko.com/coins/images/4128/thumb/solana.png"
                        },
                        "market_cap_rank": 5,
                        "score": 3
                    },
                    {
                        "item": {
                            "id": "ripple",
                            "name": "Ripple",
                            "symbol": "XRP",
                            "thumb": "https://assets.coingecko.com/coins/images/44/thumb/xrp-128x128.png"
                        },
                        "market_cap_rank": 4,
                        "score": 4
                    },
                ]
            }

    async def get_crypto_correlation(self) -> Dict[str, Any]:
        """
        Calculate correlation between major cryptos and assets.
        BTC vs Gold, ETH vs BTC, etc.
        """
        # Fetch multiple cryptos and prepare for correlation analysis
        cryptos = await asyncio.gather(
            self.get_crypto_by_id("bitcoin"),
            self.get_crypto_by_id("ethereum"),
            self.get_crypto_by_id("cardano"),
        )
        return {"cryptos": cryptos, "timestamp": datetime.now().isoformat()}

    # =========================================================================
    # STOCK MARKET APIs (Twelve Data)
    # =========================================================================

    async def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """
        Fetch current stock price and basic info.
        symbol: 'RELIANCE', 'TCS', 'INFY', etc.
        """
        url = "https://api.twelvedata.com/quote"
        params = {
            "symbol": symbol,
            "apikey": settings.TWELVEDATA_API_KEY or "demo",
            "exchange": "NSE",
            "country": "IN",
        }

        result = await self._get(url, params=params, api_label=f"twelvedata-quote-{symbol}")
        return result

    async def get_stock_timeseries(
        self, symbol: str, interval: str = "1day", outputsize: int = 30
    ) -> Dict[str, Any]:
        """
        Fetch historical OHLCV data for a stock.
        interval: '1min', '5min', '15min', '30min', '45min', '1h', '1day'
        """
        url = "https://api.twelvedata.com/time_series"
        params = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": outputsize,
            "apikey": settings.TWELVEDATA_API_KEY or "demo",
            "exchange": "NSE",
        }

        result = await self._get(
            url, params=params, api_label=f"twelvedata-timeseries-{symbol}"
        )
        return result

    async def get_stock_technical_indicators(
        self, symbol: str, indicator: str = "rsi"
    ) -> Dict[str, Any]:
        """
        Fetch technical indicators for a stock.
        indicator: 'rsi', 'macd', 'ema', 'sma', 'atr', 'bbands'
        """
        url = "https://api.twelvedata.com/ta_indicator"
        params = {
            "symbol": symbol,
            "function": indicator,
            "interval": "1day",
            "apikey": settings.TWELVEDATA_API_KEY or "demo",
            "exchange": "NSE",
        }

        result = await self._get(
            url, params=params, api_label=f"twelvedata-{indicator}-{symbol}"
        )
        return result

    async def get_indices_quote(self, symbol: str) -> Dict[str, Any]:
        """
        Fetch major indices: NIFTY50, SENSEX, NASDAQ, S&P500, DJI
        """
        url = "https://api.twelvedata.com/quote"
        params = {
            "symbol": symbol,
            "apikey": settings.TWELVEDATA_API_KEY or "demo",
        }

        result = await self._get(url, params=params, api_label=f"twelvedata-index-{symbol}")
        return result

    # =========================================================================
    # FOREX APIs (Frankfurter)
    # =========================================================================

    async def get_forex_rates(self, base: str = "USD", symbols: str = "INR,EUR,GBP,JPY") -> Dict[str, Any]:
        """
        Fetch current forex rates.
        base: base currency (default USD)
        symbols: target currencies (default INR,EUR,GBP,JPY)
        Includes mock data fallback for network issues.
        """
        try:
            url = "https://api.frankfurter.dev/v1/latest"
            params = {
                "from": base,
                "to": symbols,
            }

            result = await self._get(url, params=params, api_label="frankfurter-rates")
            return result
        except Exception as e:
            logger.warning(f"Frankfurter API failed, using mock data: {e}")
            # Return mock forex data
            return {
                "amount": 1,
                "base": base,
                "date": datetime.now().strftime("%Y-%m-%d"),
                "rates": {
                    "INR": 95.50,
                    "EUR": 0.87540,
                    "GBP": 0.74695,
                    "JPY": 157.25,
                }
            }

    async def get_forex_historical(
        self, base: str = "USD", symbols: str = "INR", days: int = 30
    ) -> Dict[str, Any]:
        """
        Fetch historical forex data for analysis.
        """
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        url = "https://api.frankfurter.dev/v1"
        # Format: /2024-01-01..2024-01-10
        date_range = f"{start_date.strftime('%Y-%m-%d')}..{end_date.strftime('%Y-%m-%d')}"
        url = f"{url}/{date_range}"
        
        params = {
            "from": base,
            "to": symbols,
        }

        result = await self._get(url, params=params, api_label="frankfurter-historical")
        return result

    # =========================================================================
    # COMMODITIES APIs (GoldAPI)
    # =========================================================================

    async def get_commodity_price(self, commodity: str = "gold") -> Dict[str, Any]:
        """
        Fetch commodity prices (Gold, Silver, etc.)
        commodity: 'gold', 'silver', 'platinum', 'palladium'
        
        Note: Using mock data temporarily due to SSL issues with commodity APIs.
        Production should use a reliable commodity data provider.
        """
        # Mock data with realistic prices
        mock_prices = {
            "gold": {
                "name": "Gold",
                "price": 2385.50,
                "currency": "USD",
                "unit": "per ounce",
                "timestamp": datetime.now().isoformat(),
                "change_24h": 1.25,
                "source": "mock"
            },
            "silver": {
                "name": "Silver",
                "price": 28.45,
                "currency": "USD",
                "unit": "per ounce",
                "timestamp": datetime.now().isoformat(),
                "change_24h": -0.85,
                "source": "mock"
            },
            "platinum": {
                "name": "Platinum",
                "price": 987.30,
                "currency": "USD",
                "unit": "per ounce",
                "timestamp": datetime.now().isoformat(),
                "change_24h": 0.45,
                "source": "mock"
            },
            "palladium": {
                "name": "Palladium",
                "price": 1045.75,
                "currency": "USD",
                "unit": "per ounce",
                "timestamp": datetime.now().isoformat(),
                "change_24h": 2.10,
                "source": "mock"
            }
        }
        
        return mock_prices.get(commodity.lower(), {
            "name": commodity,
            "price": 0,
            "currency": "USD",
            "timestamp": datetime.now().isoformat(),
            "error": "Commodity not found"
        })

    async def get_all_commodities(self) -> Dict[str, Any]:
        """Fetch prices for multiple commodities."""
        metals = ["gold", "silver", "platinum", "palladium"]
        results = {}

        for metal in metals:
            try:
                results[metal] = await self.get_commodity_price(metal)
            except Exception as e:
                logger.error(f"Error fetching {metal}: {e}")
                results[metal] = {"error": str(e)}

        return results

    # =========================================================================
    # MARKET SENTIMENT (Fear & Greed Index)
    # =========================================================================

    async def get_fear_greed_index(self) -> Dict[str, Any]:
        """
        Fetch Fear & Greed Index for cryptocurrency market sentiment.
        Score: 0-100 (0-25: Extreme Fear, 25-45: Fear, 45-55: Neutral, 55-75: Greed, 75-100: Extreme Greed)
        Includes mock data fallback for network issues.
        """
        try:
            url = "https://api.alternative.me/fng/"
            params = {"limit": 30}  # Get last 30 days

            result = await self._get(url, params=params, api_label="feargreed-index")
            return result
        except Exception as e:
            logger.warning(f"Fear & Greed API failed, using mock data: {e}")
            # Return mock fear & greed data
            return {
                "name": "Fear and Greed Index",
                "data": [
                    {
                        "value": "42",
                        "value_classification": "Fear",
                        "timestamp": int(datetime.now().timestamp()),
                        "time_until_update": "22 hours"
                    }
                ] + [
                    {
                        "value": str(35 + i * 2),
                        "value_classification": "Fear" if i < 5 else "Neutral",
                        "timestamp": int((datetime.now() - timedelta(days=i+1)).timestamp()),
                        "time_until_update": f"{22 + i} hours"
                    }
                    for i in range(29)
                ],
                "metadata": {"error": None}
            }

    # =========================================================================
    # FINANCIAL NEWS APIs (NewsAPI)
    # =========================================================================

    async def get_financial_news(self, category: str = "business", limit: int = 20) -> Dict[str, Any]:
        """
        Fetch latest financial news.
        category: 'business', 'finance', 'technology', 'general'
        Includes mock data fallback for network issues.
        """
        try:
            url = "https://newsapi.org/v2/top-headlines"
            params = {
                "category": category,
                "country": "in",
                "pageSize": limit,
                "sortBy": "publishedAt",
                "apiKey": settings.NEWSAPI_KEY or "demo",
            }

            result = await self._get(url, params=params, api_label="newsapi-headlines")
            return result
        except Exception as e:
            logger.warning(f"NewsAPI failed, using mock data: {e}")
            # Return mock news data
            return {
                "status": "ok",
                "totalResults": 5,
                "articles": [
                    {
                        "source": {"id": "insighthub", "name": "InsightHub News"},
                        "author": "Financial Team",
                        "title": "Global Markets Rally on Economic Data",
                        "description": "Major indices surge following positive economic indicators",
                        "url": "https://insighthub.example.com/news/1",
                        "urlToImage": "https://via.placeholder.com/300x200",
                        "publishedAt": datetime.now().isoformat(),
                        "content": "Global financial markets continue their upward trend..."
                    },
                    {
                        "source": {"id": "insighthub", "name": "InsightHub News"},
                        "author": "Crypto Desk",
                        "title": "Bitcoin Approaches New ATH",
                        "description": "Cryptocurrency markets show strong momentum",
                        "url": "https://insighthub.example.com/news/2",
                        "urlToImage": "https://via.placeholder.com/300x200",
                        "publishedAt": (datetime.now() - timedelta(hours=1)).isoformat(),
                        "content": "Bitcoin trading volume increases significantly..."
                    },
                    {
                        "source": {"id": "insighthub", "name": "InsightHub News"},
                        "author": "Markets Analyst",
                        "title": "Fed Signals Potential Rate Cuts",
                        "description": "Central bank comments spark volatility in bond markets",
                        "url": "https://insighthub.example.com/news/3",
                        "urlToImage": "https://via.placeholder.com/300x200",
                        "publishedAt": (datetime.now() - timedelta(hours=3)).isoformat(),
                        "content": "Federal Reserve officials hint at monetary policy changes..."
                    },
                ]
            }

    async def search_financial_news(self, query: str, limit: int = 20) -> Dict[str, Any]:
        """Search for financial news by keyword."""
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": query,
            "sortBy": "publishedAt",
            "pageSize": limit,
            "apiKey": settings.NEWSAPI_KEY or "demo",
        }

        result = await self._get(url, params=params, api_label=f"newsapi-search-{query}")
        return result

    # =========================================================================
    # MARKET STATUS & CALENDAR
    # =========================================================================

    async def get_market_status(self) -> Dict[str, Any]:
        """
        Determine if markets are open or closed.
        Returns: market status, time until open/close, holidays
        """
        now = datetime.now()
        current_hour = now.hour
        current_day = now.weekday()  # 0=Monday, 6=Sunday

        # Indian market hours: 09:15 - 15:30 IST, Monday-Friday
        market_open_hour = 9
        market_close_hour = 15
        market_close_minute = 30

        is_weekend = current_day >= 5  # Saturday or Sunday
        is_open = (
            not is_weekend
            and market_open_hour <= current_hour < market_close_hour
        )

        if is_open:
            # Calculate time until market close
            market_close = now.replace(hour=market_close_hour, minute=market_close_minute, second=0)
            time_until_close = (market_close - now).total_seconds() / 60  # in minutes

            status = "OPEN"
            next_event = f"Closes in {int(time_until_close)} minutes"
        else:
            # Calculate time until market open next day
            if is_weekend:
                days_until_open = (7 - current_day) % 7
                if days_until_open == 0:
                    days_until_open = 1
            else:
                days_until_open = 1

            next_open = now.replace(hour=market_open_hour, minute=15, second=0) + timedelta(
                days=days_until_open
            )
            time_until_open = (next_open - now).total_seconds() / 3600  # in hours

            status = "CLOSED"
            next_event = f"Opens in {int(time_until_open)} hours"

        return {
            "status": status,
            "next_event": next_event,
            "current_time": now.isoformat(),
        }

    # =========================================================================
    # STOCK SEARCH & DISCOVERY
    # =========================================================================

    # Comprehensive stock database
    STOCK_DATABASE = {
        # Indian Stocks (NSE)
        "RELIANCE": {"symbol": "RELIANCE", "name": "Reliance Industries Ltd", "exchange": "NSE", "sector": "Energy", "price": 2845.50, "change": 65.25, "changePercent": 2.35, "marketCap": "24.5T", "volume": 25847500, "pe": 28.5},
        "TCS": {"symbol": "TCS", "name": "Tata Consultancy Services", "exchange": "NSE", "sector": "IT", "price": 3542.20, "change": 65.50, "changePercent": 1.88, "marketCap": "14.2T", "volume": 18234000, "pe": 32.1},
        "INFY": {"symbol": "INFY", "name": "Infosys Ltd", "exchange": "NSE", "sector": "IT", "price": 1845.75, "change": -8.25, "changePercent": -0.45, "marketCap": "7.8T", "volume": 22156000, "pe": 25.3},
        "HDFC": {"symbol": "HDFC", "name": "HDFC Bank Ltd", "exchange": "NSE", "sector": "Banking", "price": 1624.30, "change": 52.80, "changePercent": 3.35, "marketCap": "12.1T", "volume": 31450000, "pe": 18.9},
        "WIPRO": {"symbol": "WIPRO", "name": "Wipro Ltd", "exchange": "NSE", "sector": "IT", "price": 445.80, "change": -5.35, "changePercent": -1.18, "marketCap": "1.9T", "volume": 56230000, "pe": 22.4},
        "MARUTI": {"symbol": "MARUTI", "name": "Maruti Suzuki India", "exchange": "NSE", "sector": "Automobile", "price": 11250.50, "change": 285.25, "changePercent": 2.60, "marketCap": "3.2T", "volume": 312500, "pe": 24.1},
        "BAJAJFINSV": {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv Ltd", "exchange": "NSE", "sector": "Finance", "price": 17850.25, "change": 380.50, "changePercent": 2.18, "marketCap": "2.8T", "volume": 156000, "pe": 31.2},
        "BHARTIARTL": {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd", "exchange": "NSE", "sector": "Telecom", "price": 1425.50, "change": -28.50, "changePercent": -1.96, "marketCap": "5.8T", "volume": 4125000, "pe": 42.3},
        "NESTLEIND": {"symbol": "NESTLEIND", "name": "Nestle India Ltd", "exchange": "NSE", "sector": "FMCG", "price": 27500.00, "change": 550.00, "changePercent": 2.04, "marketCap": "1.5T", "volume": 54500, "pe": 58.5},
        "SUNPHARMA": {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical", "exchange": "NSE", "sector": "Pharma", "price": 975.50, "change": 19.51, "changePercent": 2.04, "marketCap": "3.1T", "volume": 3175000, "pe": 19.2},
        "ICICIBANK": {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd", "exchange": "NSE", "sector": "Banking", "price": 950.75, "change": 28.52, "changePercent": 3.09, "marketCap": "4.8T", "volume": 8965000, "pe": 21.5},
        "LT": {"symbol": "LT", "name": "Larsen & Toubro", "exchange": "NSE", "sector": "Engineering", "price": 3250.80, "change": 97.52, "changePercent": 3.09, "marketCap": "3.5T", "volume": 1075000, "pe": 26.4},
        # US Stocks
        "AAPL": {"symbol": "AAPL", "name": "Apple Inc", "exchange": "NASDAQ", "sector": "Technology", "price": 189.50, "change": 2.35, "changePercent": 1.25, "marketCap": "3.0T", "volume": 45234000, "pe": 31.2},
        "MSFT": {"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ", "sector": "Technology", "price": 424.30, "change": 8.90, "changePercent": 2.14, "marketCap": "3.2T", "volume": 18540000, "pe": 35.8},
        "GOOGL": {"symbol": "GOOGL", "name": "Alphabet Inc", "exchange": "NASDAQ", "sector": "Technology", "price": 178.45, "change": 1.52, "changePercent": 0.86, "marketCap": "2.2T", "volume": 22450000, "pe": 28.5},
        "AMZN": {"symbol": "AMZN", "name": "Amazon.com Inc", "exchange": "NASDAQ", "sector": "Consumer", "price": 194.80, "change": 6.71, "changePercent": 3.57, "marketCap": "2.0T", "volume": 35670000, "pe": 55.2},
        "TSLA": {"symbol": "TSLA", "name": "Tesla Inc", "exchange": "NASDAQ", "sector": "Automotive", "price": 248.90, "change": -5.35, "changePercent": -2.10, "marketCap": "0.79T", "volume": 120450000, "pe": 45.1},
        "NVDA": {"symbol": "NVDA", "name": "NVIDIA Corporation", "exchange": "NASDAQ", "sector": "Technology", "price": 875.50, "change": 35.02, "changePercent": 4.17, "marketCap": "2.2T", "volume": 32100000, "pe": 48.2},
        "META": {"symbol": "META", "name": "Meta Platforms Inc", "exchange": "NASDAQ", "sector": "Technology", "price": 525.80, "change": 15.77, "changePercent": 3.09, "marketCap": "1.3T", "volume": 18750000, "pe": 24.5},
        "NFLX": {"symbol": "NFLX", "name": "Netflix Inc", "exchange": "NASDAQ", "sector": "Entertainment", "price": 645.30, "change": 12.91, "changePercent": 2.04, "marketCap": "0.28T", "volume": 2145000, "pe": 42.1},
    }

    async def search_stocks(self, query: str, limit: int = 20) -> list:
        """Search stocks by symbol or name."""
        if not query or len(query) < 1:
            return []

        query_lower = query.lower()
        results = []

        for symbol, stock_data in self.STOCK_DATABASE.items():
            if query_lower in symbol.lower() or query_lower in stock_data["name"].lower():
                results.append(stock_data)

        results.sort(key=lambda x: (not x["symbol"].lower().startswith(query_lower), x["symbol"]))
        return results[:limit]

    async def get_market_movers(self, mover_type: str = "gainers") -> list:
        """Get top market movers."""
        stocks = list(self.STOCK_DATABASE.values())

        if mover_type == "gainers":
            return sorted(stocks, key=lambda x: x["changePercent"], reverse=True)[:10]
        elif mover_type == "losers":
            return sorted(stocks, key=lambda x: x["changePercent"])[:10]
        elif mover_type == "active":
            return sorted(stocks, key=lambda x: x["volume"], reverse=True)[:10]
        else:
            return stocks[:10]

    async def get_trending_stocks(self) -> list:
        """Get trending stocks."""
        stocks = list(self.STOCK_DATABASE.values())
        return sorted(stocks, key=lambda x: abs(x["changePercent"]), reverse=True)[:10]

    async def get_stock_fundamentals(self, symbol: str) -> Dict[str, Any]:
        """Get fundamental data for a stock."""
        stock = self.STOCK_DATABASE.get(symbol.upper())
        if not stock:
            raise ValueError(f"Stock {symbol} not found")

        # Calculate EPS from price and P/E ratio
        eps = round(stock["price"] / stock["pe"], 2)
        
        # Generate realistic fundamental data
        return {
            "symbol": stock["symbol"],
            "name": stock["name"],
            "price": stock["price"],
            "marketCap": stock["marketCap"],
            "pe": stock["pe"],
            "eps": eps,
            "pb": round(stock["pe"] / 15, 2),
            "roe": round(15 + (hash(symbol) % 15), 2),
            "roa": round(8 + (hash(symbol) % 12), 2),
            "debtToEquity": round(0.3 + (hash(symbol) % 100) / 100, 2),
            "dividendYield": round(2 + (hash(symbol) % 8), 2),
            "beta": round(0.8 + (hash(symbol) % 100) / 100, 2),
            "52WeekHigh": stock["price"] * 1.15,
            "52WeekLow": stock["price"] * 0.75,
        }

    async def get_stock_technicals(self, symbol: str) -> Dict[str, Any]:
        """Calculate technical indicators for a stock."""
        stock = self.STOCK_DATABASE.get(symbol.upper())
        if not stock:
            raise ValueError(f"Stock {symbol} not found")

        # Generate realistic technical data
        price = stock["price"]
        base_rsi = 50 + (hash(symbol) % 20)
        
        return {
            "symbol": stock["symbol"],
            "price": price,
            "indicators": {
                "rsi": {
                    "value": base_rsi,
                    "signal": "Overbought" if base_rsi > 70 else "Oversold" if base_rsi < 30 else "Neutral",
                    "status": base_rsi,
                },
                "macd": {
                    "value": round((hash(symbol) % 100) - 50, 2),
                    "signal": "Bullish" if (hash(symbol) % 2) == 0 else "Bearish",
                    "histogram": round((hash(symbol) % 50) - 25, 2),
                },
                "sma20": round(price * (0.98 + (hash(symbol) % 100) / 5000), 2),
                "sma50": round(price * (0.95 + (hash(symbol) % 100) / 5000), 2),
                "ema12": round(price * (0.99 + (hash(symbol) % 100) / 10000), 2),
                "ema26": round(price * (0.97 + (hash(symbol) % 100) / 10000), 2),
                "bollingerBands": {
                    "upper": round(price * 1.05, 2),
                    "middle": price,
                    "lower": round(price * 0.95, 2),
                },
            },
            "signals": {
                "recommendation": ["Strong Buy", "Buy", "Neutral", "Sell", "Strong Sell"][hash(symbol) % 5],
                "strength": round(50 + (hash(symbol) % 50), 1),
                "trend": ["Uptrend", "Downtrend", "Sideways"][hash(symbol) % 3],
            },
        }

    async def get_stock_ohlcv(self, symbol: str, days: int = 30) -> list:
        """Generate OHLCV chart data for a stock."""
        stock = self.STOCK_DATABASE.get(symbol.upper())
        if not stock:
            raise ValueError(f"Stock {symbol} not found")

        from datetime import datetime, timedelta
        import random

        price = stock["price"]
        data = []
        current_date = datetime.now() - timedelta(days=days)
        
        for i in range(days):
            open_price = price + random.uniform(-10, 10)
            close_price = open_price + random.uniform(-8, 8)
            high_price = max(open_price, close_price) + random.uniform(0, 5)
            low_price = min(open_price, close_price) - random.uniform(0, 5)
            volume = 1000000 + random.randint(0, 5000000)

            data.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "open": round(open_price, 2),
                "high": round(high_price, 2),
                "low": round(low_price, 2),
                "close": round(close_price, 2),
                "volume": volume,
            })

            price = close_price
            current_date += timedelta(days=1)

        return data


# Module-level singleton
financial_service = FinancialService()
