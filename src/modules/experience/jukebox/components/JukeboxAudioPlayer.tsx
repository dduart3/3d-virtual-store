import { useJukeboxAudio } from "../hooks/useJukeboxAudio";
import { useAtom } from "jotai";
import { avatarPositionAtom } from "../../avatar/state/avatar";

export const JukeboxAudioPlayer = () => {

  const [avatarPosition] = useAtom(avatarPositionAtom);
  
  
  // Only enable audio when on the store page
  useJukeboxAudio({ 
    avatarPosition
  });
  
  return null;
};
