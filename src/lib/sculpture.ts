import {
  Mesh, OrthographicCamera, Scene, ShaderMaterial, TorusKnotGeometry, WebGLRenderer,
} from "three";

// The reflected bands describe three studio lights on a continuous metal surface.
const material = () => new ShaderMaterial({
  vertexShader: `
    varying vec3 surfaceNormal;
    varying vec3 surfacePosition;
    void main() {
      vec4 point = modelViewMatrix * vec4(position, 1.0);
      surfaceNormal = normalMatrix * normal;
      surfacePosition = point.xyz;
      gl_Position = projectionMatrix * point;
    }
  `,
  fragmentShader: `
    varying vec3 surfaceNormal;
    varying vec3 surfacePosition;
    float strip(float position, float width, float softness) {
      return 1.0 - smoothstep(width, width + softness, abs(position));
    }
    void main() {
      vec3 n = normalize(surfaceNormal);
      vec3 eye = normalize(-surfacePosition);
      vec3 r = reflect(-eye, n);
      float rim = pow(1.0 - max(dot(eye, n), 0.0), 2.1);
      vec3 color = mix(vec3(.051,.036,.071), vec3(.31,.27,.36), .5 + .5*r.y);
      float overhead = strip(r.y-.58+.13*r.x, .045, .21);
      float edge = strip(r.y-.88+.06*r.x, .013, .035);
      float pink = strip(r.x+.65-.27*r.y, .085, .3);
      float lilac = strip(r.x-.66-.2*r.y, .09, .25);
      color += vec3(.9,.82,.88)*overhead + vec3(.82,.82,.9)*edge;
      color += vec3(.89,.10,.43)*pink + vec3(.40,.34,.76)*lilac;
      color += vec3(.30,.20,.31)*rim;
      color *= .79 + .21*smoothstep(-1.0,1.0,n.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

export function createSculpture(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  const scene = new Scene();
  const camera = new OrthographicCamera(-2.52, 2.52, 2.52, -2.52, 0.1, 30);
  camera.position.z = 9;
  const geometry = new TorusKnotGeometry(1.25, 0.37, 220, 48, 2, 3);
  geometry.center();
  const chrome = material();
  const knot = new Mesh(geometry, chrome);
  scene.add(knot);

  return {
    resize(size: number) {
      renderer.setSize(size, size, false);
    },
    draw(progress: number, pointerX: number, pointerY: number) {
      knot.rotation.set(.34 + progress * .75 + pointerY * .085,
        -.52 + progress * 1.95 + pointerX * .14, -.48 + progress * .43);
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      chrome.dispose();
      renderer.dispose();
    },
  };
}
