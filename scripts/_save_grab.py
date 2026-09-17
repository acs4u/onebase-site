import json,base64,sys,os,glob
files=sorted(glob.glob('/root/.claude/projects/-home-claude/593e8329-736d-5fe0-866f-ad341cf2bfcd/tool-results/mcp-remote-devices-Claude_Browser__javascript_tool-*.txt'))
f=files[-1]; txt=json.load(open(f))[0]['text']
if 'truncated' in txt[-300:]: print('TRUNCATED', len(txt)); sys.exit(1)
d=json.loads(txt[:txt.rindex('}')+1]); out='/home/claude/onebase-site/public/images/src'
for k,v in d.items():
    if not v.startswith('data:'): print('ERR',k,v[:80]); continue
    b=base64.b64decode(v.split(',',1)[1]); open(f'{out}/{k}.jpg','wb').write(b); print(k, len(b)//1024,'KB')
