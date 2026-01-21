import React, { useRef } from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";

// --- GLSL Shader Definition ---
// Ref: Shadertoy "Low tech tunnel" by FabriceNeyret2 (and others)
// Adapted for Three.js
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform float uOpacity; // Control visibility

#define T        (uTime*4. + 5. + 5.*sin(uTime*.3))
#define P(z)     vec3( 12.* cos( (z)*vec2(.1,.12) ) , z) 
#define A(F,H,K) abs(dot( sin(F*p*K), H +p-p )) / K 

// Standard Shadertoy-like main function adapted
void main() {
    float t,s,i,d,e;
    vec3  c;
    vec2 u = gl_FragCoord.xy;
    vec3 r = vec3(uResolution, 1.0);

    u = ( u - r.xy/2. ) / r.y;            // scaled coords
    
    // Cinema bars logic (skipped or maintained for aesthetic?)
    // if (abs(u.y) > .375) { gl_FragColor = vec4(0.0); return; } 
    // Commented out cinema bars for full bg, or keep them for style?
    // User requested "background", usually implies full coverage.

    vec3  p = P(T),                       // setup ray origin, direction, and look-at
          Z = normalize( P(T+4.) - p),
          X = normalize(vec3(Z.z,0,-Z)),
          D = vec3(u, 1) * mat3(-X, cross(X, Z), Z);
              
    // Standard loop from source
    for(; i++ < 28. && d < 3e1 ;
        c += 1./s + 1e1*vec3(1,2,5)/max(e, .6)
    )
        p += D * s,                      // march
        X = P(p.z),                      // get path
        // t = sin(uTime),               // Original used iTime here, let's keep consistency
        // Note: The original shadertoy has some versions using T and some iTime. 
        // The one requested had: t = sin(iTime)
        t = sin(uTime),

        e = length(p - vec3(             // orb (sphere with xyz offset by t)
                    X.x + t,
                    X.y + t*2.,
                    6.+T + t*2.))-.01,
        
        s = cos(p.z*.6)*2.+ 4.           // tunnel with modulating radius
          - min( length(p.xy - X.x - 6.)
               , length((p-X).xy) )
          + A(  4., .25, .1)             // noise, large scoops
          + A(T+8., .22, 2.),            // noise, detail texture 
                                         
        d += s = min(e,.01+.3*abs(s));   // accumulate distance
          
    // Output final color
    vec3 col = c*c/1e6;
    gl_FragColor = vec4(col, uOpacity); // Use opacity uniform
}
`;

const vertexShader = `
void main() {
  gl_Position = vec4( position, 1.0 );
}
`;

// Create the custom material
const TunnelMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uOpacity: 0.0, // Start invisible
  },
  vertexShader,
  fragmentShader
);

// Register it with R3F
extend({ TunnelMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      tunnelMaterial: any;
    }
  }
}

export const LowTechTunnel = React.forwardRef(({ opacity = 1}: { opacity?: number }, ref) => {
  const materialRef = useRef<any>(null);
  const { size } = useThree();

  // Expose the material via ref
  React.useImperativeHandle(ref, () => materialRef.current);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime ;
      materialRef.current.uResolution.set(size.width, size.height);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <tunnelMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        depthTest={false}
        uOpacity={opacity} // Initial value
      />
    </mesh>
  );
});
