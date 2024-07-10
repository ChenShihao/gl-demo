import Range from "@atlaskit/range";
import React, { type Dispatch, type FC, type SetStateAction } from "react";
import { type TransformState } from "../utils/drawScene";

interface ControlBoxComponentProps {
  transformState: TransformState;
  setTransformState: Dispatch<SetStateAction<TransformState>>;
}

export const ControlBox: FC<ControlBoxComponentProps> = ({
  transformState,
  setTransformState,
}) => {
  return (
    <div>
      <Range
        min={1}
        max={180}
        value={transformState.fovDegree}
        onChange={(value) => {
          setTransformState({ ...transformState, fovDegree: value });
        }}
      />
    </div>
  );
};
