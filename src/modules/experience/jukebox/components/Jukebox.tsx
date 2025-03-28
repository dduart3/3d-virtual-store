/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { CuboidCollider } from "@react-three/rapier";
import { useAtom } from "jotai";
import {
  jukeboxCameraTargetAtom,
  jukeboxModeAtom,
  jukeboxStateAtom,
  originalCameraStateAtom,
} from "../state/jukebox";
import {
  avatarCameraDistanceAtom,
  avatarCameraRotationAtom,
} from "../../avatar/state/avatar";
import { GroupProps } from "@react-three/fiber";
import { JukeboxCameraController } from "../../jukebox/components/JukeboxCameraController";

type GLTFResult = GLTF & {
  nodes: {
    Canciones_Organizador_low_PBR_0: THREE.Mesh;
    ["Selector-Canciones-Rueda_low_PBR_0"]: THREE.Mesh;
    ["C��rculo006_PBR_0"]: THREE.Mesh;
    ["C��rculo004_PBR_0"]: THREE.Mesh;
    Estructura_004001_PBR_0: THREE.Mesh;
    Plano015_PBR_0: THREE.Mesh;
    ["C��rculo034_PBR_0"]: THREE.Mesh;
    Estructura_004009_PBR_0: THREE.Mesh;
    Plano017_PBR_0: THREE.Mesh;
    Plano018_PBR_0: THREE.Mesh;
    Vinillo02_low_PBR_0: THREE.Mesh;
    ["C��rculo002_PBR_0"]: THREE.Mesh;
    ["C��rculo031_PBR_0"]: THREE.Mesh;
    Gear003_PBR_0: THREE.Mesh;
    Gear004_PBR_0: THREE.Mesh;
    Plano014_PBR_0: THREE.Mesh;
    Gear005_PBR_0: THREE.Mesh;
    ["C��rculo035_PBR_0"]: THREE.Mesh;
    ["C��rculo037_PBR_0"]: THREE.Mesh;
    PuertaDelantera_Movil_Cristal_PBR_0: THREE.Mesh;
  };
  materials: {
    material: THREE.MeshPhysicalMaterial;
    glass: THREE.MeshStandardMaterial;
  };
};

export function Jukebox(props: GroupProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    "/models/misc/jukebox.glb"
  ) as GLTFResult;
  const { actions } = useAnimations<THREE.AnimationClip>(animations, group);
  // Jukebox state
  const [jukeboxMode, setJukeboxMode] = useAtom(jukeboxModeAtom);
  const [jukeboxState] = useAtom(jukeboxStateAtom);

  // Camera control atoms - only needed for storing original state
  const [cameraRotation] = useAtom(avatarCameraRotationAtom);
  const [cameraDistance] = useAtom(avatarCameraDistanceAtom);
  const [, setJukeboxCameraTarget] = useAtom(jukeboxCameraTargetAtom);
  const [, setOriginalCameraState] = useAtom(originalCameraStateAtom);

  const position = props.position as [number, number, number];


  // Handle jukebox animation based on state
  useEffect(() => {
    const animation = actions["Esqueleto|Thank You Gratitude Affirmations"]
    if (jukeboxState === "idle") {
      // Play idle animation
      if (animation) {
        const action = animation;
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.timeScale = 1;
        action.time = 0;
        action.play();
      }
    } else if (jukeboxState === "playing") {
      // Play disc changing animation
      if (animation) {
        const action = animation;
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.timeScale = 1;
        action.time = 40; // Start from the disc changing part
        action.play();
      }
    }
  }, [jukeboxState, actions]);

// Handle click on jukebox
const handleJukeboxClick = () => {
  if (jukeboxMode === "active") return; // Prevent multiple clicks
   
  // Store original camera state for returning later
  setOriginalCameraState({
    rotation: cameraRotation,
    distance: cameraDistance
  });
   
  // Get jukebox position from props
  const jukeboxPosition = new THREE.Vector3(
    position[0],
    position[1] + 0.7, // Add height offset to look at the middle of the jukebox
    position[2]
  );
   
  // Get the jukebox's rotation (assuming it's in the format [x, y, z])
  const jukeboxRotationY = props.rotation ? (props.rotation as [number, number, number])[1] : 0;
 
  // Calculate a position that's directly in front of the jukebox
  // We need to position the camera in front of the jukebox based on the jukebox's orientation
  const offsetDistance = 1.5; // Distance from the jukebox
 
  // Calculate the direction vector pointing to the front of the jukebox
  // For a jukebox rotated by Y, the front direction is:
  const frontDirectionX = Math.sin(jukeboxRotationY);
  const frontDirectionZ = Math.cos(jukeboxRotationY);
 
  // Position the camera in front of the jukebox
  const cameraPosition = new THREE.Vector3(
    jukeboxPosition.x + frontDirectionX * offsetDistance,
    jukeboxPosition.y,
    jukeboxPosition.z + frontDirectionZ * offsetDistance
  );
 
  // Set the camera to look at the jukebox
  setJukeboxCameraTarget({
    position: cameraPosition,
    lookAt: jukeboxPosition,
    rotation: jukeboxRotationY + Math.PI, // Facing the jukebox
    distance: offsetDistance
  });
   
  // Activate jukebox mode
  setJukeboxMode("active");
};


  return (
    <group ref={group} {...props} dispose={null} onClick={handleJukeboxClick}>
      <group name="Jukebox">
        <mesh
          name="Canciones_Organizador_low_PBR_0"
          castShadow
          receiveShadow
          geometry={nodes.Canciones_Organizador_low_PBR_0.geometry}
          material={materials.material}
          position={[-0.00598241, 0.64155903, -0.14201988]}
          rotation={[-2.01360201, 1e-8, -0.46918307]}
          scale={[0.84146955, 0.84146969, 0.84146969]}
          userData={{ name: "Canciones_Organizador_low_PBR_0" }}
        />
        <group
          name="Object_81"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.05797639, 1.05797629, 1.05797629]}
          userData={{ name: "Object_81" }}
        >
          <group name="_rootJoint" userData={{ name: "_rootJoint" }}>
            <group
              name="Bone_Principal_00"
              userData={{ name: "Bone_Principal_00" }}
            >
              <group
                name="Bone_Rueda-Seleccion_01"
                userData={{ name: "Bone_Rueda-Seleccion_01" }}
              >
                <group
                  name="Bone_Rueda-Seleccion_end_014"
                  userData={{ name: "Bone_Rueda-Seleccion_end_014" }}
                />
                <group
                  name="Selector-Canciones-Rueda_low"
                  rotation={[-1.57079005, 0, 0]}
                  userData={{ name: "Selector-Canciones-Rueda_low" }}
                >
                  <mesh
                    name="Selector-Canciones-Rueda_low_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes["Selector-Canciones-Rueda_low_PBR_0"].geometry
                    }
                    material={materials.material}
                    position={[0, 0.0083694, 0]}
                    scale={0.06554893}
                    userData={{ name: "Selector-Canciones-Rueda_low_PBR_0" }}
                  />
                </group>
              </group>
              <group
                name="Bone_Disco-Letras_02"
                userData={{ name: "Bone_Disco-Letras_02" }}
              >
                <group
                  name="Bone_Disco-Letras_end_015"
                  userData={{ name: "Bone_Disco-Letras_end_015" }}
                />
                <group
                  name="C��rculo006"
                  rotation={[-1.41987424, 0.20047219, -0.03027459]}
                  userData={{ name: "C��rculo.006" }}
                >
                  <mesh
                    name="C��rculo006_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["C��rculo006_PBR_0"].geometry}
                    material={materials.material}
                    scale={0.06127704}
                    userData={{ name: "C��rculo.006_PBR_0" }}
                  />
                </group>
              </group>
              <group
                name="Bone_Disco-Numeros_03"
                userData={{ name: "Bone_Disco-Numeros_03" }}
              >
                <group
                  name="Bone_Disco-Numeros_end_016"
                  userData={{ name: "Bone_Disco-Numeros_end_016" }}
                />
                <group
                  name="C��rculo004"
                  rotation={[-1.42291919, -6e-8, -2.1e-7]}
                  userData={{ name: "C��rculo.004" }}
                >
                  <mesh
                    name="C��rculo004_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["C��rculo004_PBR_0"].geometry}
                    material={materials.material}
                    scale={0.10602369}
                    userData={{ name: "C��rculo.004_PBR_0" }}
                  />
                </group>
              </group>
              <group
                name="Bone_GirarDisco_04"
                userData={{ name: "Bone_GirarDisco_04" }}
              >
                <group
                  name="Bone_GirarDisco_end_017"
                  userData={{ name: "Bone_GirarDisco_end_017" }}
                />
                <group
                  name="Estructura_004001"
                  position={[0, 0.11125448, -0.96764266]}
                  userData={{ name: "Estructura_004.001" }}
                >
                  <mesh
                    name="Estructura_004001_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Estructura_004001_PBR_0.geometry}
                    material={materials.material}
                    position={[0, -0.11125879, 0.97300634]}
                    scale={0.10613886}
                    userData={{ name: "Estructura_004.001_PBR_0" }}
                  />
                </group>
              </group>
              <group
                name="Bone_Brazo-Aguja_001_05"
                userData={{ name: "Bone_Brazo-Aguja_001_05" }}
              >
                <group
                  name="Bone_Brazo-Aguja_002_06"
                  userData={{ name: "Bone_Brazo-Aguja_002_06" }}
                >
                  <group
                    name="Bone_Brazo-Aguja_002_end_018"
                    userData={{ name: "Bone_Brazo-Aguja_002_end_018" }}
                  />
                  <group
                    name="Plano015"
                    position={[0.00293786, 0.00732001, -0.04110544]}
                    rotation={[-0.00000113, -0.00002922, 3.06428864]}
                    userData={{ name: "Plano.015" }}
                  >
                    <mesh
                      name="Plano015_PBR_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Plano015_PBR_0.geometry}
                      material={materials.material}
                      position={[0.01778895, -0.10874347, 0.03396329]}
                      scale={0.14224186}
                      userData={{ name: "Plano.015_PBR_0" }}
                    />
                  </group>
                </group>
                <group
                  name="C��rculo034"
                  position={[-0.11225085, 0.06551283, 0.04771854]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  userData={{ name: "C��rculo.034" }}
                >
                  <mesh
                    name="C��rculo034_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["C��rculo034_PBR_0"].geometry}
                    material={materials.material}
                    position={[0.11225087, 0.04771852, -0.02758904]}
                    scale={0.0383933}
                    userData={{ name: "C��rculo.034_PBR_0" }}
                  />
                </group>
                <group
                  name="Estructura_004009"
                  position={[-0.05871081, -0.59060532, 0.08507219]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  userData={{ name: "Estructura_004.009" }}
                >
                  <mesh
                    name="Estructura_004009_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Estructura_004009_PBR_0.geometry}
                    material={materials.material}
                    position={[0.07097793, 0.08756791, 0.63936758]}
                    scale={0.02543987}
                    userData={{ name: "Estructura_004.009_PBR_0" }}
                  />
                </group>
              </group>
              <group
                name="Bone_Brazo-Discos_001_07"
                userData={{ name: "Bone_Brazo-Discos_001_07" }}
              >
                <group
                  name="Bone_Brazo-Discos_002_08"
                  userData={{ name: "Bone_Brazo-Discos_002_08" }}
                >
                  <group
                    name="Bone_Brazo-Discos_002_end_019"
                    userData={{ name: "Bone_Brazo-Discos_002_end_019" }}
                  />
                  <group
                    name="Plano017"
                    rotation={[-Math.PI / 2, 0, 0]}
                    userData={{ name: "Plano.017" }}
                  >
                    <mesh
                      name="Plano017_PBR_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Plano017_PBR_0.geometry}
                      material={materials.material}
                      scale={0.02971932}
                      userData={{ name: "Plano.017_PBR_0" }}
                    />
                  </group>
                  <group
                    name="Plano018"
                    position={[0, 0.02971964, -2e-8]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    userData={{ name: "Plano.018" }}
                  >
                    <mesh
                      name="Plano018_PBR_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Plano018_PBR_0.geometry}
                      material={materials.material}
                      position={[0, 0.12538336, 0.03099221]}
                      scale={0.12991809}
                      userData={{ name: "Plano.018_PBR_0" }}
                    />
                  </group>
                </group>
                <group
                  name="Bone_Brazo-Discos_003_09"
                  userData={{ name: "Bone_Brazo-Discos_003_09" }}
                >
                  <group
                    name="Bone_Brazo-Discos_003_end_020"
                    userData={{ name: "Bone_Brazo-Discos_003_end_020" }}
                  />
                </group>
                <group
                  name="Bone_Disco-Gracias_010"
                  userData={{ name: "Bone_Disco-Gracias_010" }}
                >
                  <group
                    name="Bone_Disco-Gracias_end_021"
                    userData={{ name: "Bone_Disco-Gracias_end_021" }}
                  />
                  <group
                    name="Vinillo02_low"
                    position={[0.00003447, 0.96000421, 0.11126646]}
                    rotation={[-Math.PI / 2, 0, 0.00031662]}
                    userData={{ name: "Vinillo02_low" }}
                  >
                    <mesh
                      name="Vinillo02_low_PBR_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Vinillo02_low_PBR_0.geometry}
                      material={materials.material}
                      position={[-0.00049924, 0.11126654, -0.9600043]}
                      scale={0.1045593}
                      userData={{ name: "Vinillo02_low_PBR_0" }}
                    />
                  </group>
                </group>
                <group name="C��rculo002" userData={{ name: "C��rculo.002" }}>
                  <mesh
                    name="C��rculo002_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["C��rculo002_PBR_0"].geometry}
                    material={materials.material}
                    scale={0.05870397}
                    userData={{ name: "C��rculo.002_PBR_0" }}
                  />
                </group>
                <group name="C��rculo031" userData={{ name: "C��rculo.031" }}>
                  <mesh
                    name="C��rculo031_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["C��rculo031_PBR_0"].geometry}
                    material={materials.material}
                    scale={0.03123272}
                    userData={{ name: "C��rculo.031_PBR_0" }}
                  />
                </group>
                <group
                  name="Gear003"
                  position={[0.04471651, -9e-8, -2.9e-7]}
                  userData={{ name: "Gear.003" }}
                >
                  <mesh
                    name="Gear003_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Gear003_PBR_0.geometry}
                    material={materials.material}
                    position={[-0.04471651, 0, 0]}
                    scale={0.04728358}
                    userData={{ name: "Gear.003_PBR_0" }}
                  />
                </group>
                <group
                  name="Gear004"
                  position={[0.05158851, -9e-8, -2.9e-7]}
                  userData={{ name: "Gear.004" }}
                >
                  <mesh
                    name="Gear004_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Gear004_PBR_0.geometry}
                    material={materials.material}
                    position={[-0.05158851, 0.0001057, -0.00000217]}
                    scale={0.05416961}
                    userData={{ name: "Gear.004_PBR_0" }}
                  />
                </group>
                <group
                  name="Plano014"
                  position={[1e-8, -0.02712834, -0.00059407]}
                  userData={{ name: "Plano.014" }}
                >
                  <mesh
                    name="Plano014_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Plano014_PBR_0.geometry}
                    material={materials.material}
                    position={[0, -0.0056547, -0.00664385]}
                    scale={0.02157434}
                    userData={{ name: "Plano.014_PBR_0" }}
                  />
                </group>
              </group>
              <group
                name="Bone_Brazo-Discos-Engranajes_011"
                userData={{ name: "Bone_Brazo-Discos-Engranajes_011" }}
              >
                <group
                  name="Bone_Brazo-Discos-Engranajes_end_022"
                  userData={{ name: "Bone_Brazo-Discos-Engranajes_end_022" }}
                />
                <group
                  name="Gear005"
                  position={[-0.19115394, 0.05416954, 0.21939139]}
                  rotation={[2.5e-7, 1.36083506, -Math.PI / 2]}
                  userData={{ name: "Gear.005" }}
                >
                  <mesh
                    name="Gear005_PBR_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Gear005_PBR_0.geometry}
                    material={materials.material}
                    position={[0, 0.25451601, 0.14123586]}
                    scale={0.0541696}
                    userData={{ name: "Gear.005_PBR_0" }}
                  />
                </group>
              </group>
              <group
                name="Bone_Rueda-Discos_012"
                userData={{ name: "Bone_Rueda-Discos_012" }}
              >
                <group
                  name="Bone_Rueda-Discos001_013"
                  userData={{ name: "Bone_Rueda-Discos.001_013" }}
                >
                  <group
                    name="Bone_Rueda-Discos001_end_023"
                    userData={{ name: "Bone_Rueda-Discos.001_end_023" }}
                  />
                  <group
                    name="C��rculo035"
                    position={[-0.00000277, 0.00005459, -0.00629456]}
                    rotation={[-Math.PI / 2, 0, 0.00031662]}
                    userData={{ name: "C��rculo.035" }}
                  >
                    <mesh
                      name="C��rculo035_PBR_0"
                      castShadow
                      receiveShadow
                      geometry={nodes["C��rculo035_PBR_0"].geometry}
                      material={materials.material}
                      scale={0.20157631}
                      userData={{ name: "C��rculo.035_PBR_0" }}
                    />
                  </group>
                  <group
                    name="C��rculo037"
                    position={[-0.00000276, 0.00005459, -0.00629456]}
                    rotation={[-Math.PI / 2, 0.00470081, 0.00031662]}
                    userData={{ name: "C��rculo.037" }}
                  >
                    <mesh
                      name="C��rculo037_PBR_0"
                      castShadow
                      receiveShadow
                      geometry={nodes["C��rculo037_PBR_0"].geometry}
                      material={materials.material}
                      position={[0.00000109, -0.00629458, -0.00062981]}
                      scale={0.20904946}
                      userData={{ name: "C��rculo.037_PBR_0" }}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
        <mesh
          name="PuertaDelantera_Movil_Cristal_PBR_0"
          castShadow
          receiveShadow
          geometry={nodes.PuertaDelantera_Movil_Cristal_PBR_0.geometry}
          material={materials.glass}
          position={[0, 1.22572103, 0.12830389]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.45104282, 0.45104278, 0.45104278]}
          userData={{ name: "PuertaDelantera_Movil_Cristal_PBR_0" }}
        />
      </group>
      <JukeboxCameraController />
      <CuboidCollider args={[0.5, 0.8, 0.4]} position={[-35, 0.67, -11.53]} />
    </group>
  );
}

useGLTF.preload("/models/misc/jukebox.glb");
