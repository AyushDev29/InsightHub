"""
Financial Intelligence Schema Definitions

Type definitions for:
- Market indices (Nifty, Sensex, NASDAQ, S&P500, Dow, BTC, ETH)
- Stock data
- Cryptocurrency data
- Forex rates
- Commodities
- Market sentiment
- Financial news
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# =========================================================================
# MARKET INDEX
# =========================================================================

class MarketIndexData(BaseModel):
    """Data for a single market index."""
    symbol: str = Field(..., description="Index symbol: NIFTY, SENSEX, NASDAQ, etc.")
    name: str = Field(..., description="Full name")
    current_price: float = Field(..., description="Current price/level")
    daily_change: float = Field(..., description="Daily change in points")
    daily_change_percent: float = Field(..., description="Daily change in %")
    weekly_change_percent: Optional[float] = Field(None, description="Weekly change %")
    sparkline: List[float] = Field(..., description="7-day price sparkline")
    status: str = Field(default="OPEN", description="OPEN, CLOSED, HOLIDAY")
    last_updated: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "NIFTY50",
                "name": "Nifty 50 Index",
                "current_price": 24567.50,
                "daily_change": 234.5,
                "daily_change_percent": 0.96,
                "weekly_change_percent": 1.23,
                "sparkline": [24100, 24200, 24350, 24450, 24500, 24550, 24567],
                "status": "OPEN",
            }
        }


class MarketOverviewResponse(BaseModel):
    """Market overview with multiple indices."""
    indices: List[MarketIndexData]
    market_status: str
    last_updated: datetime = Field(default_factory=datetime.now)


# =========================================================================
# STOCK DATA
# =========================================================================

class StockQuote(BaseModel):
    """Current stock quote data."""
    symbol: str
    name: str
    current_price: float
    daily_change: float
    daily_change_percent: float
    previous_close: float
    high_52_week: float
    low_52_week: float
    market_cap: Optional[float] = None
    volume: float
    pe_ratio: Optional[float] = None
    dividend_yield: Optional[float] = None
    last_updated: datetime = Field(default_factory=datetime.now)


class StockCandlestick(BaseModel):
    """OHLCV candlestick data point."""
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


class StockChart(BaseModel):
    """Stock historical chart data."""
    symbol: str
    interval: str
    candlesticks: List[StockCandlestick]
    last_updated: datetime = Field(default_factory=datetime.now)


class TechnicalIndicators(BaseModel):
    """Technical analysis indicators."""
    symbol: str
    indicator_type: str  # RSI, MACD, EMA, etc.
    values: List[dict]
    last_updated: datetime = Field(default_factory=datetime.now)


# =========================================================================
# CRYPTOCURRENCY
# =========================================================================

class CryptoData(BaseModel):
    """Cryptocurrency market data."""
    symbol: str = Field(..., description="e.g., 'bitcoin', 'ethereum'")
    name: str
    current_price: float
    market_cap: float
    market_cap_rank: int
    volume_24h: float
    price_change_24h: float
    price_change_percent_24h: float
    price_change_percent_7d: Optional[float] = None
    circulating_supply: float
    total_supply: float
    ath: Optional[float] = None
    atl: Optional[float] = None
    sparkline_7d: List[float] = Field(..., description="7-day price sparkline")
    last_updated: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "bitcoin",
                "name": "Bitcoin",
                "current_price": 45678.50,
                "market_cap": 890000000000,
                "market_cap_rank": 1,
                "volume_24h": 45000000000,
                "price_change_24h": 1234.50,
                "price_change_percent_24h": 2.78,
                "price_change_percent_7d": 5.23,
                "circulating_supply": 21000000,
                "total_supply": 21000000,
                "ath": 69000,
                "atl": 100,
                "sparkline_7d": [44500, 44800, 45200, 45500, 45600, 45700, 45678],
            }
        }


class CryptoTrending(BaseModel):
    """Trending cryptocurrency data."""
    coins: List[CryptoData]
    last_updated: datetime = Field(default_factory=datetime.now)


# =========================================================================
# FOREX
# =========================================================================

class ForexRate(BaseModel):
    """Forex exchange rate."""
    pair: str = Field(..., description="e.g., 'USD/INR'")
    rate: float
    change_percent: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class ForexData(BaseModel):
    """Forex market data."""
    base: str
    rates: List[ForexRate]
    last_updated: datetime = Field(default_factory=datetime.now)


# =========================================================================
# COMMODITIES
# =========================================================================

class CommodityPrice(BaseModel):
    """Commodity price data."""
    commodity: str = Field(..., description="gold, silver, oil, natural_gas")
    price: float
    currency: str = Field(default="USD")
    unit: str = Field(..., description="g, kg, bbl, mmbtu")
    daily_change: Optional[float] = None
    daily_change_percent: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.now)


# =========================================================================
# MARKET SENTIMENT
# =========================================================================

class FearGreedIndex(BaseModel):
    """Fear & Greed Index data."""
    value: int = Field(..., ge=0, le=100, description="0-100 score")
    classification: str = Field(
        ...,
        description="Extreme Fear, Fear, Neutral, Greed, Extreme Greed"
    )
    timestamp: datetime
    previous_value: Optional[int] = None
    history: Optional[List[dict]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "value": 65,
                "classification": "Greed",
                "timestamp": "2024-07-12T10:30:00Z",
                "previous_value": 62,
            }
        }


# =========================================================================
# FINANCIAL NEWS
# =========================================================================

class NewsArticle(BaseModel):
    """Financial news article."""
    headline: str
    description: Optional[str] = None
    source: str
    category: str
    url: str
    image_url: Optional[str] = None
    published_at: datetime


class FinancialNewsResponse(BaseModel):
    """Financial news response."""
    articles: List[NewsArticle]
    total_results: int
    last_updated: datetime = Field(default_factory=datetime.now)


# =========================================================================
# MARKET STATUS
# =========================================================================

class MarketStatusResponse(BaseModel):
    """Market open/close status."""
    status: str = Field(..., description="OPEN, CLOSED, HOLIDAY")
    next_event: str = Field(..., description="Time until open/close")
    current_time: datetime
    market_type: str = Field(default="NSE", description="NSE, BSE, NASDAQ, etc.")
