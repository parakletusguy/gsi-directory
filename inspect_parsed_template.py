from pathlib import Path
import json
import re
text = Path('index.html').read_text('utf-8')
start = text.find('<script type="__bundler/template">')
if start == -1:
    raise SystemExit('no template start')
end = text.rfind('</script>')
if end == -1 or end <= start:
    raise SystemExit('no template close')
inner = text[start + len('<script type="__bundler/template">'):end]
print('raw first char', repr(inner[:5]))
try:
    parsed = json.loads(inner)
except Exception as e:
    raise
print('parsed type', type(parsed), 'len', len(parsed))
script_srcs = re.findall(r'<script\s+[^>]*src=["\']([^"\']+)["\']', parsed)
for idx, src in enumerate(script_srcs, 1):
    print('script', idx, repr(src))

# inspect any bad URLs
for src in script_srcs:
    if src.startswith('"') or src.endswith('"') or '%22' in src:
        print('bad src found', repr(src))

print('first 200 chars', repr(parsed[:200]))
print('last 200 chars', repr(parsed[-200:]))
