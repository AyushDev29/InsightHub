"""
Financial Intelligence API Endpoints

Routes:
- GET /api/v1/financial/overview - Market overview with all indices
- GET /api/v1/financial/market-status - Market open/closed status
- GET /api/v1/financial/indices - Get specific indices
- GET /api/v1/financial/crypto - Cryptocurrency data
- GET /api/v1/financial/forex - Forex rates
- GET /api/v1/financial/commodities - Commodity prices
- GET /api/v1/financial/sentiment - Fear & Greed Index
- GET /api/v1/financial/news - Financial news
"""

from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException, Query

from app.core.logging import logger
from app.schemas.financial import (
    MarketOverviewResponse,
    MarketStatusResponse,
    CryptoData,
    ForexData,
    FearGreedIndex,
    FinancialNewsResponse,
)
from app.services.financial_service import financial_service
from app.utils.exceptions import ExternalAPIError

router = APIRouter(prefix="/financial", tags=["Financial Intelligence"])


# =========================================================================
# STOCK SEARCH & MARKET MOVERS
# =========================================================================

@router.get("/stock/search", summary="Search Stocks")
async def search_stocks(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
) -> Dict[str, Any]:
    """Search stocks by symbol or company name."""
    try:
        results = await financial_service.search_stocks(q, limit)
        return {
            "success": True,
            "query": q,
            "count": len(results),
            "data": results,
        }
    except Exception as exc:
        logger.error(f"Stock search error: {exc}")
        raise HTTPException(status_code=500, detail="Failed to search stocks")


@router.get("/market/movers", summary="Get Market Movers")
async def get_market_movers(
    type: str = Query("gainers", regex="^(gainers|losers|active|volume)$")
) -> Dict[str, Any]:
    """Get top market movers (gainers, losers, active, volume)."""
    try:
        movers = await financial_service.get_market_movers(type)
        return {
            "success": True,
            "type": type,
            "count": len(movers),
            "data": movers,
        }
    except Exception as exc:
        logger.error(f"Market movers error: {exc}")
        raise HTTPException(status_code=500, detail="Failed to fetch market movers")


@router.get("/market/trending", summary="Get Trending Stocks")
async def get_trending_stocks() -> Dict[str, Any]:
    """Get trending stocks based on volatility."""
    try:
        trending = await financial_service.get_trending_stocks()
        return {
            "success": True,
            "count": len(trending),
            "data": trending,
        }
    except Exception as exc:
        logger.error(f"Trending stocks error: {exc}")
        raise HTTPException(status_code=500, detail="Failed to fetch trending stocks")


@router.get("/stock/{symbol}/fundamentals", summary="Get Stock Fundamentals")
async def get_stock_fundamentals(symbol: str) -> Dict[str, Any]:
    """Get fundamental analysis data for a stock."""
    try:
        data = await financial_service.get_stock_fundamentals(symbol)
        return {
            "success": True,
            "data": data,
        }
    except Exception as exc:
        logger.error(f"Stock fundamentals error for {symbol}: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch fundamentals for {symbol}")


@router.get("/stock/{symbol}/technicals", summary="Get Technical Indicators")
async def get_stock_technicals(symbol: str) -> Dict[str, Any]:
    """Get technical analysis indicators for a stock."""
    try:
        data = await financial_service.get_stock_technicals(symbol)
        return {
            "success": True,
            "data": data,
        }
    except Exception as exc:
        logger.error(f"Stock technicals error for {symbol}: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch technicals for {symbol}")


@router.get("/stock/{symbol}/ohlcv", summary="Get OHLCV Chart Data")
async def get_stock_ohlcv(
    symbol: str,
    days: int = Query(30, ge=5, le=365),
) -> Dict[str, Any]:
    """Get OHLCV (candlestick) data for charting."""
    try:
        data = await financial_service.get_stock_ohlcv(symbol, days)
        return {
            "success": True,
            "symbol": symbol.upper(),
            "count": len(data),
            "data": data,
        }
    except Exception as exc:
        logger.error(f"Stock OHLCV error for {symbol}: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch chart data for {symbol}")


# =========================================================================
# MARKET OVERVIEW
# =========================================================================

@router.get("/overview", response_model=Dict[str, Any], summary="Get Market Overview")
async def get_market_overview() -> Dict[str, Any]:
    """
    Get comprehensive market overview with all major indices.
    
    Includes:
    - Indian indices (Nifty 50, Sensex)
    - US indices (NASDAQ, S&P 500, Dow Jones)
    - Major cryptocurrencies (Bitcoin, Ethereum)
    - Commodities (Gold, Silver)
    - Forex rates (USD/INR, EUR/INR)
    """
    try:
        # Fetch all data in parallel
        indices_data = await financial_service.get_indices_quote("NIFTY50")
        market_status = await financial_service.get_market_status()
        crypto_overview = await financial_service.get_crypto_overview()
        forex_rates = await financial_service.get_forex_rates()
        fear_greed = await financial_service.get_fear_greed_index()
        commodities = await financial_service.get_all_commodities()

        return {
            "success": True,
            "data": {
                "indices": indices_data,
                "market_status": market_status,
                "top_crypto": crypto_overview[:10],  # Top 10
                "forex": forex_rates,
                "fear_greed": fear_greed,
                "commodities": commodities,
            },
            "timestamp": market_status.get("current_time"),
        }
    except ExternalAPIError as exc:
        logger.error(f"Market overview error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch market data")


# =========================================================================
# MARKET STATUS
# =========================================================================

@router.get("/market-status", response_model=MarketStatusResponse, summary="Get Market Status")
async def get_market_status(exchange: str = Query("NSE", regex="^(NSE|NASDAQ)$")) -> MarketStatusResponse:
    """
    Check if markets are open or closed for a specific exchange.
    
    Parameters:
    - exchange: "NSE" (India, default) or "NASDAQ" (US)
    
    Returns:
    - status: OPEN, CLOSED, or HOLIDAY
    - next_event: Time until market opens/closes for the specific exchange
    - current_time: Server time
    - exchange: Which market (NSE or NASDAQ)
    """
    try:
        status_data = await financial_service.get_market_status(exchange=exchange)
        return MarketStatusResponse(
            status=status_data["status"],
            next_event=status_data["next_event"],
            current_time=status_data["current_time"],
        )
    except ExternalAPIError as exc:
        logger.error(f"Market status error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch market status")


# =========================================================================
# CRYPTOCURRENCY
# =========================================================================

@router.get("/crypto/top", summary="Get Top Cryptocurrencies")
async def get_top_crypto(limit: int = Query(10, ge=1, le=100)) -> Dict[str, Any]:
    """
    Get top cryptocurrencies by market cap.
    
    Parameters:
    - limit: Number of top cryptos to return (default 10, max 100)
    """
    try:
        crypto_data = await financial_service.get_crypto_overview()
        return {
            "success": True,
            "data": crypto_data[:limit],
            "count": len(crypto_data[:limit]),
        }
    except ExternalAPIError as exc:
        logger.error(f"Crypto overview error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch cryptocurrency data")


@router.get("/crypto/{crypto_id}", summary="Get Crypto Details")
async def get_crypto_details(crypto_id: str) -> Dict[str, Any]:
    """
    Get detailed data for a specific cryptocurrency.
    
    Parameters:
    - crypto_id: 'bitcoin', 'ethereum', 'cardano', etc.
    """
    try:
        crypto_data = await financial_service.get_crypto_by_id(crypto_id.lower())
        return {
            "success": True,
            "data": crypto_data,
        }
    except ExternalAPIError as exc:
        logger.error(f"Crypto detail error: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch {crypto_id} data")


@router.get("/crypto/trending", summary="Get Trending Cryptocurrencies")
async def get_trending_crypto() -> Dict[str, Any]:
    """Get trending cryptocurrencies on CoinGecko."""
    try:
        trending_data = await financial_service.get_crypto_trending()
        return {
            "success": True,
            "data": trending_data,
        }
    except ExternalAPIError as exc:
        logger.error(f"Trending crypto error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch trending cryptos")


# =========================================================================
# FOREX
# =========================================================================

@router.get("/forex/rates", summary="Get Forex Rates")
async def get_forex_rates(
    base: str = Query("USD"),
    symbols: str = Query("INR,EUR,GBP,JPY"),
) -> Dict[str, Any]:
    """
    Get current forex exchange rates.
    
    Parameters:
    - base: Base currency (default USD)
    - symbols: Target currencies comma-separated (default INR,EUR,GBP,JPY)
    
    Example: /api/v1/financial/forex/rates?base=USD&symbols=INR,EUR,GBP
    """
    try:
        rates = await financial_service.get_forex_rates(base=base, symbols=symbols)
        return {
            "success": True,
            "data": rates,
        }
    except ExternalAPIError as exc:
        logger.error(f"Forex rates error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch forex rates")


@router.get("/forex/historical", summary="Get Historical Forex Data")
async def get_forex_historical(
    base: str = Query("USD"),
    symbols: str = Query("INR"),
    days: int = Query(30, ge=1, le=365),
) -> Dict[str, Any]:
    """
    Get historical forex data for analysis.
    
    Parameters:
    - base: Base currency (default USD)
    - symbols: Target currency (default INR)
    - days: Number of historical days (default 30, max 365)
    """
    try:
        data = await financial_service.get_forex_historical(
            base=base, symbols=symbols, days=days
        )
        return {
            "success": True,
            "data": data,
            "period_days": days,
        }
    except ExternalAPIError as exc:
        logger.error(f"Forex historical error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch forex history")


# =========================================================================
# COMMODITIES
# =========================================================================

@router.get("/commodities/{commodity}", summary="Get Commodity Price")
async def get_commodity_price(commodity: str) -> Dict[str, Any]:
    """
    Get current commodity price.
    
    Parameters:
    - commodity: 'gold', 'silver', 'platinum', 'palladium'
    """
    valid_commodities = ["gold", "silver", "platinum", "palladium"]
    if commodity.lower() not in valid_commodities:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid commodity. Choose from: {', '.join(valid_commodities)}",
        )

    try:
        price_data = await financial_service.get_commodity_price(commodity.lower())
        return {
            "success": True,
            "data": price_data,
        }
    except ExternalAPIError as exc:
        logger.error(f"Commodity price error: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch {commodity} price")


@router.get("/commodities", summary="Get All Commodities")
async def get_all_commodities() -> Dict[str, Any]:
    """Get prices for all major commodities (Gold, Silver, Platinum, Palladium)."""
    try:
        commodities = await financial_service.get_all_commodities()
        return {
            "success": True,
            "data": commodities,
        }
    except ExternalAPIError as exc:
        logger.error(f"All commodities error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch commodity prices")


# =========================================================================
# MARKET SENTIMENT
# =========================================================================

@router.get("/sentiment/fear-greed", response_model=Dict[str, Any], summary="Get Fear & Greed Index")
async def get_fear_greed() -> Dict[str, Any]:
    """
    Get current Fear & Greed Index for crypto market sentiment.
    
    Score: 0-100
    - 0-25: Extreme Fear
    - 25-45: Fear
    - 45-55: Neutral
    - 55-75: Greed
    - 75-100: Extreme Greed
    """
    try:
        fg_data = await financial_service.get_fear_greed_index()
        return {
            "success": True,
            "data": fg_data,
        }
    except ExternalAPIError as exc:
        logger.error(f"Fear & Greed error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch Fear & Greed Index")


@router.get("/stock/quote/{symbol}", summary="Get Stock Quote")
async def get_stock_quote(symbol: str) -> Dict[str, Any]:
    """
    Get current stock price and basic information.
    
    Parameters:
    - symbol: Stock symbol (e.g., 'RELIANCE', 'TCS', 'AAPL')
    """
    try:
        stock_data = await financial_service.get_stock_quote(symbol.upper())
        return {
            "success": True,
            "data": stock_data,
        }
    except ExternalAPIError as exc:
        logger.error(f"Stock quote error for {symbol}: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch {symbol} quote")


@router.get("/stock/timeseries/{symbol}", summary="Get Stock Historical Data")
async def get_stock_timeseries(
    symbol: str,
    interval: str = Query("1day", regex="^(1min|5min|15min|30min|1h|1day)$"),
    days: int = Query(30, ge=1, le=365),
) -> Dict[str, Any]:
    """
    Get historical stock price data for charting.
    
    Parameters:
    - symbol: Stock symbol
    - interval: Time interval (1min, 5min, 15min, 30min, 1h, 1day)
    - days: Number of days of history
    """
    try:
        data = await financial_service.get_stock_timeseries(symbol.upper(), interval, days)
        return {
            "success": True,
            "data": data,
            "symbol": symbol.upper(),
            "interval": interval,
        }
    except ExternalAPIError as exc:
        logger.error(f"Stock timeseries error for {symbol}: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch {symbol} history")


@router.get("/stock/indicators/{symbol}", summary="Get Technical Indicators")
async def get_technical_indicators(
    symbol: str,
    indicator: str = Query("rsi", regex="^(rsi|macd|sma|ema|bbands)$"),
) -> Dict[str, Any]:
    """
    Get technical indicators for a stock.
    
    Parameters:
    - symbol: Stock symbol
    - indicator: Technical indicator (rsi, macd, sma, ema, bbands)
    """
    try:
        data = await financial_service.get_stock_technical_indicators(symbol.upper(), indicator)
        return {
            "success": True,
            "data": data,
            "symbol": symbol.upper(),
            "indicator": indicator,
        }
    except ExternalAPIError as exc:
        logger.error(f"Technical indicator error for {symbol}: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch {indicator} for {symbol}")


@router.get("/stock/news/{symbol}", summary="Get Stock-Specific News")
async def get_stock_news(
    symbol: str,
    limit: int = Query(10, ge=1, le=50),
) -> Dict[str, Any]:
    """
    Get news articles about a specific stock.
    
    Parameters:
    - symbol: Stock symbol
    - limit: Number of articles
    """
    try:
        news = await financial_service.search_financial_news(query=symbol, limit=limit)
        return {
            "success": True,
            "data": news,
            "symbol": symbol.upper(),
            "count": len(news.get("articles", [])),
        }
    except ExternalAPIError as exc:
        logger.error(f"Stock news error for {symbol}: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch news for {symbol}")


@router.get("/stock/company/{symbol}", summary="Get Company Details")
async def get_company_details(symbol: str) -> Dict[str, Any]:
    """
    Get detailed company information for a stock.
    
    Parameters:
    - symbol: Stock symbol
    """
    try:
        # For now, return mock company data
        company_data = {
            "symbol": symbol.upper(),
            "name": f"{symbol.upper()} Company",
            "sector": "Technology",
            "industry": "Software",
            "ceo": "CEO Name",
            "website": f"https://{symbol.lower()}.com",
            "founded": "2000",
            "headquarters": "Country",
            "employees": "10000+",
            "description": "Company business summary",
        }
        return {
            "success": True,
            "data": company_data,
        }
    except Exception as exc:
        logger.error(f"Company details error for {symbol}: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch company details for {symbol}")




@router.get("/news", summary="Get Financial News")
async def get_financial_news(
    category: str = Query("business"),
    limit: int = Query(20, ge=1, le=100),
) -> Dict[str, Any]:
    """
    Get latest financial news headlines.
    
    Parameters:
    - category: 'business', 'finance', 'technology', 'general' (default 'business')
    - limit: Number of articles (default 20, max 100)
    """
    try:
        news = await financial_service.get_financial_news(category=category, limit=limit)
        return {
            "success": True,
            "data": news,
            "count": len(news.get("articles", [])),
        }
    except ExternalAPIError as exc:
        logger.error(f"Financial news error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to fetch financial news")


@router.get("/news/search", summary="Search Financial News")
async def search_news(
    query: str = Query(..., min_length=2),
    limit: int = Query(20, ge=1, le=100),
) -> Dict[str, Any]:
    """
    Search for financial news by keyword.
    
    Parameters:
    - query: Search keyword (required, min 2 chars)
    - limit: Number of results (default 20, max 100)
    
    Example: /api/v1/financial/news/search?query=bitcoin&limit=10
    """
    try:
        news = await financial_service.search_financial_news(query=query, limit=limit)
        return {
            "success": True,
            "data": news,
            "count": len(news.get("articles", [])),
            "query": query,
        }
    except ExternalAPIError as exc:
        logger.error(f"News search error: {exc}")
        raise HTTPException(status_code=502, detail="Failed to search financial news")


# =========================================================================
# HEALTH CHECK
# =========================================================================

@router.get("/health", summary="Financial Module Health Check")
async def financial_health() -> Dict[str, Any]:
    """Check if financial APIs are accessible."""
    try:
        # Quick test with Fear & Greed Index
        await financial_service.get_fear_greed_index()
        return {
            "success": True,
            "status": "healthy",
            "module": "financial-intelligence",
        }
    except Exception as exc:
        logger.error(f"Financial module health check failed: {exc}")
        return {
            "success": False,
            "status": "unhealthy",
            "module": "financial-intelligence",
            "error": str(exc),
        }
