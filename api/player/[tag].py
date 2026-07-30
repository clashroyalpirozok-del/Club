"""Vercel serverless: GET /api/player/[tag]"""
import os
import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    from _brawl import fetch_player
except ImportError:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from api._brawl import fetch_player


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Vercel routes /api/player/[tag] here; the tag is the last path segment
            path = urlparse(self.path).path
            tag = unquote(path.rstrip("/").split("/")[-1])
            data = fetch_player(tag)
            body = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
        except Exception as e:
            body = json.dumps({"detail": f"Brawl API error: {e}"}).encode("utf-8")
            self.send_response(502)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "s-maxage=30, stale-while-revalidate=60")
        self.end_headers()
        self.wfile.write(body)
