/* ===== Room planner v2: your space → your equipment → your business =====
   Real room dimensions and door, top-down product drawings you can drag, rotate, resize and remove,
   access and door-swing checks, site requirements from the product specs, share link and printable drawing. */
Object.assign(CAT, {
  TR4:{p:'traditional',s:'4-person',m:'heat',w:72,d:60,n:4,cyc:45,img:'trad-after',custom:true},
  TR8:{p:'traditional',s:'8-person',m:'heat',w:96,d:84,n:8,cyc:45,img:'trad-after',custom:true},
});
const PZ_FAM = { icevault:['IV2','IV4','IV8'], yakisugi:['YK2','YK4','YK8'], hemlock:['HM4'], traditional:['TR4','TR8'], airfit:['AFT'], airform:['AFP'], airsuite:['AS2'], lightbed:['LB'], lightpanel:['LP4'] };
const PZ_TRAY = [['air',['airform','airfit','airsuite']],['ice',['icevault']],['heat',['yakisugi','traditional','hemlock']],['light',['lightbed','lightpanel']]];
const PZ_THUMB = { icevault:'cut-icevault-quad', yakisugi:'cut-yakisugi', hemlock:'cut-hemlock', traditional:'trad-after', airfit:'cut-airfit', airform:'cut-airform-plus-black', airsuite:'canva-airsuite-duo', lightbed:'cut-lightbed-black', lightpanel:'cut-lightpanel-quad' };
// Site requirements, taken from each product's published electrical specs. Nothing here is invented: unknowns say "confirmed at quote".
const PZ_REQ = {
  icevault:{ power:'240 V single-phase supply', plumb:'none', height:'95″ tall, 115″ with the monoblock. Allow at least 10 ft ceiling.' },
  yakisugi:{ power:'Standard outlet. Circuit rating confirmed by size at quote', plumb:'none' },
  hemlock:{ power:'220–240 V single-phase, 15 A+ breaker (3,000 W)' },
  traditional:{ power:'Supply confirmed at design to suit the heater and your site' },
  airfit:{ power:'2 standard wall plugs per chamber (1,400 W compressor + 300 W air conditioner)' },
  airform:{ power:'2 standard wall plugs per chamber (1,400 W compressor + 300 W air conditioner)' },
  airsuite:{ power:'Confirmed at quote' },
  lightbed:{ power:'240 V supply (6,500 W)' },
  lightpanel:{ power:'100–240 V outlet (1,520 W for the Quad)' },
};
const PZ_PRESETS = [['Small studio',20,15],['Gym corner',30,20],['Recovery floor',40,30],['Hotel spa suite',25,18]];
const ACCESS = 3, DOORW = 3;
const P2 = { step:1, W:30, Dp:20, door:{wall:'b', t:.82}, venue:'studio', units:[], sel:null, hours:12, price:45, util:35, metric:false, seeded:false, sent:false };
let pzUid = 1;

const pzName = (code) => prodName(CAT[code]);
const pzShort = (code) => { const c=CAT[code]; const p=D.products.find(x=>x.id===c.p); return (p?p.name:c.p).replace('Custom ','') + (c.s?' '+c.s:''); };
const pzDims = (u) => { const c=CAT[u.code]; const bw=c.w/12, bd=c.d/12; return u.r%180 ? {w:bd,h:bw,bw,bd} : {w:bw,h:bd,bw,bd}; };
const pzLen = (ft) => P2.metric ? (ft*0.3048).toFixed(1)+' m' : (Math.round(ft*10)/10)+' ft';
const pzArea = () => P2.metric ? fmt(P2.W*P2.Dp*0.0929)+' m²' : fmt(P2.W*P2.Dp)+' sq ft';
const ov = (a,b) => Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x) > .01 && Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y) > .01;
function pzRect(u){ const d=pzDims(u); return {x:u.x,y:u.y,w:d.w,h:d.h}; }
function pzAccess(u){ const r=pzRect(u); switch(u.r){ case 90: return {x:r.x-ACCESS,y:r.y,w:ACCESS,h:r.h}; case 180: return {x:r.x,y:r.y-ACCESS,w:r.w,h:ACCESS}; case 270: return {x:r.x+r.w,y:r.y,w:ACCESS,h:r.h}; default: return {x:r.x,y:r.y+r.h,w:r.w,h:ACCESS}; } }
function pzDoor(){ const {wall,t}=P2.door; const L=(wall==='t'||wall==='b')?P2.W:P2.Dp; const c=Math.min(Math.max(t*L,DOORW/2),L-DOORW/2);
  if (wall==='b') return {x:c-DOORW/2,y:P2.Dp-DOORW,w:DOORW,h:DOORW,c,wall}; if (wall==='t') return {x:c-DOORW/2,y:0,w:DOORW,h:DOORW,c,wall};
  if (wall==='l') return {x:0,y:c-DOORW/2,w:DOORW,h:DOORW,c,wall}; return {x:P2.W-DOORW,y:c-DOORW/2,w:DOORW,h:DOORW,c,wall}; }
function pzIssues(units=P2.units){
  const door=pzDoor(); const out={};
  units.forEach(u=>{ const r=pzRect(u), a=pzAccess(u); const is=[];
    if (units.some(o=>o!==u && ov(r,pzRect(o)))) is.push('clash');
    if (r.x<-.01||r.y<-.01||r.x+r.w>P2.W+.01||r.y+r.h>P2.Dp+.01) is.push('out');
    if (a.x<-.01||a.y<-.01||a.x+a.w>P2.W+.01||a.y+a.h>P2.Dp+.01||units.some(o=>o!==u && ov(a,pzRect(o)))) is.push('access');
    if (ov(r,door)) is.push('door');
    out[u.id]=is; });
  return out;
}
function pzClamp(u){ const d=pzDims(u); u.x=Math.min(Math.max(0,u.x),Math.max(0,P2.W-d.w)); u.y=Math.min(Math.max(0,u.y),Math.max(0,P2.Dp-d.h)); }
function pzFree(code){
  const base=pzIssues(); const n0=Object.values(base).reduce((a,x)=>a+x.length,0);
  for (const r of [0,180,90,270]) for (let y=0; y<=P2.Dp; y+=.5) for (let x=0; x<=P2.W; x+=.5) {
    const u={id:-1,code,x,y,r}; const d=pzDims(u); if (x+d.w>P2.W||y+d.h>P2.Dp) continue;
    const is=pzIssues(P2.units.concat(u)); if (!is[-1].length && Object.entries(is).reduce((a,[k,x])=>a+(k==='-1'?0:x.length),0)<=n0) return u; }
  return null;
}
function pzSuggest(){
  const v=VENUES[P2.venue]; const area=P2.W*P2.Dp; const tier=area<350?0:area<800?1:2;
  let list=[]; v.def.forEach(m=>{ const x=v.t[m][tier]; list=list.concat(Array.isArray(x)?x:[x]); });
  const down={ IV8:'IV4', IV4:'IV2', YK8:'YK4', YK4:'YK2', AS2:'AFP', LB:'LP4', HM4:'YK2' };
  for (let guard=0; guard<40 && list.length; guard++) {
    const units=pzPerimeter(list); if (units) { P2.units=units; P2.sel=null; return; }
    let changed=false; for (let i=list.length-1;i>=0;i--) if (down[list[i]]) { list[i]=down[list[i]]; changed=true; break; }
    if (!changed) list.pop();
  }
  P2.units=[];
}
// Lay equipment around the walls, facing into the room, spaced evenly, keeping the door and a shared central aisle clear.
function pzPerimeter(codes){
  const inset=.5, gap=1, door=pzDoor(), dpad=.75;
  const items=codes.map((c,i)=>({code:c,i,len:CAT[c].w/12,dep:CAT[c].d/12,m:CAT[c].m})).sort((a,b)=>b.len-a.len);
  const segs=(wall,a,b)=>{ if (b-a<1) return []; if (door.wall!==wall) return [[a,b]]; const d0=door.c-DOORW/2-dpad, d1=door.c+DOORW/2+dpad; return [[a,Math.min(b,d0)],[Math.max(a,d1),b]].filter(([x,y])=>y-x>=1); };
  const walls={ t:{segs:segs('t',inset,P2.W-inset),items:[]}, b:{segs:segs('b',inset,P2.W-inset),items:[]} };
  const room=(w)=>w.segs.reduce((a,[x,y])=>a+(y-x),0)-w.items.reduce((a,it)=>a+it.len+gap,0);
  const tryPlace=(ws,it)=>{ const c=ws.filter(w=>room(w)>=it.len+(w.items.length?gap:0)).sort((a,b)=>room(b)-room(a))[0]; if (!c) return false; c.items.push(it); return true; };
  const rest=[]; items.forEach(it=>{ if (!tryPlace([walls.t,walls.b],it)) rest.push(it); });
  const depth=(w)=>w.items.reduce((a,it)=>Math.max(a,it.dep),0);
  const y0=inset+depth(walls.t)+ACCESS+.25, y1=P2.Dp-inset-depth(walls.b)-ACCESS-.25;
  walls.l={segs:segs('l',y0,y1),items:[]}; walls.r={segs:segs('r',y0,y1),items:[]};
  for (const it of rest) if (!tryPlace([walls.l,walls.r],it)) return null;
  const order={air:0,ice:1,heat:2,light:3}; const units=[];
  for (const [k,w] of Object.entries(walls)) {
    const its=w.items.sort((a,b)=>order[a.m]-order[b.m]||b.len-a.len); let si=0;
    // fill segments in order, then spread each segment's units evenly
    const bySeg=w.segs.map(()=>[]); for (const it of its) { while (si<w.segs.length && bySeg[si].reduce((a,x)=>a+x.len+gap,0)+it.len > w.segs[si][1]-w.segs[si][0]) si++; if (si>=w.segs.length) return null; bySeg[si].push(it); }
    bySeg.forEach((g,idx)=>{ if (!g.length) return; const [a,b]=w.segs[idx]; const used=g.reduce((s,x)=>s+x.len,0); const sp=Math.min(3,(b-a-used)/(g.length+1)); const total=used+sp*(g.length-1); let pos=a+(b-a-total)/2;
      g.forEach(it=>{ const r={t:0,b:180,l:270,r:90}[k]; let x,y; const L=it.len,Dd=it.dep;
        if (k==='t'){ x=pos; y=inset; } else if (k==='b'){ x=pos; y=P2.Dp-inset-Dd; } else if (k==='l'){ x=inset; y=pos; } else { x=P2.W-inset-Dd; y=pos; }
        units.push({id:pzUid++,code:it.code,r,x:Math.round(x*4)/4,y:Math.round(y*4)/4}); pos+=L+sp; }); });
  }
  const is=pzIssues(units); return units.every(u=>!is[u.id].length) ? units : null;
}

/* ---------- Drawing ---------- */
const PZ_SC = 20;
function pzUnitArt(code, bw, bd){ // local frame, px; front edge is the bottom (y = bd)
  const c=CAT[code], k=MODC[c.m], s=v=>v*PZ_SC, W=s(bw), H=s(bd), in1=Math.min(W,H)*.08;
  const line=(x1,y1,x2,y2,o=.5,w=1)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}"/>`;
  const doorGap=(dw)=>`<rect x="${W/2-dw/2}" y="${H-3}" width="${dw}" height="6" fill="${k.glow}"/>`;
  if (c.p==='icevault') return `<rect width="${W}" height="${H}" rx="4" fill="${k.deep}" stroke="${k.glow}" stroke-width="1.5"/>
    <rect x="${in1}" y="${in1}" width="${W-2*in1}" height="${H-2*in1}" rx="2" fill="none" stroke="${k.soft}" stroke-opacity=".35"/>
    <rect x="${in1}" y="${in1}" width="${W-2*in1}" height="${s(1.4)}" fill="${k.glow}" fill-opacity=".35"/>
    <rect x="${W*.3}" y="${H*.38}" width="${W*.4}" height="${H*.26}" rx="2" fill="none" stroke="${k.soft}" stroke-opacity=".4" stroke-dasharray="3 3"/>${doorGap(Math.min(s(2.6),W*.5))}`;
  if (c.p==='yakisugi'||c.p==='hemlock'||c.p==='traditional') {
    const wood = c.p==='yakisugi'?'#2b2420':c.p==='hemlock'?'#c89f6c':'#9a6238'; const bench = c.p==='yakisugi'?'#6b4a3a':c.p==='hemlock'?'#e2c59a':'#c98c5a';
    const b=s(1.6); const heater = c.p==='traditional' ? `<rect x="${W-in1-s(1.5)}" y="${H-in1-s(1.5)}" width="${s(1.3)}" height="${s(1.3)}" rx="2" fill="#555" stroke="#e6886a"/><circle cx="${W-in1-s(.85)}" cy="${H-in1-s(.85)}" r="${s(.35)}" fill="#e6886a" fill-opacity=".8"/>` : `<rect x="${in1}" y="${H*.45}" width="${s(.25)}" height="${H*.3}" fill="#e6886a" fill-opacity=".85"/><rect x="${W-in1-s(.25)}" y="${H*.45}" width="${s(.25)}" height="${H*.3}" fill="#e6886a" fill-opacity=".85"/>`;
    return `<rect width="${W}" height="${H}" rx="3" fill="${wood}" stroke="#e6886a" stroke-width="1.5"/>
    <rect x="${in1}" y="${in1}" width="${W-2*in1}" height="${b}" fill="${bench}"/>${c.p==='traditional'?`<rect x="${in1}" y="${in1}" width="${b}" height="${H*.62}" fill="${bench}"/>`:''}
    ${[1,2,3].map(i=>line(in1,in1+b*i/3.2,W-in1,in1+b*i/3.2,.18)).join('')}${heater}${doorGap(Math.min(s(2.2),W*.45))}`; }
  if (c.p==='airfit'||c.p==='airform') { const r=H/2;
    return `<rect width="${W}" height="${H}" rx="${r}" fill="${k.deep}" stroke="${k.glow}" stroke-width="1.5"/>
    <rect x="${W*.12}" y="${H*.2}" width="${W*.76}" height="${H*.6}" rx="${H*.3}" fill="none" stroke="${k.soft}" stroke-opacity=".35"/>
    ${[.3,.5,.7].map(f=>line(W*f,H*.12,W*f,H*.88,.22)).join('')}<circle cx="${W*.9}" cy="${H/2}" r="${H*.13}" fill="none" stroke="${k.soft}" stroke-opacity=".6"/>`; }
  if (c.p==='airsuite') return `<rect width="${W}" height="${H}" rx="${Math.min(W,H)*.22}" fill="${k.deep}" stroke="${k.glow}" stroke-width="1.5"/>
    ${[.3,.7].map(f=>`<rect x="${W*f-s(.9)}" y="${H*.18}" width="${s(1.8)}" height="${s(1.8)}" rx="5" fill="${k.glow}" fill-opacity=".45"/>`).join('')}${doorGap(Math.min(s(2.4),W*.4))}`;
  if (c.p==='lightbed') { const r=H/2.2;
    return `<rect width="${W}" height="${H}" rx="${r}" fill="#26141a" stroke="${k.glow}" stroke-width="1.5"/>
    <rect x="${W*.06}" y="${H*.14}" width="${W*.88}" height="${H*.72}" rx="${r*.8}" fill="${k.acc}" fill-opacity=".55"/>${line(W*.06,H/2,W*.94,H/2,.45,1.2)}`; }
  // light panel quad: four panels around a standing position
  return `<rect width="${W}" height="${H}" rx="3" fill="#26141a" fill-opacity=".6" stroke="${k.glow}" stroke-opacity=".6" stroke-dasharray="4 3"/>
    ${[[.08,.1,.84,.12],[.08,.1,.12,.8],[.8,.1,.12,.8],[.08,.78,.3,.12]].map(([x,y,w,h])=>`<rect x="${W*x}" y="${H*y}" width="${W*w}" height="${H*h}" rx="2" fill="${k.acc}" stroke="${k.glow}"/>`).join('')}`;
}
function pzSVG(opts={}){
  const {dark=true, interactive=true} = opts; const pad=2.2, sc=PZ_SC; const W=P2.W, H=P2.Dp; const vw=(W+pad*2)*sc, vh=(H+pad*2)*sc;
  const ink = dark?'#fff':'#1f1f1f', bg = dark?'#161617':'#fff'; const is = pzIssues(); const door=pzDoor();
  const X=v=>((pad+v)*sc).toFixed(1);
  const grid=[]; for (let i=1;i<W;i++) grid.push(`<line x1="${X(i)}" y1="${X(0)}" x2="${X(i)}" y2="${X(H)}" stroke-opacity="${i%5?.06:.13}"/>`); for (let j=1;j<H;j++) grid.push(`<line x1="${X(0)}" y1="${X(j)}" x2="${X(W)}" y2="${X(j)}" stroke-opacity="${j%5?.06:.13}"/>`);
  const access = P2.units.map(u=>{ const a=pzAccess(u); const bad=is[u.id].includes('access'); return `<rect x="${X(a.x)}" y="${X(a.y)}" width="${(a.w*sc).toFixed(1)}" height="${(a.h*sc).toFixed(1)}" fill="${bad?'#e0a33a':ink}" fill-opacity="${bad?.22:.045}" stroke="${bad?'#e0a33a':ink}" stroke-opacity="${bad?.7:.14}" stroke-dasharray="4 4"/>`; }).join('');
  const units = P2.units.map(u=>{ const d=pzDims(u); const bad=is[u.id]; const cls=bad.includes('clash')||bad.includes('out')?'bad':bad.length?'warn':''; const sel=P2.sel===u.id;
    const lbl=pzShort(u.code); const minS=Math.min(d.w,d.h)*sc; const vert=d.h>d.w*1.4; const fs=Math.max(8,Math.min(13,(vert?d.h:d.w)*sc/(lbl.length*.62), minS*.32));
    return `<g class="pz-u ${cls}${sel?' sel':''}" data-u="${u.id}" transform="translate(${X(u.x)} ${X(u.y)})" tabindex="-1">
      <g transform="translate(${(d.w*sc/2).toFixed(1)} ${(d.h*sc/2).toFixed(1)}) rotate(${u.r}) translate(${(-d.bw*sc/2).toFixed(1)} ${(-d.bd*sc/2).toFixed(1)})">${pzUnitArt(u.code,d.bw,d.bd)}</g>
      <rect class="pz-hit" width="${(d.w*sc).toFixed(1)}" height="${(d.h*sc).toFixed(1)}" rx="4" fill="transparent"/>
      ${interactive||1?`<text x="${(d.w*sc/2).toFixed(1)}" y="${(d.h*sc/2).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="${fs.toFixed(1)}" font-weight="500" fill="#fff" paint-order="stroke" stroke="rgba(0,0,0,.55)" stroke-width="3"${vert?` transform="rotate(-90 ${(d.w*sc/2).toFixed(1)} ${(d.h*sc/2).toFixed(1)})"`:''}>${esc(lbl)}</text>`:''}
    </g>`; }).join('');
  // door: gap in the wall, swing arc, drag handle
  const dw=DOORW*sc; let gap, arc, hx, hy;
  if (door.wall==='b'){ gap=[X(door.c-DOORW/2),X(H),X(door.c+DOORW/2),X(H)]; arc=`M${X(door.c-DOORW/2)} ${X(H)} L${X(door.c-DOORW/2)} ${X(H-DOORW)} A${dw} ${dw} 0 0 1 ${X(door.c+DOORW/2)} ${X(H)}`; hx=X(door.c); hy=((pad+H)*sc+14).toFixed(1); }
  else if (door.wall==='t'){ gap=[X(door.c-DOORW/2),X(0),X(door.c+DOORW/2),X(0)]; arc=`M${X(door.c-DOORW/2)} ${X(0)} L${X(door.c-DOORW/2)} ${X(DOORW)} A${dw} ${dw} 0 0 0 ${X(door.c+DOORW/2)} ${X(0)}`; hx=X(door.c); hy=(pad*sc-14).toFixed(1); }
  else if (door.wall==='l'){ gap=[X(0),X(door.c-DOORW/2),X(0),X(door.c+DOORW/2)]; arc=`M${X(0)} ${X(door.c-DOORW/2)} L${X(DOORW)} ${X(door.c-DOORW/2)} A${dw} ${dw} 0 0 1 ${X(0)} ${X(door.c+DOORW/2)}`; hx=(pad*sc-14).toFixed(1); hy=X(door.c); }
  else { gap=[X(W),X(door.c-DOORW/2),X(W),X(door.c+DOORW/2)]; arc=`M${X(W)} ${X(door.c-DOORW/2)} L${X(W-DOORW)} ${X(door.c-DOORW/2)} A${dw} ${dw} 0 0 0 ${X(W)} ${X(door.c+DOORW/2)}`; hx=((pad+W)*sc+14).toFixed(1); hy=X(door.c); }
  const doorBad = P2.units.some(u=>is[u.id].includes('door'));
  const doorSVG = `<line x1="${gap[0]}" y1="${gap[1]}" x2="${gap[2]}" y2="${gap[3]}" stroke="${bg}" stroke-width="6"/><path d="${arc}" fill="${doorBad?'#e0a33a':ink}" fill-opacity="${doorBad?.18:.05}" stroke="${doorBad?'#e0a33a':ink}" stroke-opacity=".55" stroke-width="1"/>
    ${interactive?`<g class="pz-door" data-door="1"><circle cx="${hx}" cy="${hy}" r="13" fill="${ink}" fill-opacity=".12"/><circle cx="${hx}" cy="${hy}" r="8" fill="${ink}"/><text x="${hx}" y="${hy}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="600" fill="${bg}">⇆</text><title>Drag to move the door</title></g>`:''}
    <text x="${hx}" y="${door.wall==='b'?(+hy+(interactive?27:4)).toFixed(1):door.wall==='t'?(+hy-(interactive?20:0)).toFixed(1):(+hy+(interactive?26:4)).toFixed(1)}" text-anchor="middle" font-size="10" fill="${ink}" fill-opacity=".55">Door</text>`;
  return `<svg class="pz-svg" id="pz-svg" viewBox="0 0 ${vw.toFixed(1)} ${vh.toFixed(1)}" role="img" aria-label="Floor plan, ${pzLen(W)} by ${pzLen(H)}" ${interactive?'tabindex="0"':''}>
    <rect x="${X(0)}" y="${X(0)}" width="${(W*sc).toFixed(1)}" height="${(H*sc).toFixed(1)}" fill="${ink}" fill-opacity="${dark?.025:0}"/>
    <g stroke="${ink}" stroke-width=".7">${grid.join('')}</g>${access}
    <rect x="${X(0)}" y="${X(0)}" width="${(W*sc).toFixed(1)}" height="${(H*sc).toFixed(1)}" fill="none" stroke="${ink}" stroke-opacity=".85" stroke-width="4"/>
    ${doorSVG}${units}
    <g fill="${ink}" fill-opacity=".6" font-size="11"><text x="${X(W/2)}" y="${(pad*sc-26).toFixed(1)}" text-anchor="middle">${pzLen(W)}</text>
    <line x1="${X(0)}" y1="${(pad*sc-20).toFixed(1)}" x2="${X(W)}" y2="${(pad*sc-20).toFixed(1)}" stroke="${ink}" stroke-opacity=".3"/>
    <text x="${((pad+W)*sc+30).toFixed(1)}" y="${X(H/2)}" text-anchor="middle" transform="rotate(90 ${((pad+W)*sc+30).toFixed(1)} ${X(H/2)})">${pzLen(H)}</text></g>
  </svg>`;
}

/* ---------- Numbers ---------- */
function pzStats(){
  const L=P2.units.map(u=>CAT[u.code]);
  const people=L.reduce((a,c)=>a+c.n,0); const sessions=L.reduce((a,c)=>a+c.n*Math.floor(P2.hours*60/c.cyc),0);
  const used=L.reduce((a,c)=>a+c.w*c.d/144,0); const daily=sessions*P2.util/100; const monthly=daily*P2.price*30;
  return {people,sessions,used,daily,monthly,pct:P2.W*P2.Dp?used/(P2.W*P2.Dp)*100:0};
}
function pzCounts(){ const c={}; P2.units.forEach(u=>c[u.code]=(c[u.code]||0)+1); return c; }
function pzWarnings(){
  const is=pzIssues(); const w=[]; const by=(t)=>[...new Set(P2.units.filter(u=>is[u.id].includes(t)).map(u=>pzShort(u.code)))];
  const cl=by('clash'); if (cl.length) w.push(['bad',`Overlapping: ${cl.join(', ')}. Drag them apart.`]);
  const ac=by('access'); if (ac.length) w.push(['warn',`Needs ${pzLen(ACCESS)} clear in front to get in and out: ${ac.join(', ')}. Rotate or move it.`]);
  const dr=by('door'); if (dr.length) w.push(['warn',`In the door swing: ${dr.join(', ')}.`]);
  return w;
}
function pzReqHTML(){
  const ids=[...new Set(P2.units.map(u=>CAT[u.code].p))]; if (!ids.length) return '<p class="note">Add equipment to see what your site needs.</p>';
  const counts={}; P2.units.forEach(u=>{ const p=CAT[u.code].p; counts[p]=(counts[p]||0)+1; });
  const rows=ids.map(p=>{ const r=PZ_REQ[p]||{}; const pr=D.products.find(x=>x.id===p); return `<li><b>${esc('OneBase '+(pr?pr.name:p))}${counts[p]>1?` × ${counts[p]}`:''}</b><span>${esc(r.power||'Confirmed at quote')}${r.height?`<br>${esc(r.height)}`:''}</span></li>`; }).join('');
  const dry=ids.filter(p=>PZ_REQ[p]&&PZ_REQ[p].plumb==='none').map(p=>(D.products.find(x=>x.id===p)||{}).name);
  return `<ul class="pz-req">${rows}</ul>${dry.length?`<p class="note">No plumbing or drainage needed for ${dry.join(' or ')}.</p>`:''}<p class="note">Our team confirms circuits, ventilation and floor loading with you before anything ships.</p>`;
}
function pzSummary(){
  const s=pzStats(); const v=VENUES[P2.venue];
  return `Venue: ${v.l}\nRoom: ${pzLen(P2.W)} × ${pzLen(P2.Dp)} (${pzArea()})\nEquipment: ${Object.entries(pzCounts()).map(([c,q])=>q+' × '+pzName(c)).join(', ')||'none'}\nPeople at once: ${s.people} · Session capacity: ${fmt(s.sessions)}/day\nHours: ${P2.hours}/day · Price: ${P2.price?('US$'+P2.price):'membership'} · Utilisation: ${P2.util}%\nPlan link: ${pzLink()}`;
}
function pzEncode(){ return btoa(JSON.stringify({W:P2.W,D:P2.Dp,d:[P2.door.wall,+P2.door.t.toFixed(3)],v:P2.venue,u:P2.units.map(u=>[u.code,+u.x.toFixed(2),+u.y.toFixed(2),u.r]),h:P2.hours,p:P2.price,t:P2.util,m:P2.metric?1:0})).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function pzDecode(s){ try { const o=JSON.parse(atob(s.replace(/-/g,'+').replace(/_/g,'/'))); Object.assign(P2,{W:o.W,Dp:o.D,door:{wall:o.d[0],t:o.d[1]},venue:VENUES[o.v]?o.v:'studio',hours:o.h,price:o.p,util:o.t,metric:!!o.m,seeded:true,step:2});
  P2.units=o.u.filter(x=>CAT[x[0]]).map(x=>({id:pzUid++,code:x[0],x:x[1],y:x[2],r:x[3]})); return true; } catch(e){ return false; } }
function pzLink(){ return location.href.split('#')[0]+'#/planner/'+pzEncode(); }

/* ---------- Panel ---------- */
function pzNum(id,val,min,max,step){ const disp=P2.metric?(val*0.3048).toFixed(1):val; return `<div class="pz-num"><button type="button" data-num="${id}" data-d="-1" aria-label="Decrease">−</button><input id="pz-${id}" inputmode="decimal" value="${disp}" aria-label="${id==='W'?'Width':'Depth'}"><span>${P2.metric?'m':'ft'}</span><button type="button" data-num="${id}" data-d="1" aria-label="Increase">+</button></div>`; }
function pzPanel(){
  const s=pzStats(); const steps=['Your space','Your equipment','Your business'];
  const nav=`<ol class="pz-steps">${steps.map((t,i)=>`<li><button type="button" data-step="${i+1}" aria-current="${P2.step===i+1?'step':'false'}" class="${P2.step>i+1?'done':''}"><i>${i+1}</i>${t}</button></li>`).join('')}</ol>`;
  let body='';
  if (P2.step===1) body = `<h3>How big is the room?</h3><p class="muted small">Measure wall to wall. Then drag the door handle on the plan to where your door is.</p>
    <div class="pz-dims"><label>Width${pzNum('W',P2.W)}</label><label>Depth${pzNum('Dp',P2.Dp)}</label></div>
    <div class="pz-row"><span class="note">${pzArea()}</span><div class="pz-seg" role="group" aria-label="Units"><button type="button" data-metric="0" aria-pressed="${!P2.metric}">ft</button><button type="button" data-metric="1" aria-pressed="${P2.metric}">m</button></div></div>
    <p class="pz-lab">Or start from a typical room</p><div class="chips">${PZ_PRESETS.map(([l,w,d])=>`<button type="button" class="chip" data-preset="${w}x${d}" aria-pressed="${P2.W===w&&P2.Dp===d}">${l} · ${P2.metric?`${(w*.3048).toFixed(0)}×${(d*.3048).toFixed(0)} m`:`${w}×${d} ft`}</button>`).join('')}</div>
    <p class="pz-lab">What kind of venue?</p><div class="chips">${Object.entries(VENUES).map(([k,v])=>`<button type="button" class="chip" data-venue="${k}" aria-pressed="${P2.venue===k}">${v.l}</button>`).join('')}</div>
    <div class="pz-foot"><button type="button" class="btn btn-p" data-go="2">Suggest equipment →</button></div>`;
  if (P2.step===2) { const is=pzIssues();
    const list=P2.units.map(u=>{ const c=CAT[u.code]; const fam=PZ_FAM[c.p]||[u.code]; const bad=is[u.id];
      return `<li class="${P2.sel===u.id?'sel':''} ${bad.includes('clash')||bad.includes('out')?'pz-lb':bad.length?'pz-lw':''}" data-pick="${u.id}"><i style="background:${MODC[c.m].acc||MODC[c.m].glow}"></i><span><b>${esc(pzShort(u.code))}</b><small>${c.n} ${c.n>1?'people':'person'} · ${pzLen(c.w/12)} × ${pzLen(c.d/12)}${c.custom?' · built to fit':''}</small></span>
        ${fam.length>1?`<select data-size="${u.id}" aria-label="Size">${fam.map(f=>`<option value="${f}" ${f===u.code?'selected':''}>${CAT[f].s}</option>`).join('')}</select>`:'<span></span>'}
        <button type="button" data-rot="${u.id}" aria-label="Rotate">⟳</button><button type="button" data-del="${u.id}" aria-label="Remove">×</button></li>`; }).join('');
    const tray=PZ_TRAY.map(([m,ids])=>`<div class="pz-tray-g"><p style="--c:${MODC[m].acc||MODC[m].glow}">${D.modalities[m].label}</p><div>${ids.map(p=>{ const pr=D.products.find(x=>x.id===p); const code=PZ_FAM[p][Math.min(1,PZ_FAM[p].length-1)]; const im=D.img[PZ_THUMB[p]]; return `<button type="button" data-add="${code}"><span class="th">${im?`<img src="${im}" alt="">`:''}</span><span>${esc(pr?pr.name:p)}</span><em>+</em></button>`; }).join('')}</div></div>`).join('');
    body = `<h3>Your equipment</h3>
    <p class="muted small">Drag to move. Tap to select, then rotate, resize or remove. The shaded strip is the space needed to get in and out. <button type="button" class="pz-link" data-suggest="1">Re-suggest for a ${esc(VENUES[P2.venue].l.toLowerCase())}</button></p>
    ${P2.units.length?`<ul class="pz-list">${list}</ul>`:'<p class="note" style="margin:10px 0">No equipment yet. Add some below, or re-suggest.</p>'}
    <p class="pz-lab">Add equipment</p><div class="pz-tray">${tray}</div>
    <div class="pz-foot"><button type="button" class="btn btn-g" data-go="1">← Space</button><button type="button" class="btn btn-p" data-go="3">See the numbers →</button></div>`; }
  if (P2.step===3) body = `<h3>What could it deliver?</h3>
    <div class="pz-sl"><label>Hours open a day <output>${pzOut('hours')}</output></label><input class="rng" type="range" data-rng="hours" min="4" max="18" step="1" value="${P2.hours}"></div>
    <div class="pz-sl"><label>Price per session <output>${pzOut('price')}</output></label><input class="rng" type="range" data-rng="price" min="0" max="150" step="5" value="${P2.price}"></div>
    <div class="pz-sl"><label>Expected utilisation <output>${pzOut('util')}</output></label><input class="rng" type="range" data-rng="util" min="10" max="80" step="5" value="${P2.util}"></div>
    <div id="pz-kpis">${pzKpis()}</div>
    <p class="pz-lab">What your site needs</p>${pzReqHTML()}
    <div class="pz-send">${P2.sent?`<p style="font-weight:500">Plan sent.</p><p class="muted small">Our team will come back with pricing and a detailed drawing.</p>`:`<p style="font-weight:500;font-size:17px">Send this plan to OneBase</p><p class="muted small">We’ll come back with pricing and a detailed layout drawing.</p>
      <form class="enq" id="pzForm"><label>Name *<input required></label><label>Work email *<input type="email" required></label><label class="full">Company<input></label><textarea hidden name="plan">${esc(pzSummary())}</textarea><div class="full"><button class="btn btn-p" type="submit">Send me pricing</button></div></form>`}
      <div class="pz-acts"><button type="button" class="btn btn-g" data-print="1">Download drawing (PDF)</button><button type="button" class="btn btn-g" data-share="1">Copy share link</button></div></div>
    <div class="pz-foot"><button type="button" class="btn btn-g" data-go="2">← Equipment</button></div>`;
  return nav + `<div class="pz-body">${body}</div>`;
}
function pzKpis(){ const s=pzStats(); return `<div class="pz-kpis"><div><strong>${P2.price?('US$'+fmt(s.monthly/1000)+'k'):fmt(s.daily)}</strong><span>${P2.price?'monthly revenue potential':'member sessions a day'}</span></div><div><strong>${fmt(s.sessions)}</strong><span>session capacity a day</span></div></div>
    <p class="note">Illustrative estimate from ${P2.hours} open hours, typical session and changeover times and ${P2.util}% utilisation. Not a guarantee of results.</p>`; }
const pzOut = (k) => k==='hours'?P2.hours+' hrs':k==='price'?(P2.price?('US$'+P2.price):'Included in membership'):P2.util+'%';
function pzStage(){
  const s=pzStats(); const w=pzWarnings(); const sel=P2.units.find(u=>u.id===P2.sel);
  return `<div class="pz-hdr"><div><p>${esc(VENUES[P2.venue].l)}</p><h2>${pzLen(P2.W)} × ${pzLen(P2.Dp)} <span>${pzArea()}</span></h2></div>
    <div class="pz-stats"><span><b>${P2.units.length}</b> units</span><span><b>${s.people}</b> at once</span><span><b>${fmt(s.sessions)}</b> sessions/day</span><span><b>${Math.round(s.pct)}%</b> floor used</span></div></div>
    <div class="pz-canvas" id="pz-canvas">${pzSVG()}</div>
    ${sel?`<div class="pz-selbar"><b>${esc(pzShort(sel.code))}</b><button type="button" data-rot="${sel.id}">⟳ Rotate</button>${(PZ_FAM[CAT[sel.code].p]||[]).length>1?`<button type="button" data-cycle="${sel.id}">Size: ${esc(CAT[sel.code].s)} ›</button>`:''}<button type="button" data-del="${sel.id}">Remove</button><button type="button" data-desel="1" aria-label="Done">✓</button></div>`:''}
    <div class="pz-warn">${w.map(([k,t])=>`<p class="pz-w-${k}">${esc(t)}</p>`).join('')}</div>`;
}
function pzRender(){ const st=document.getElementById('pz-stage'), pn=document.getElementById('pz-panel'); if (!st) return; st.innerHTML=pzStage(); pn.innerHTML=pzPanel(); pzBindForm(); }
function pzRenderStage(){ const st=document.getElementById('pz-stage'); if (st) st.innerHTML=pzStage(); }
function pzBindForm(){ const f=document.getElementById('pzForm'); if (f) f.addEventListener('submit', e=>{ e.preventDefault(); P2.sent=true; pzRender(); }); document.querySelectorAll('#pz-panel .rng').forEach(rngStyle); }

/* ---------- Interaction ---------- */
function pzPt(svg, e){ const p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; const q=p.matrixTransform(svg.getScreenCTM().inverse()); return {x:q.x/PZ_SC-2.2, y:q.y/PZ_SC-2.2}; }
let PZD=null;
function pzInit(){
  const root=document.getElementById('pz'); if (!root) return;
  const seg=(location.hash.split('/')[2]||''); if (seg && !P2.seeded) pzDecode(seg);
  if (!P2.seeded) { P2.seeded=true; pzSuggest(); }
  pzRender();
  const stage=document.getElementById('pz-stage');
  stage.addEventListener('pointerdown', e=>{ const svg=e.target.closest('#pz-svg'); if (!svg) return;
    const dh=e.target.closest('[data-door]'); const g=e.target.closest('[data-u]');
    if (dh) { PZD={door:true}; svg.setPointerCapture(e.pointerId); e.preventDefault(); return; }
    if (g) { const u=P2.units.find(x=>x.id===+g.dataset.u); const p=pzPt(svg,e); PZD={u,dx:p.x-u.x,dy:p.y-u.y,sx:p.x,sy:p.y,moved:false}; svg.setPointerCapture(e.pointerId); e.preventDefault(); return; }
    if (P2.sel!==null) { P2.sel=null; pzRender(); } });
  stage.addEventListener('pointermove', e=>{ if (!PZD) return; const svg=document.getElementById('pz-svg'); const p=pzPt(svg,e);
    if (PZD.door) { const d={b:Math.abs(p.y-P2.Dp),t:Math.abs(p.y),l:Math.abs(p.x),r:Math.abs(p.x-P2.W)}; const wall=Object.entries(d).sort((a,b)=>a[1]-b[1])[0][0];
      P2.door={wall,t:Math.min(1,Math.max(0,(wall==='t'||wall==='b')?p.x/P2.W:p.y/P2.Dp))}; svg.innerHTML=pzSVG().replace(/^<svg[^>]*>|<\/svg>$/g,''); return; }
    if (!PZD.moved && Math.hypot(p.x-PZD.sx,p.y-PZD.sy)<.25) return; PZD.moved=true;
    const u=PZD.u; u.x=Math.round((p.x-PZD.dx)*4)/4; u.y=Math.round((p.y-PZD.dy)*4)/4; pzClamp(u); P2.sel=u.id;
    svg.innerHTML=pzSVG().replace(/^<svg[^>]*>|<\/svg>$/g,''); });
  const end=()=>{ if (!PZD) return; const d=PZD; PZD=null; if (d.u && !d.moved) P2.sel = P2.sel===d.u.id?null:d.u.id; pzRender(); };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  stage.addEventListener('keydown', e=>{ const u=P2.units.find(x=>x.id===P2.sel); if (!u) return; const k=e.key; const mv={ArrowLeft:[-.5,0],ArrowRight:[.5,0],ArrowUp:[0,-.5],ArrowDown:[0,.5]}[k];
    if (mv) { u.x+=mv[0]; u.y+=mv[1]; pzClamp(u); } else if (k==='r'||k==='R') pzRotate(u); else if (k==='Delete'||k==='Backspace') pzDel(u.id); else if (k==='Escape') P2.sel=null; else return;
    e.preventDefault(); pzRender(); document.getElementById('pz-svg')?.focus(); });
  root.addEventListener('click', e=>{ const t=e.target.closest('button,[data-pick]'); if (!t || t.closest('#pz-svg')) return; const ds=t.dataset;
    if (ds.step||ds.go) { P2.step=+(ds.step||ds.go); if (P2.step===2 && !P2.units.length) pzSuggest(); pzRender(); const mob=matchMedia('(max-width:900px)').matches; const tgt=document.getElementById(mob?'pz-panel':'pz'); const top=tgt.getBoundingClientRect().top; if (mob ? top<0||top>innerHeight*.6 : top<0) scrollTo({top:scrollY+top-(mob?58+innerHeight*.46:74),behavior:RM()?'auto':'smooth'}); return; }
    if (ds.num) { const k=ds.num; P2[k]=Math.min(80,Math.max(8,P2[k]+(+ds.d)*(P2.metric?1/0.3048*.5:1))); P2[k]=Math.round(P2[k]*2)/2; P2.units.forEach(pzClamp); pzRender(); return; }
    if (ds.metric) { P2.metric=ds.metric==='1'; pzRender(); return; }
    if (ds.preset) { const [w,d]=ds.preset.split('x').map(Number); P2.W=w; P2.Dp=d; pzSuggest(); pzRender(); return; }
    if (ds.venue) { P2.venue=ds.venue; P2.price=VENUES[ds.venue].price; pzSuggest(); pzRender(); return; }
    if (ds.suggest) { pzSuggest(); P2.sel=null; pzRender(); return; }
    if (ds.add) { const u=pzFree(ds.add)||{code:ds.add,x:0,y:0,r:0}; u.id=pzUid++; P2.units.push(u); P2.sel=u.id; pzRender(); return; }
    if (ds.rot) { pzRotate(P2.units.find(u=>u.id===+ds.rot)); pzRender(); return; }
    if (ds.cycle) { const u=P2.units.find(x=>x.id===+ds.cycle); const f=PZ_FAM[CAT[u.code].p]; pzResize(u, f[(f.indexOf(u.code)+1)%f.length]); pzRender(); return; }
    if (ds.del) { pzDel(+ds.del); pzRender(); return; }
    if (ds.desel) { P2.sel=null; pzRender(); return; }
    if (ds.pick && !e.target.closest('select')) { P2.sel=+ds.pick; pzRender(); return; }
    if (ds.print) { pzPrint(); return; }
    if (ds.share) { const l=pzLink(); history.replaceState(null,'',l.slice(l.indexOf('#'))); (navigator.clipboard?navigator.clipboard.writeText(l):Promise.reject()).then(()=>{ t.textContent='Link copied'; }).catch(()=>{ t.textContent='Link is in the address bar'; }); return; }
  });
  root.addEventListener('change', e=>{ const s=e.target.closest('[data-size]'); if (s) { pzResize(P2.units.find(u=>u.id===+s.dataset.size), s.value); pzRender(); return; }
    const n=e.target.closest('.pz-num input'); if (n) { const k=n.id.slice(3); let v=parseFloat(n.value); if (!isFinite(v)) { pzRender(); return; } if (P2.metric) v=v/0.3048; P2[k]=Math.min(80,Math.max(8,Math.round(v*2)/2)); P2.units.forEach(pzClamp); pzRender(); } });
  root.addEventListener('input', e=>{ const r=e.target.closest('[data-rng]'); if (!r) return; const k=r.dataset.rng; P2[k]=+r.value; rngStyle(r); const o=r.parentElement.querySelector('output'); if (o) o.textContent=pzOut(k); const kp=document.getElementById('pz-kpis'); if (kp) kp.innerHTML=pzKpis(); pzRenderStage(); const ta=document.querySelector('#pzForm textarea'); if (ta) ta.value=pzSummary(); });
}
function pzRotate(u){ if (!u) return; const d0=pzDims(u); const cx=u.x+d0.w/2, cy=u.y+d0.h/2; u.r=(u.r+90)%360; const d=pzDims(u); u.x=Math.round((cx-d.w/2)*4)/4; u.y=Math.round((cy-d.h/2)*4)/4; pzClamp(u); }
function pzResize(u, code){ if (!u||!CAT[code]) return; const d0=pzDims(u); const cx=u.x+d0.w/2, cy=u.y+d0.h/2; u.code=code; const d=pzDims(u); u.x=Math.round((cx-d.w/2)*4)/4; u.y=Math.round((cy-d.h/2)*4)/4; pzClamp(u); }
function pzDel(id){ P2.units=P2.units.filter(u=>u.id!==id); if (P2.sel===id) P2.sel=null; }
function pzPrint(){
  let el=document.getElementById('pz-print'); if (!el) { el=document.createElement('div'); el.id='pz-print'; document.body.appendChild(el); }
  const s=pzStats(); const rows=Object.entries(pzCounts()).map(([c,q])=>{ const k=CAT[c]; return `<tr><td>${q} ×</td><td>${esc(pzName(c))}</td><td>${k.n} ${k.n>1?'people':'person'}</td><td>${pzLen(k.w/12)} × ${pzLen(k.d/12)}${k.custom?' (example size, built to fit)':''}</td></tr>`; }).join('');
  el.innerHTML = `<div class="pp-head"><img src="${D.img['onebase-logo-black']||D.img['onebase-logo-main']}" alt="OneBase"><div><b>Recovery room plan</b><br>${new Date().toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})}</div></div>
   <h1>${esc(VENUES[P2.venue].l)} · ${pzLen(P2.W)} × ${pzLen(P2.Dp)} (${pzArea()})</h1>${(()=>{ const s0=P2.sel; P2.sel=null; const g=pzSVG({dark:false,interactive:false}); P2.sel=s0; return g; })()}
   <table><thead><tr><th></th><th>Equipment</th><th>Capacity</th><th>Footprint</th></tr></thead><tbody>${rows}</tbody></table>
   <p><b>${s.people}</b> people at once · <b>${fmt(s.sessions)}</b> session capacity a day at ${P2.hours} open hours${P2.price?` · about <b>US$${fmt(s.monthly/1000)}k</b> a month at US$${P2.price} a session and ${P2.util}% utilisation`:''}.</p>
   <h2>What your site needs</h2>${pzReqHTML()}
   <p class="pp-note">Concept layout for discussion, drawn to scale from the dimensions entered. Shaded strips show the clear space needed in front of each unit. Revenue figures are illustrative and not a guarantee of results. Final layout, circuits, ventilation and floor loading are confirmed by OneBase before installation. onebasehealth.com · sales@onebasehealth.com</p>`;
  document.body.classList.add('pz-printing'); const done=()=>{ document.body.classList.remove('pz-printing'); removeEventListener('afterprint',done); }; addEventListener('afterprint',done); setTimeout(()=>window.print(),60);
}
function pzHTML(){
  return `<section class="wrap pz-intro">${eyebrow('Recovery room planner')}<h1>Plan your recovery room.</h1><p class="muted">Enter your room, drag the equipment where you want it and see what it could deliver. Then send it to us for pricing and a detailed drawing.</p></section>
  <section class="pz" id="pz"><div class="pz-stage" id="pz-stage"></div><aside class="pz-panel" id="pz-panel"></aside></section>`;
}
pages.planner = () => pzHTML() + enquiry('Prefer to talk it through?');
const _afterRenderPZ = afterRender;
afterRender = function(){ _afterRenderPZ(); pzInit(); };
// Homepage teaser uses the same drawing as the planner
teaserHTML = function(){
  const save=JSON.parse(JSON.stringify({W:P2.W,Dp:P2.Dp,door:P2.door,venue:P2.venue,units:P2.units,sel:P2.sel}));
  Object.assign(P2,{W:30,Dp:20,door:{wall:'b',t:.82},venue:'studio',sel:null}); pzSuggest(); const svg=pzSVG({interactive:false});
  Object.assign(P2,save);
  return `<section class="sec dark" style="border-top:1px solid rgba(255,255,255,.08)"><div class="wrap pl-teaser"><div class="stack" style="gap:16px">${eyebrow('Recovery room planner')}<h2>See your recovery room before you buy it.</h2><p class="muted">Enter your room, drag the equipment into place and see what it could deliver. Takes a couple of minutes.</p><div><a href="#/planner" class="btn btn-p">Plan your room</a></div></div><a href="#/planner" class="plan-wrap" aria-label="Open the planner">${svg}</a></div></section>`;
};
