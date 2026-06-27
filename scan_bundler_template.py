from pathlib import Path
import json
import re
text = Path('index.html').read_text('utf-8')
start = text.find('<script type="__bundler/template">')
end = text.rfind('</script>')
if start == -1 or end == -1 or end <= start:
    raise SystemExit('template block not found')
inner = text[start + len('<script type="__bundler/template">'):end]
parsed = json.loads(inner)
print('parsed len', len(parsed))
for match in re.finditer(r'<script\s+[^>]*src=["\']([^"\']+)["\']', parsed):
    src = match.group(1)
    print('src=', repr(src), 'full=', repr(parsed[match.start():match.end()]))
for match in re.finditer(r'src=\"([^\"]+)\"', inner):
    print('raw-inner src', repr(match.group(1)))
if '%22' in parsed:
    print('contains %22')
