from pathlib import Path
import json
import re

text = Path('index.html').read_text('utf-8')
manifest_key = '<script type="__bundler/manifest">'
template_key = '<script type="__bundler/template">'
start_manifest = text.index(manifest_key) + len(manifest_key)
end_manifest = text.index('</script>', start_manifest)
manifest_json = text[start_manifest:end_manifest]
manifest = json.loads(manifest_json)
start_template = text.index(template_key) + len(template_key)
end_template = text.rfind('</script>')
# use final closing tag, assuming only last one is template close
template_json = text[start_template:end_template]
template = json.loads(template_json)

print('manifest entries', len(manifest))
for key in ['6586de86-3427-40ec-a065-e507361b73d2','b7674a38-ef4e-4002-b040-91ca34aa07a1','26465d42-c5e6-40a1-af50-28ce7b1f35f0']:
    print('key', key, 'in manifest', key in manifest)

# simulate blob URLs
blobUrls = {uuid: f'blob:{uuid}' for uuid in manifest}
new_template = template
for uuid in blobUrls:
    new_template = new_template.replace(uuid, blobUrls[uuid])

# display the problem occurrences
for uuid in ['6586de86-3427-40ec-a065-e507361b73d2','b7674a38-ef4e-4002-b040-91ca34aa07a1','26465d42-c5e6-40a1-af50-28ce7b1f35f0']:
    idx = new_template.find(uuid)
    print('after replace', uuid, 'exists', idx != -1, 'first idx', idx)
    if idx != -1:
        print('context', repr(new_template[idx-40:idx+40]))

# check if raw quotes may remain
for match in re.finditer(r'src="([^"]+)"', new_template):
    src = match.group(1)
    if '%22' in src or src.startswith('"') or src.endswith('"'):
        print('bad src attr', repr(src), 'context', repr(new_template[match.start()-40:match.end()+40]))
