import {useEffect,useMemo,useRef} from "react";
const landPolygons: number[][][] = [
  [[-168,72],[-145,70],[-130,58],[-125,48],[-124,39],[-117,32],[-108,25],[-98,18],[-88,18],[-82,25],[-80,32],[-68,44],[-56,52],[-70,62],[-95,72],[-125,76],[-150,75]],
  [[-82,12],[-69,10],[-55,-2],[-48,-15],[-53,-28],[-61,-40],[-69,-56],[-77,-48],[-80,-27],[-78,-5]],
  [[-18,36],[-5,37],[9,36],[23,33],[34,30],[44,12],[39,-5],[31,-22],[19,-35],[7,-34],[-2,-18],[-12,-2],[-17,18]],
  [[-10,36],[-8,50],[2,58],[18,70],[38,72],[55,67],[75,74],[99,72],[122,62],[145,57],[166,62],[179,50],[166,39],[145,35],[128,25],[112,17],[96,8],[80,8],[70,20],[58,25],[48,39],[35,37],[26,42],[15,37],[7,43]],
  [[112,-10],[126,-9],[143,-13],[154,-24],[147,-39],[132,-44],[116,-35],[113,-22]],
  [[-52,82],[-24,82],[-18,72],[-35,59],[-52,62],[-60,72]],
];

function pointInPolygon(lon: number, lat: number, polygon: number[][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = (yi > lat) !== (yj > lat) &&
      lon < ((xj - xi) * (lat - yi)) / ((yj - yi) || 0.00001) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}


export default function OrbitEarth({position}:{position:number}) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const land=useMemo(()=>{
    const points:number[][]=[];
    for(let lat=-78;lat<83;lat+=1.65){
      const phi=lat*Math.PI/180;
      for(let lon=-180;lon<180;lon+=1.65/Math.cos(phi)){
        if(landPolygons.some(p=>pointInPolygon(lon,lat,p))){
          const theta=lon*Math.PI/180;
          points.push([Math.cos(phi)*Math.sin(theta),Math.sin(phi),Math.cos(phi)*Math.cos(theta)]);
        }
      }
    }
    return points;
  },[]);
  useEffect(()=>{
    const ctx=canvas.current?.getContext("2d");
    if(!ctx)return;
    ctx.clearRect(0,0,800,800);
    const angle=position*.5-.32, c=Math.cos(angle),s=Math.sin(angle);
    ctx.fillStyle="#ff96ea";ctx.beginPath();
    for(const [x,y,z] of land){
      const depth=z*c-x*s;
      if(depth<=0)continue;
      const px=400+395*(x*c+z*s),py=400-395*y,r=1.15+1.65*depth;
      ctx.moveTo(px+r,py);ctx.ellipse(px,py,r*(.35+.65*depth),r,0,0,Math.PI*2);
    }
    ctx.fill();
  },[land,position]);
  return <canvas aria-hidden="true" width={800} height={800} ref={canvas}/>;
}
