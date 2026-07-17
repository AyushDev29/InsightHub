#!/usr/bin/env python3
"""
Test Financial Intelligence API Endpoints
Verifies that all financial APIs are working properly
"""

import asyncio
import sys
import os

# Fix encoding for Windows
os.environ['PYTHONIOENCODING'] = 'utf-8'

from app.services.financial_service import financial_service
from app.core.logging import logger

async def test_all_endpoints():
    """Test all financial endpoints"""
    
    tests_passed = 0
    tests_failed = 0
    
    print("\n" + "="*60)
    print("FINANCIAL INTELLIGENCE API TESTS")
    print("="*60 + "\n")
    
    # Test 1: Market Status
    try:
        print("[1] Testing Market Status...")
        result = await financial_service.get_market_status()
        assert result['status'] in ['OPEN', 'CLOSED', 'HOLIDAY']
        print(f"    OK: Market Status: {result['status']}")
        print(f"    OK: Next Event: {result['next_event']}")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 2: Crypto Overview
    try:
        print("\n[2] Testing Crypto Overview...")
        result = await financial_service.get_crypto_overview()
        assert len(result) > 0
        top_crypto = result[0]
        print(f"    OK: Retrieved {len(result)} cryptocurrencies")
        print(f"    OK: Top crypto: {top_crypto.get('name')} (${top_crypto.get('current_price')})")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 3: Crypto Details
    try:
        print("\n[3] Testing Crypto Details (Bitcoin)...")
        result = await financial_service.get_crypto_by_id('bitcoin')
        assert result.get('name') == 'Bitcoin'
        print(f"    OK: Retrieved Bitcoin data")
        print(f"    OK: Market Cap Rank: {result.get('market_cap_rank')}")
        print(f"    OK: Current Price: ${result.get('market_data', {}).get('current_price', {}).get('usd')}")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 4: Trending Crypto
    try:
        print("\n[4] Testing Trending Crypto...")
        result = await financial_service.get_crypto_trending()
        assert 'data' in result
        trending = result['data'][:3] if result['data'] else []
        print(f"    OK: Retrieved trending cryptocurrencies")
        for trend in trending:
            print(f"    OK: {trend['item']['name']} (#{trend['market_cap_rank']})")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 5: Forex Rates
    try:
        print("\n[5] Testing Forex Rates...")
        result = await financial_service.get_forex_rates('USD', 'INR,EUR,GBP')
        assert 'rates' in result
        rates = result['rates']
        print(f"    OK: Retrieved forex rates")
        for currency, rate in list(rates.items())[:3]:
            print(f"    OK: 1 USD = {rate} {currency}")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 6: Fear & Greed Index
    try:
        print("\n[6] Testing Fear & Greed Index...")
        result = await financial_service.get_fear_greed_index()
        assert 'data' in result
        current = result['data'][0]
        print(f"    OK: Retrieved Fear & Greed Index")
        print(f"    OK: Current Value: {current['value']} ({current['value_classification']})")
        print(f"    OK: Data points: {len(result['data'])}")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 7: Commodities
    try:
        print("\n[7] Testing Commodities...")
        result = await financial_service.get_all_commodities()
        assert len(result) > 0
        print(f"    OK: Retrieved {len(result)} commodities")
        for commodity, data in list(result.items())[:2]:
            if isinstance(data, dict) and 'price' in data:
                print(f"    OK: {commodity.capitalize()}: ${data['price']}")
            else:
                print(f"    OK: {commodity.capitalize()}: Available")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 8: Financial News
    try:
        print("\n[8] Testing Financial News...")
        result = await financial_service.get_financial_news('business', limit=5)
        assert 'articles' in result
        articles = result['articles']
        print(f"    OK: Retrieved {len(articles)} news articles")
        if articles:
            print(f"    OK: Latest: {articles[0]['title'][:60]}...")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 9: News Search
    try:
        print("\n[9] Testing Financial News Search...")
        result = await financial_service.search_financial_news('bitcoin', limit=5)
        assert 'articles' in result
        articles = result['articles']
        print(f"    OK: Found {len(articles)} articles about 'bitcoin'")
        if articles:
            print(f"    OK: Top result: {articles[0]['title'][:60]}...")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Test 10: Stock Quote
    try:
        print("\n[10] Testing Stock Quote (NIFTY50)...")
        result = await financial_service.get_indices_quote('NIFTY50')
        print(f"    OK: Retrieved NIFTY 50 data")
        print(f"    OK: Symbol: {result.get('symbol')}")
        print(f"    OK: Price: {result.get('close', 'N/A')}")
        tests_passed += 1
    except Exception as e:
        print(f"    FAIL: {str(e)}")
        tests_failed += 1
    
    # Summary
    print("\n" + "="*60)
    print("TEST RESULTS")
    print("="*60)
    print(f"PASSED: {tests_passed}")
    print(f"FAILED: {tests_failed}")
    print(f"TOTAL: {tests_passed + tests_failed}")
    print(f"SUCCESS RATE: {(tests_passed / (tests_passed + tests_failed) * 100):.1f}%")
    print("="*60 + "\n")
    
    return tests_failed == 0

if __name__ == "__main__":
    success = asyncio.run(test_all_endpoints())
    sys.exit(0 if success else 1)
