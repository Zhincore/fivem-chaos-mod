import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";

type EffectListProps = {
  registerUpdateListener: (cb: (list: EffectItemProps[]) => void) => void;
};

export function EffectList({ registerUpdateListener }: EffectListProps) {
  const [list, setList] = useState<EffectItemProps[]>([]);

  useEffect(() => {
    registerUpdateListener((_list) => setList(_list));
  }, [registerUpdateListener]);

  return (
    <>
      {list.map((item) => (
        <EffectItem key={item.effectName + item.nonce} {...item} />
      ))}
    </>
  );
}

export type EffectItemProps = {
  effectName: string;
  isTimed?: boolean;
  duration?: number;
  nonce?: string;
};

function EffectItem({ effectName, isTimed, duration }: EffectItemProps) {
  return (
    <li class="effect-item">
      <span class="effect-name">{effectName}</span>
      <div
        class="effect-timer-wrap"
        style={{
          visibility: isTimed ? "visible" : "hidden",
        }}
      >
        <div
          class="effect-timer-bar"
          style={{
            animationDuration: (duration ?? 0) + "ms",
            animationPlayState: isTimed ? "playing" : "paused",
          }}
        ></div>
      </div>
    </li>
  );
}
