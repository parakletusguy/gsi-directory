from pathlib import Path
import re

text = Path('index.html').read_text('utf-8')
start = text.find('<script type="__bundler/template">')
if start == -1:
    raise SystemExit('no template')
end = text.rfind('</script>')
if end == -1 or end <= start:
    raise SystemExit('no template close')
inner = text[start + len('<script type="__bundler/template">'):end]
print('template len', len(inner))
print('count </script> in template', inner.count('</script>'))
for match in re.finditer(r'src=\\"([^\\"]+)\\"', inner):
    print('src attr content repr', repr(match.group(1)))
    print('src attr full', repr(inner[match.start()-20:match.end()+20]))
    break
print('first 200 chars of template:', repr(inner[:200]))
print('last 200 chars of template:', repr(inner[-200:]))
