import sys, os, math
sys.path.insert(0,'/home/claude/renders')
from lib import *
from mathutils import Vector, Matrix
opt=args(); reset()
EXPORT = 'export=1' in sys.argv
bpy.ops.import_scene.gltf(filepath='/home/claude/cad/m6n.glb')
roots=[o for o in bpy.data.objects if o.parent is None]
e=bpy.data.objects.new('ROOT',None); link(e)
for o in roots: o.parent=e
e.rotation_euler=(math.radians(-90),0,0); bpy.context.view_layer.update()
def bounds(objs):
    mn=Vector((1e9,)*3); mx=Vector((-1e9,)*3)
    for o in objs:
        for c in o.bound_box:
            w=o.matrix_world@Vector(c); mn=Vector(map(min,mn,w)); mx=Vector(map(max,mx,w))
    return mn,mx
meshes=[o for o in bpy.data.objects if o.type=='MESH']
mn,mx=bounds(meshes)
e.location=(-(mn.x+mx.x)/2, -(mn.y+mx.y)/2, -mn.z); bpy.context.view_layer.update()
mn,mx=bounds(meshes); print('size',mx-mn)
# drop hidden internals to keep the web model light
drop=('150-FAN','120-FAN','15050_FAN','12025','NET','FAN','LED-FRAME')
for o in list(meshes):
    if any(o.name.upper().startswith(d) for d in drop):
        bpy.data.objects.remove(o, do_unlink=True)
meshes=[o for o in bpy.data.objects if o.type=='MESH']
# supplier slogan: engraved text object on the lower front strip -> removed
colour = opt.get('colour','black')
gloss = pmat('gloss', (0.012,0.012,0.013) if colour=='black' else (0.82,0.82,0.80), rough=0.18, coat=0.6)
satin = pmat('satin', (0.02,0.02,0.021) if colour=='black' else (0.75,0.75,0.73), rough=0.45)
rubber = pmat('rubber', (0.03,0.03,0.03), rough=0.8)
for o in meshes:
    o.data.materials.clear()
    n=o.name.upper()
    o.data.materials.append(rubber if n.startswith('LUN') else gloss)
    for p in o.data.polygons: p.use_smooth=True
    if o.data.polygons:
        try: o.data.set_sharp_from_angle(angle=math.radians(35))
        except Exception: pass
if 'probe=1' in sys.argv:
    bpy.context.view_layer.update(); dg0=bpy.context.evaluated_depsgraph_get()
    for zz in [x/100 for x in range(5,60,2)]:
        r=bpy.context.scene.ray_cast(dg0, Vector((0.1,-3,zz)), Vector((0,1,0)))
        print('probe', zz, r[4].name if r[0] else None, round(r[1].y,4) if r[0] else None)
    raise SystemExit
# raycast helpers
bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get(); sc=bpy.context.scene
def hit(origin, d):
    r=sc.ray_cast(dg, Vector(origin), Vector(d).normalized()); return (r[1], r[2]) if r[0] else (None,None)
# screen: aim at the canopy centre from the front, 40deg up
h=None
for zz in [mx.z-0.25, mx.z-0.3, mx.z-0.35]:
    p,nrm = hit((0,-3,zz),(0,1,0))
    print('front ray z',zz,p,nrm)
p,nrm = hit((0,-3, mx.z-0.40),(0,1,0))
print('screen hit',p,nrm)
scr = emit('scr', (0.02,0.03,0.04), 1.0)
glassdark = pmat('scrg', (0.01,0.01,0.012), rough=0.05, coat=1.0)
def plate(name, p, nrm, w, h, mat, off=0.004, img=None, aspect=None):
    me=bpy.data.meshes.new(name); me.from_pydata([(-w/2,0,-h/2),(w/2,0,-h/2),(w/2,0,h/2),(-w/2,0,h/2)],[],[(0,1,2,3)])
    me.uv_layers.new(); uv=me.uv_layers[0].data
    for i,c in enumerate([(0,0),(1,0),(1,1),(0,1)]): uv[i].uv=c
    ob=link(bpy.data.objects.new(name,me)); me.materials.append(mat)
    q = Vector((0,-1,0)).rotation_difference(nrm.normalized())
    ob.rotation_mode='QUATERNION'; ob.rotation_quaternion=q; ob.location=p+nrm.normalized()*off; return ob
# cover the supplier slogan engraved in the lower front strip with a skin in the body material
sp, sn = hit((0.0,-3,0.21),(0,1,0))
if sp is not None:
    # sample the strip's vertical extent at this depth to size the patch
    zs=[z/1000 for z in range(170,260,2) if (lambda q: q[0] is not None and abs((q[1]-sn).length)<0.05)(hit((0.0,-3,z/1000),(0,1,0)))]
    zc=(min(zs)+max(zs))/2 if zs else 0.21; hgt=(max(zs)-min(zs)) if zs else 0.03
    cp, cn = hit((0.0,-3,zc),(0,1,0))
    print('slogan strip', zc, hgt, cn)
    plate('sloganCover', cp, cn, 1.9, max(hgt,0.02)*1.02, gloss, off=0.004)
# rugged tablet standing on the canopy at the top lip of the window recess (matches site photo)
TX = float(opt.get('tx','0.15')); TZ = float(opt.get('tz', str(mx.z-0.33)))
tp, tn = hit((TX,-3,TZ),(0,1,0))
print('tablet base', tp, tn)
if tp is not None:
    rubber_t = pmat('tabrubber', (0.004,0.004,0.0045), rough=0.5)
    tglass = pmat('tabglass', (0.01,0.01,0.012), rough=0.04, coat=1.0)
    ui = emit('tabui', (0.22,0.05,0.05), 0.5)
    tw, th, td = 0.27, 0.185, 0.03
    tab = bpy.data.objects.new('TABLET', None); link(tab)
    body = box('tabBody', -tw/2, -td/2, 0, tw/2, td/2, th, rubber_t, bevel=0.012, segs=3); body.parent = tab
    scr = box('tabGlass', -tw/2+0.022, -td/2-0.001, 0.022, tw/2-0.022, -td/2+0.002, th-0.022, tglass); scr.parent = tab
    u = box('tabUI', -tw/2+0.03, -td/2-0.0015, 0.03, tw/2-0.03, -td/2-0.0012, th-0.03, ui); u.parent = tab
    for sx in (-1, 1):  # corner bumpers
        for sz in (0, 1):
            c = box('bump', sx*tw/2-0.022, -td/2-0.006, sz*th-0.02, sx*tw/2+0.022, td/2+0.004, sz*th+0.02, rubber_t, bevel=0.01, segs=3)
            c.location.x -= sx*0.004; c.location.z += (0.004 if sz==0 else -0.004); c.parent = tab
    arm = box('tabArm', -0.03, td/2-0.004, 0.02, 0.03, td/2+0.05, 0.08, rubber_t, bevel=0.006); arm.parent = tab
    foot = box('tabFoot', -0.05, -0.02, -0.045, 0.05, 0.07, 0.0, rubber_t, bevel=0.008); foot.parent = tab
    tab.location = tp + Vector((0, 0.01, 0.035))
    tab.rotation_euler = (math.radians(-float(opt.get('tilt','18'))), 0, 0)

# logo: lower-left of the canopy front
best=None
for zz in [x/100 for x in range(int((mx.z-0.6)*100), int((mx.z-0.2)*100), 2)]:
    q,n2 = hit((-0.5,-3,zz),(0,1,0))
    if q is not None and abs(n2.z) < 0.25: best=(q,n2); break
print('logo',best)
if best:
    logo = decal('logo', '/home/claude/onebase-site/public/images/src/onebase-logo-white.png', strength=0.3)
    plate('logo', best[0], best[1], 0.40, 0.40*267/800, logo, off=0.004)
if EXPORT:
    # decimate heavy parts
    tot=0
    for o in [o for o in bpy.data.objects if o.type=='MESH']:
        dims=o.dimensions; nm=o.name.upper()
        if max(dims) < 0.06 and not nm.startswith(('SCREEN','LOGO','LUN')): bpy.data.objects.remove(o, do_unlink=True); continue
        n=sum(len(p.vertices)-2 for p in o.data.polygons)
        cap = 5000 if max(dims)>1.0 else (800 if max(dims)>0.3 else 250)
        if n>cap:
            md=o.modifiers.new('dec','DECIMATE'); md.ratio=cap/n
        tot+=min(n,cap)
    print('tris approx', tot)
    export_glb(opt['out'])
else:
    world((0.004,0.004,0.005),1.0)
    box('floor',-12,-12,-0.2,12,12,0.0,concrete('sfloor',(0.030,0.030,0.032),rough=0.22))
    box('bgwall',-12,5,0,12,5.2,8,pmat('bg',(0.012,0.012,0.013),rough=0.8))
    k=area('key',(-1.0,-3.6,3.4),(0,0,0),3.0,300,kelvin(5000)); aim(k,(0,0,0.5))
    f=area('fill',(3.4,-2.6,1.2),(0,0,0),2.0,70,kelvin(5000)); aim(f,(0,0,0.6)); f.visible_glossy=False
    r1=area('rimL',(-2.8,2.2,2.4),(0,0,0),1.4,380,kelvin(6500)); aim(r1,(-1.1,0,0.7))
    r2=area('rimR',(2.8,2.0,2.6),(0,0,0),1.4,330,kelvin(6500)); aim(r2,(1.1,0,0.7))
    tp=area('top',(0,-0.4,4.5),(0,0,0),3.0,260,kelvin(5000))
    strip=area('strip',(0,-2.2,2.0),(0,0,0),3.2,160,kelvin(6500),sy=0.25); aim(strip,(0,0,0.9))
    camera(eval(opt.get('cam','(-2.5,-4.3,1.25)')),eval(opt.get('tgt','(0.05,0.1,0.58)')),lens=float(opt.get('lens','45')),fstop=6.3)
    render(opt)
