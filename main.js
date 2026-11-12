try {
window.startTempleScene = function startTempleScene(){
const canvas = document.querySelector('#world');
const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
if (!gl) throw new Error('WebGL is unavailable in this browser');

const vertexShader = `
attribute vec3 position;
attribute vec3 color;
uniform mat4 projection;
uniform mat4 view;
varying vec3 vColor;
void main(){ vColor=color; gl_Position=projection*view*vec4(position,1.0); gl_PointSize=2.0; }
`;
const fragmentShader = `
precision mediump float;
varying vec3 vColor;
void main(){ gl_FragColor=vec4(vColor,1.0); }
`;
function shader(type, source){const item=gl.createShader(type);gl.shaderSource(item,source);gl.compileShader(item);if(!gl.getShaderParameter(item,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(item));return item;}
const program=gl.createProgram();
gl.attachShader(program,shader(gl.VERTEX_SHADER,vertexShader));
gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragmentShader));
gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
gl.useProgram(program);
const positionLocation=gl.getAttribLocation(program,'position');
const colorLocation=gl.getAttribLocation(program,'color');
const projectionLocation=gl.getUniformLocation(program,'projection');
const viewLocation=gl.getUniformLocation(program,'view');
const vertexData=[];
const colors={stone:[.19,.24,.27], dark:[.055,.085,.105], wood:[.24,.13,.105], roof:[.07,.105,.13], gold:[.7,.49,.22], jade:[.08,.95,.68], pink:[1,.13,.39], amber:[1,.59,.19], leaf:[.08,.28,.23], city:[.11,.15,.19]};
function triangle(a,b,c,color){for(const v of [a,b,c])vertexData.push(...v,...color);}
function quad(a,b,c,d,color){triangle(a,b,c,color);triangle(a,c,d,color);}
function cube(cx,cy,cz,w,h,d,color){const x=w/2,y=h/2,z=d/2;const a=[cx-x,cy-y,cz-z],b=[cx+x,cy-y,cz-z],c=[cx+x,cy+y,cz-z],e=[cx-x,cy+y,cz-z],f=[cx-x,cy-y,cz+z],g=[cx+x,cy-y,cz+z],i=[cx+x,cy+y,cz+z],j=[cx-x,cy+y,cz+z];quad(a,b,c,e,color);quad(g,f,j,i,color);quad(f,a,e,j,color);quad(b,g,i,c,color);quad(e,c,i,j,color);quad(f,g,b,a,color);}
function pyramid(x,y,z,w,h,d,color){const top=[x,y+h/2,z],a=[x-w/2,y-h/2,z-d/2],b=[x+w/2,y-h/2,z-d/2],c=[x+w/2,y-h/2,z+d/2],e=[x-w/2,y-h/2,z+d/2];quad(a,e,c,b,color);triangle(a,b,top,color);triangle(b,c,top,color);triangle(c,e,top,color);triangle(e,a,top,color);}
function cylinder(x,y,z,r,h,color,segments=10){for(let i=0;i<segments;i++){const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;const p=[x+Math.cos(a)*r,y-h/2,z+Math.sin(a)*r],q=[x+Math.cos(b)*r,y-h/2,z+Math.sin(b)*r],u=[x+Math.cos(a)*r,y+h/2,z+Math.sin(a)*r],v=[x+Math.cos(b)*r,y+h/2,z+Math.sin(b)*r];quad(p,q,v,u,color);triangle([x,y+h/2,z],u,v,color);}}

// Courtyard, ceremonial approach, and enclosing walls.
cube(0,-.72,-6,61,1.1,69,colors.dark);
cube(0,-.08,13,13,.22,60,colors.stone);
for(let z=-16;z<42;z+=4)cube(0,.07,z,12,.04,.08,colors.jade);
for(const side of [-1,1]){cube(side*27,1.05,-5,.7,3.3,54,colors.stone);for(let z=-30;z<23;z+=5){cube(side*27,1.12,z,.92,3.7,.45,colors.dark);cube(side*26.5,1.25,z,.06,2.4,.05,colors.jade);}for(let x=-24;x<=24;x+=4){cube(x,1,-32,3.2,3.2,.6,colors.stone);cube(x,1.1,-32,.45,3.8,.9,colors.dark);}}
// Gate pavilion.
cube(0,2.35,3,8,.55,1.2,colors.stone);cube(-3.25,2.35,3,.48,4.7,.48,colors.wood);cube(3.25,2.35,3,.48,4.7,.48,colors.wood);cube(0,4.7,3,7.3,.35,.55,colors.wood);pyramid(0,5.45,3,9.6,1.8,7,colors.roof);cube(0,4.35,3.35,6.5,.09,.09,colors.jade);cube(-3.25,2.6,3.28,.09,3.3,.09,colors.pink);cube(3.25,2.6,3.28,.09,3.3,.09,colors.pink);
// Main hall, layered eaves, doors, and columns.
cube(0,.12,-16,22,.85,13,colors.stone);cube(0,.72,-16,20,.38,11,colors.wood);cube(0,3.25,-17.4,16,5.2,8.5,colors.wood);cube(0,1.15,-17.4,18,.38,9.5,colors.gold);cube(0,6,-17.4,16.8,.16,9.1,colors.roof);pyramid(0,7.3,-17.4,21,3.1,14,colors.roof);cube(0,3.05,-13.05,3.7,4,.18,colors.dark);for(let x=-8;x<=8;x+=4){cylinder(x,3.15,-13.2,.22,4.8,colors.wood);cylinder(x,5.3,-13.2,.25,.18,colors.gold);}cube(0,5.8,-12.72,12,.1,.1,colors.jade);for(let side of [-1,1]){cube(side*8.72,5.4,-17.4,.08,.08,9.3,colors.pink);cube(side*8.5,5.5,-17.4,.5,1,9.5,colors.wood);}
// Lanterns and cyber prayer lights.
function lantern(x,z){cylinder(x,.18,z,.62,.25,colors.stone);cylinder(x,.77,z,.42,.95,colors.stone);cylinder(x,1.35,z,.57,.22,colors.gold);cube(x,1.82,z,.86,.75,.86,colors.dark);cube(x,1.82,z,.5,.5,.5,colors.amber);pyramid(x,2.42,z,.95,.45,.95,colors.stone);}
for(const x of [-8,8])for(const z of [12,1,-10,-22])lantern(x,z);
for(const z of [-25,-18,-11,-4,3,10,17,24])for(const side of [-1,1]){const x=side*12;cube(x,5.85,z,.06,1.2,.06,colors.gold);cube(x,5.42,z,.62,.58,.62,side<0?colors.pink:colors.jade);}
// Stupas, tree clusters, and a distant skyline.
for(const x of [-19,19]){cylinder(x,.25,-23,1.7,.65,colors.stone);cylinder(x,1.95,-23,1.1,2.8,colors.stone);cylinder(x,3.6,-23,1.25,.42,colors.gold);pyramid(x,4.35,-23,2.7,1.5,2.7,colors.roof);for(let i=0;i<5;i++)cylinder(x,5.15+i*.38,-23,.17-i*.018,.42,colors.gold);cube(x,4.1,-21.85,.07,.07,3.1,colors.jade);}
for(let i=0;i<46;i++){const side=i%2===0?-1:1,x=side*(31+Math.random()*29),z=-37+Math.random()*68,h=5+Math.random()*30,w=2+Math.random()*5;cube(x,h/2-.5,z,w,h,w,colors.city);if(i%3===0)cube(x-w*.51,h*.56,z+w*.51,.06,h*.62,.06,i%2?colors.pink:colors.jade);}
for(const side of [-1,1])for(let i=0;i<8;i++){const x=side*(15+Math.random()*7),z=18-i*6+Math.random()*2;cylinder(x,1.4,z,.25,3.1,colors.wood,7);for(let j=0;j<4;j++)pyramid(x+(Math.random()-.5)*.5,3+j*.55,z+(Math.random()-.5)*.5,2.8-j*.28,1.3,2.5-j*.25,colors.leaf);}
// Incense burner.
cylinder(0,.35,-2,1,.4,colors.gold,12);cylinder(0,1.1,-2,.7,1.25,colors.stone,12);cylinder(0,1.85,-2,1.15,.25,colors.gold,12);for(const x of [-.8,.8])cylinder(x,.3,-2,.11,.9,colors.gold,8);

const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexData),gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,24,0);
gl.enableVertexAttribArray(colorLocation);gl.vertexAttribPointer(colorLocation,3,gl.FLOAT,false,24,12);
gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.clearColor(.025,.042,.07,1);

function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
function viewMatrix(eye,yaw,pitch){const cp=Math.cos(pitch),forward=[Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp],right=[Math.cos(yaw),0,Math.sin(yaw)],up=[-Math.sin(yaw)*Math.sin(pitch),cp,Math.cos(yaw)*Math.sin(pitch)];return new Float32Array([right[0],up[0],-forward[0],0,right[1],up[1],-forward[1],0,right[2],up[2],-forward[2],0,-dot(right,eye),-dot(up,eye),dot(forward,eye),1]);}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
const camera={x:0,y:1.68,z:23,yaw:0,pitch:-.08};
const intro=document.querySelector('#intro'),hud=document.querySelector('#hud'),hint=document.querySelector('#movementHint'),error=document.querySelector('#loadError');
let entered=false,dragging=false,dragMoved=false,lastX=0,lastY=0,downX=0,downY=0;
let destination=null;
const markEntered=()=>{entered=true;intro.classList.add('leaving');hud.classList.remove('hidden');document.querySelector('#sideNote').style.opacity='0';hint.textContent='点击地面前往 · 拖动环顾';};
document.querySelector('#enterButton').addEventListener('click',markEntered);
function groundTarget(clientX,clientY){
  const nx=clientX/innerWidth*2-1,ny=1-clientY/innerHeight*2;
  const aspect=canvas.width/canvas.height,tan=Math.tan(62*Math.PI/360);
  const cp=Math.cos(camera.pitch),forward=[Math.sin(camera.yaw)*cp,Math.sin(camera.pitch),-Math.cos(camera.yaw)*cp];
  const right=[Math.cos(camera.yaw),0,Math.sin(camera.yaw)];
  const up=[-Math.sin(camera.yaw)*Math.sin(camera.pitch),cp,Math.cos(camera.yaw)*Math.sin(camera.pitch)];
  const dir=forward.map((v,i)=>v+right[i]*nx*tan*aspect+up[i]*ny*tan);
  if(dir[1]>=-.025)return null;
  const distance=-camera.y/dir[1],x=camera.x+dir[0]*distance,z=camera.z+dir[2]*distance;
  if(distance>150||Math.abs(x)>10||z < -29||z>34)return null;
  if(z < -11 && Math.abs(x)<9)return null;
  return {x,z};
}
canvas.addEventListener('pointerdown',e=>{if(!entered)return;dragging=true;dragMoved=false;downX=lastX=e.clientX;downY=lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;if(!entered)return;if(!dragMoved){const point=groundTarget(e.clientX,e.clientY);if(point){destination=point;hint.textContent='正在前往目的地';}else{destination=null;hint.textContent='点击地面前往 · 拖动环顾';}}});
canvas.addEventListener('pointercancel',()=>dragging=false);
canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.hypot(e.clientX-downX,e.clientY-downY)>5)dragMoved=true;if(dragMoved){camera.yaw-=dx*.004;camera.pitch=Math.max(-.9,Math.min(.55,camera.pitch-dy*.003));}lastX=e.clientX;lastY=e.clientY;});
document.querySelector('#soundButton').addEventListener('click',e=>e.currentTarget.classList.toggle('muted'));
const clockEl=document.querySelector('#clock');setInterval(()=>clockEl.textContent=new Date().toLocaleTimeString('zh-CN',{hour12:false}),1000);
function resize(){const ratio=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.floor(innerWidth*ratio);canvas.height=Math.floor(innerHeight*ratio);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,canvas.width,canvas.height);}
function draw(){const dt=Math.min(.04,(performance.now()-lastTime)/1000);lastTime=performance.now();if(entered&&destination){const dx=destination.x-camera.x,dz=destination.z-camera.z,distance=Math.hypot(dx,dz);if(distance<.35){destination=null;hint.textContent='点击地面前往 · 拖动环顾';}else{const step=Math.min(distance,4.2*dt);camera.x+=dx/distance*step;camera.z+=dz/distance*step;}}camera.x=Math.max(-10,Math.min(10,camera.x));camera.z=Math.max(-29,Math.min(34,camera.z));document.querySelector('#locationName').textContent=camera.z < -10?'大雄宝殿':camera.z < 5?'山门广场':'青石长阶';gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(projectionLocation,false,perspective(62*Math.PI/180,canvas.width/canvas.height,.1,260));gl.uniformMatrix4fv(viewLocation,false,viewMatrix([camera.x,camera.y,camera.z],camera.yaw,camera.pitch));gl.drawArrays(gl.TRIANGLES,0,vertexData.length/6);requestAnimationFrame(draw);}
let lastTime=performance.now();addEventListener('resize',resize);resize();draw();
};
window.startTempleScene();
} catch (error) {
  console.error('寺院场景初始化失败:', error);
  const message = document.querySelector('#loadError');
  message.textContent = `寺院场景初始化失败：${error.message || error}`;
  message.classList.remove('hidden');
}
