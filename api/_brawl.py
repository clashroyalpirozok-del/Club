"""Brawl Stars API client (via RoyaleAPI proxy) - Vercel serverless version."""
import os
import re
import httpx

BASE = os.environ.get("BRAWL_API_BASE", "https://bsproxy.royaleapi.dev/v1")

PROFILE_ICON = "https://cdn.brawlify.com/profile-icons/regular/{id}.png"
BRAWLER_IMG = "https://cdn.brawlify.com/brawlers/borderless/{id}.png"
CLUB_BADGE = "https://cdn.brawlify.com/club-badges/regular/{id}.png"

TYPE_MAP = {
    "open": "Открытый",
    "inviteOnly": "По приглашению",
    "closed": "Закрытый",
}

_TAG_RE = re.compile(r"<c\d+>|</c>", re.IGNORECASE)


def _headers():
    token = os.environ.get("BRAWL_API_TOKEN", "")
    return {"Authorization": f"Bearer {token}", "Accept": "application/json"}


def _encode_tag(tag: str) -> str:
    tag = tag.strip()
    if not tag.startswith("#"):
        tag = "#" + tag
    return "%23" + tag[1:].upper()


def color_from_name(name_color: str) -> str:
    if not name_color:
        return "#f4efe1"
    hexpart = name_color.replace("0x", "")
    if len(hexpart) == 8:
        hexpart = hexpart[2:]
    return "#" + hexpart.lower()


def strip_color_tags(text: str) -> str:
    if not text:
        return ""
    return _TAG_RE.sub("", text)


def _get(path: str):
    with httpx.Client(timeout=25) as client:
        r = client.get(f"{BASE}{path}", headers=_headers())
        r.raise_for_status()
        return r.json()


def transform_club(data: dict) -> dict:
    members = data.get("members", [])
    members_list = []
    for i, m in enumerate(members):
        members_list.append({
            "rank": i + 1,
            "tag": m.get("tag"),
            "name": m.get("name"),
            "color": color_from_name(m.get("nameColor")),
            "role": m.get("role", "member"),
            "trophies": m.get("trophies", 0),
            "icon": PROFILE_ICON.format(id=(m.get("icon") or {}).get("id", 28000000)),
        })
    return {
        "tag": data.get("tag"),
        "name": data.get("name"),
        "description": strip_color_tags(data.get("description", "")),
        "type": TYPE_MAP.get(data.get("type"), data.get("type", "")),
        "trophies": data.get("trophies", 0),
        "members": len(members),
        "maxMembers": 30,
        "requiredTrophies": data.get("requiredTrophies", 0),
        "badge": CLUB_BADGE.format(id=data.get("badgeId", 8000000)),
        "membersList": members_list,
    }


def transform_player(data: dict) -> dict:
    brawlers = data.get("brawlers", [])
    maxed = sum(1 for b in brawlers if b.get("power") == 11)
    brawlers_sorted = sorted(brawlers, key=lambda b: b.get("trophies", 0), reverse=True)
    brawlers_out = [{
        "id": b.get("id"),
        "name": b.get("name"),
        "level": b.get("power", 1),
        "trophies": b.get("trophies", 0),
        "img": BRAWLER_IMG.format(id=b.get("id")),
    } for b in brawlers_sorted]
    return {
        "tag": data.get("tag"),
        "name": data.get("name"),
        "color": color_from_name(data.get("nameColor")),
        "icon": PROFILE_ICON.format(id=(data.get("icon") or {}).get("id", 28000000)),
        "stats": {
            "trophies": data.get("trophies", 0),
            "record": data.get("highestTrophies", 0),
            "expLevel": data.get("expLevel", 0),
            "wins3v3": data.get("3vs3Victories", 0),
            "soloWins": data.get("soloVictories", 0),
            "duoWins": data.get("duoVictories", 0),
        },
        "brawlersCount": len(brawlers),
        "maxedInfo": f"{maxed} на 11 ур.",
        "brawlers": brawlers_out,
    }


def fetch_club(tag: str) -> dict:
    return transform_club(_get(f"/clubs/{_encode_tag(tag)}"))


def fetch_player(tag: str) -> dict:
    return transform_player(_get(f"/players/{_encode_tag(tag)}"))
