#!/usr/bin/env python3
"""
Simple script to run the Trading Vision Analytics API
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
