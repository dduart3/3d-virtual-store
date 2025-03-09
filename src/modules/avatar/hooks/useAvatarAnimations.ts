import { useGLTF } from "@react-three/drei";
import { useEffect, useState, RefObject } from "react";
import { Group, AnimationMixer, AnimationAction } from "three";
import { chatInputFocusedAtom } from "../../chat/state/chat";
import { useAtom } from "jotai";

type AnimationState = "idle" | "walk" | "run" | "jump";

export function useAvatarAnimations(modelRef: RefObject<Group>) {
  const [mixer, setMixer] = useState<AnimationMixer | null>(null);
  const [actions, setActions] = useState<
    Record<AnimationState, AnimationAction | null>
  >({
    idle: null,
    walk: null,
    run: null,
    jump: null,
  });
  const [currentState, setCurrentState] = useState<AnimationState>("idle");
  const [chatInputFocused] = useAtom(chatInputFocusedAtom);

  // Load the animation files
  const { animations: idleAnimations } = useGLTF("/animations/idle.glb");
  const { animations: walkAnimations } = useGLTF("/animations/walk.glb");
  const { animations: runAnimations } = useGLTF("/animations/run.glb");
  // const { animations: jumpAnimations } = useGLTF('/animations/jump.glb');

  // Initialize the mixer and actions when the model ref is available
  useEffect(() => {
    if (!modelRef.current) return;

    console.log("Setting up animation mixer for model");

    // Create new mixer connected to the model
    const newMixer = new AnimationMixer(modelRef.current);
    setMixer(newMixer);

    // Process animation clips
    const newActions: Record<AnimationState, AnimationAction | null> = {
      idle: null,
      walk: null,
      run: null,
      jump: null,
    };

    // Log animations to debug
    console.log("Idle animations:", idleAnimations);
    console.log("Walk animations:", walkAnimations);
    console.log("Run animations:", runAnimations);

    if (idleAnimations && idleAnimations.length > 0) {
      newActions.idle = newMixer.clipAction(idleAnimations[0]);
      console.log("Added idle animation");
    }

    if (walkAnimations && walkAnimations.length > 0) {
      newActions.walk = newMixer.clipAction(walkAnimations[0]);
      console.log("Added walk animation");
    }

    if (runAnimations && runAnimations.length > 0) {
      newActions.run = newMixer.clipAction(runAnimations[0]);
      console.log("Added run animation");
    }

    // if (jumpAnimations && jumpAnimations.length > 0) {
    //   newActions.jump = newMixer.clipAction(jumpAnimations[0]);
    //   console.log("Added jump animation");
    // }

    setActions(newActions);

    // Start playing idle animation by default
    if (newActions.idle) {
      newActions.idle.play();
    }

    return () => {
      newMixer.stopAllAction();
    };
  }, [modelRef.current, idleAnimations, walkAnimations]);

  // Function to update animation based on character state
  const updateAnimation = (
    isMoving: boolean,
    isRunning: boolean,
    isJumping: boolean
  ) => {
    let newState: AnimationState = "idle";

    if (!chatInputFocused) {
      if (isJumping) {
        newState = "jump";
      } else if (isMoving) {
        newState = isRunning ? "run" : "walk";
      }

      // Only change animations if state has changed
      if (newState !== currentState) {
        console.log(`Changing animation from ${currentState} to ${newState}`);

        // Fade out current animation
        if (actions[currentState]) {
          actions[currentState]?.fadeOut(0.2);
        }

        // Fade in new animation
        if (actions[newState]) {
          actions[newState]?.reset().fadeIn(0.2).play();
        } else {
          console.warn(`Animation not found for state: ${newState}`);

          // Fallback to idle if the requested animation isn't available
          if (newState !== "idle" && actions.idle) {
            actions.idle.reset().fadeIn(0.2).play();
          }
        }

        setCurrentState(newState);
      }
    }
  };

  // Update the mixer in the animation frame
  const update = (delta: number) => {
    if (mixer) {
      mixer.update(delta);
    }
  };

  return { updateAnimation, update, currentState };
}
