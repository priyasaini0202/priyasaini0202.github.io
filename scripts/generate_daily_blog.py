import json
import os
import urllib.request
from datetime import datetime, timezone
from email.utils import format_datetime

POSTS_FILE = "data/posts.json"
SITEMAP_FILE = "sitemap.xml"
RSS_FILE = "rss.xml"
SITE_URL = "https://priyankasaini.github.io"

TOPICS = [
    ("risk", "Credit & Financial Risk", "Corporate Leverage Ratios, Covenant Triggers & Counterparty Stress Testing"),
    ("econometrics", "Applied Econometrics", "Fixed-Effects Panel Regression, Unit Root Diagnostics & Policy Elasticity"),
    ("banking", "Banking Operations & Trade Lifecycle", "Zero-Defect Trade Settlement Controls & Regulatory Quality Checks"),
    ("finance", "Corporate Finance & Valuation", "DCF Sensitivity Modeling, Working Capital Cycles & Variance Reporting"),
    ("policy", "Public Policy & Sustainability", "Global Value Chain (GVC) ESG Risk Mapping & Digital Governance Metrics"),
]

def call_gemini(api_key: str, topic_code: str, topic_label: str, angle: str, existing_titles: list):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    prompt = (
        f"You are Priyanka Saini, an M.Sc. (Hons.) Economics and Minor in Management graduate from BITS Pilani, "
        f"Advisor at National Australia Bank, and Learning Facilitator at WILP, BITS Pilani. "
        f"Write a concise, analytically rigorous blog post in the category '{topic_label}' focusing on '{angle}'. "
        f"Avoid repeating these existing titles: {existing_titles}. "
        f"Return ONLY valid JSON with keys: "
        f"'title' (string), 'summary' (2-sentence hook), 'read_time' (e.g. '5 MIN READ'), "
        f"'architecture_flow' (single-line analytical framework using ->), "
        f"'sections' (array of 3 objects with 'heading' and 'body'), "
        f"'takeaway' (1-sentence practical financial/economic takeaway)."
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.7},
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(raw_text)
            parsed["topic"] = topic_code
            parsed["topic_label"] = topic_label
            return parsed
    except Exception as exc:
        print(f"Gemini API call failed ({exc}); using curated fallback.")
        return None

def fallback_post(topic_code: str, topic_label: str, angle: str, idx: int) -> dict:
    return {
        "topic": topic_code,
        "topic_label": topic_label,
        "title": f"Applied {angle}: Analytical Frameworks & Governance (#{idx})",
        "summary": f"A structured breakdown of {angle.lower()} for institutional finance and economic decision-making, combining quantitative rigor with audit-ready governance.",
        "read_time": "5 MIN READ",
        "architecture_flow": "Raw Financial Data -> Ratio & Econometric Diagnostics -> Risk & QC Gate -> Executive Decision",
        "sections": [
            {
                "heading": "Why Empirical Rigor Matters in Financial Decisions",
                "body": f"Applying {angle.lower()} ensures macro volatility and structural shifts are captured before capital or credit limits are committed.",
            },
            {
                "heading": "Quality Checks & Audit-Ready Documentation",
                "body": "Every quantitative output should pass standardized reconciliation and compliance checks to eliminate operational errors.",
            },
            {
                "heading": "Translating Metrics into Executive Action",
                "body": "Clear variance attribution and sensitivity ranges enable stakeholders to act decisively under uncertainty.",
            },
        ],
        "takeaway": f"Combining quantitative economics with disciplined risk governance elevates {topic_label} into dependable decision support.",
    }

def update_feeds(posts: list, today_str: str):
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{SITE_URL}/</loc><lastmod>{today_str}</lastmod><priority>1.0</priority></url>
  <url><loc>{SITE_URL}/tutoring.html</loc><lastmod>{today_str}</lastmod><priority>0.95</priority></url>
  <url><loc>{SITE_URL}/labs.html</loc><lastmod>{today_str}</lastmod><priority>0.9</priority></url>
  <url><loc>{SITE_URL}/blog.html</loc><lastmod>{today_str}</lastmod><priority>0.9</priority></url>
  <url><loc>{SITE_URL}/capabilities.html</loc><lastmod>{today_str}</lastmod><priority>0.8</priority></url>
</urlset>
"""
    with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
        f.write(sitemap_xml)

    items_xml = []
    pub_date = format_datetime(datetime.now(timezone.utc))
    for p in posts[:15]:
        items_xml.append(
            f"""    <item>
      <title><![CDATA[{p['title']}]]></title>
      <link>{SITE_URL}/blog.html#{p['id']}</link>
      <guid>{SITE_URL}/blog.html#{p['id']}</guid>
      <pubDate>{pub_date}</pubDate>
      <description><![CDATA[{p['summary']}]]></description>
    </item>"""
        )

    rss_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Priyanka Saini — Economics, Finance &amp; Risk Analytics Blog</title>
    <link>{SITE_URL}/blog.html</link>
    <description>Articles on credit risk, banking operations, econometrics, and corporate finance.</description>
{chr(10).join(items_xml)}
  </channel>
</rss>
"""
    with open(RSS_FILE, "w", encoding="utf-8") as f:
        f.write(rss_xml)

def main():
    with open(POSTS_FILE, "r", encoding="utf-8-sig") as f:
        posts = json.load(f)

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if any(p.get("date") == today_str for p in posts):
        print(f"Post for {today_str} already exists. Updating feeds only.")
        update_feeds(posts, today_str)
        return

    topic_code, topic_label, angle = TOPICS[len(posts) % len(TOPICS)]
    existing_titles = [p["title"] for p in posts]
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()

    article = call_gemini(api_key, topic_code, topic_label, angle, existing_titles) if api_key else None
    if not article:
        article = fallback_post(topic_code, topic_label, angle, len(posts) + 1)

    new_entry = {
        "id": f"post-{len(posts) + 1:03d}",
        "date": today_str,
        "topic": article["topic"],
        "topic_label": article["topic_label"],
        "read_time": article.get("read_time", "5 MIN READ"),
        "title": article["title"],
        "summary": article["summary"],
        "architecture_flow": article.get("architecture_flow", "Data -> Econometric Model -> Risk Gate -> Output"),
        "sections": article.get("sections", []),
        "takeaway": article.get("takeaway", ""),
    }

    posts.insert(0, new_entry)
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    update_feeds(posts, today_str)
    print(f"Published: {new_entry['title']}")

if __name__ == "__main__":
    main()