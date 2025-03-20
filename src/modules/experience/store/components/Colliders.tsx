import { CuboidCollider } from "@react-three/rapier";

export const Colliders = () => {
  return (
    <>
      {/* Internal store walls (the 3 white walls) */}
      <CuboidCollider
        name="store-internal-back-wall"
        args={[0.27, 2.15, 9.013]}
        position={[-132.8, 1.75, -59.7]}
      />
      <CuboidCollider
        name="store-internal-left-wall"
        args={[0.27, 2.15, 14]}
        position={[-147.05, 1.75, -68.45]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="store-internal-right-wall"
        args={[0.27, 2.15, 14.05]}
        position={[-147.15, 1.75, -50.95]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Black pillars in the middle of the store */}

      {/* Left side */}
      <CuboidCollider
        name="store-pillar-woman-statue"
        args={[1.1, 2.15, 0.7]}
        position={[-149.81, 1.75, -63]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="store-pillar-1"
        args={[1.1, 2.15, 0.7]}
        position={[-143.87, 1.75, -63]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Right side */}
      <CuboidCollider
        name="store-pillar-man-statue"
        args={[1.1, 2.15, 0.7]}
        position={[-149.81, 1.75, -56.68]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <CuboidCollider
        name="store-pillar-1"
        args={[1.1, 2.15, 0.7]}
        position={[-143.87, 1.75, -56.84]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/*Mid store mannequins */}
      <CuboidCollider
        name="store-pillar-2"
        args={[0.4, 0.7, 4.2]}
        position={[-147.58, 0.3, -59.94]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Storefront */}

      <CuboidCollider
        name="store-front-left-wall"
        args={[3.45, 2.1, 0.8]}
        position={[-160.9, 1.7, -65.3]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="store-front-left-column-1"
        args={[0.21, 1.25, 0.2]}
        position={[-161.9, 0.85, -61.84]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <CuboidCollider
        name="store-front-left-column--2"
        args={[0.46, 1.25, 0.28]}
        position={[-161.36, 0.85, -61.69]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="store-front-left-door-gap-1"
        args={[0.62, 1.25, 0.08]}
        position={[-159.1, 0.85, -61.53]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="store-front-left-door-gap-2"
        args={[0.4, 1.25, 0.15]}
        position={[-159.7, 0.85, -62]}
        rotation={[0, 0, 0]}
      />

      <CuboidCollider
        name="store-front-right-wall"
        args={[3.45, 2.1, 0.8]}
        position={[-160.9, 1.7, -54.15]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <CuboidCollider
        name="store-front-right-column-1"
        args={[0.21, 1.25, 0.2]}
        position={[-161.9, 0.85, -57.45]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="store-front-right-column-2"
        args={[0.46, 1.25, 0.28]}
        position={[-161.36, 0.85, -57.6]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <CuboidCollider
        name="store-front-right-door-gap-1"
        args={[0.62, 1.25, 0.08]}
        position={[-159.1, 0.85, -58.05]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="store-front-right-door-gap-2"
        args={[0.55, 1.25, 0.15]}
        position={[-159.56, 0.85, -57.45]}
        rotation={[0, 0, 0]}
      />

      {/* External store walls (the 4 big grey walls, 2 each side) not the entrance */}
      <CuboidCollider
        name="store-external-right-wall"
        args={[3.6, 4.4, 23.5]}
        position={[-157.9, 4, -27.2]}
      />

      <CuboidCollider
        name="external-store-left-wall"
        args={[3.6, 4.4, 23.3]}
        position={[-157.6, 4, -92.1]}
      />

      {/*World*/}

      <CuboidCollider
        name="park-barrier"
        args={[0.001, 4.4, 60]}
        position={[-170.3, 4, -55.5]}
      />

      <CuboidCollider
        name="world-left-barrier"
        args={[0.001, 4.4, 5]}
        position={[-166, 4, -115.5]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <CuboidCollider
        name="world-right-barrier"
        args={[0.001, 4.4, 5]}
        position={[-166, 4, -4]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </>
  );
};
