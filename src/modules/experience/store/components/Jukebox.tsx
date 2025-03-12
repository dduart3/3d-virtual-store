import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../../shared/components/Model";

export const Jukebox = (props: GroupProps) => {
    return <Model
        isCritical={true}
        modelPath="misc/jukebox"
        {...props}

    />;
};

