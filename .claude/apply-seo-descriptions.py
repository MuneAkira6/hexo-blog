"""Re-apply SEO meta descriptions to post front matter.

Idempotent: posts that already declare a description are left untouched.
Run from the blog root:  python .claude/apply-seo-descriptions.py
"""
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "source", "_posts")
MAP = os.path.join(ROOT, ".claude", "seo-descriptions.json")


def upsert(path, key, value):
    s = io.open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?\n)---\n", s, re.S)
    if not m:
        return "no-front-matter"
    fm, rest = m.group(1), s[m.end():]
    if re.search(r"^%s:" % re.escape(key), fm, re.M):
        return "already-set"
    anchor = re.search(r"^date:.*\n", fm, re.M)
    line = key + ': "' + value + '"\n'
    fm = fm[:anchor.end()] + line + fm[anchor.end():] if anchor else line + fm
    io.open(path, "w", encoding="utf-8", newline="\n").write("---\n" + fm + "---\n" + rest)
    return "added"


def main():
    data = json.load(io.open(MAP, encoding="utf-8"))
    counts = {"added": 0, "already-set": 0, "missing-file": 0, "no-front-matter": 0}
    for name, desc in data.items():
        path = os.path.join(POSTS, name)
        if not os.path.exists(path):
            counts["missing-file"] += 1
            print("missing:", name)
            continue
        assert '"' not in desc and "\\" not in desc, name
        counts[upsert(path, "description", desc)] += 1

    for name in sorted(os.listdir(POSTS)):
        if name.endswith(".md"):
            s = io.open(os.path.join(POSTS, name), encoding="utf-8").read()
            if not re.search(r"^description:", s, re.M):
                print("STILL MISSING:", name)
    print(counts)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
