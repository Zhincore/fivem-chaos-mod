import EventEmitter from "eventemitter3";
import { h, render as Preact } from "preact";
import { EffectList, EffectItemProps } from "./EffectList";
import type { IEffectInfo } from "$common/Effect";
import config from "$common/config";

const timerWrap = document.getElementById("timer-wrap")!;
const timerBar = document.getElementById("timer-bar")!;
const effects = new Map<string, EffectItemProps>();
let _updateList: (list: EffectItemProps[]) => void = () => null;

Preact(h(EffectList, { registerUpdateListener: (cb) => (_updateList = cb) }), document.getElementById("effect-list")!);

const events = new EventEmitter();
window.addEventListener("message", (event) => {
  const { type, data } = event.data;
  events.emit(type, ...(Array.isArray(data) ? data : [data]));
});

events.on("setActive", (active: boolean, aConfig?: typeof config) => {
  if (aConfig) Object.assign(config, aConfig);
  timerWrap.style.opacity = +active + "";
  resetTimer();
});

events.on("resetTimer", resetTimer);

events.on("setEffect", (effectClass: string, effect: IEffectInfo) => {
  effects.set(effectClass, {
    ...effect,
    nonce: (effects.has(effectClass) && Math.random()) + "",
    duration: config.effectFrequency * config.effectDuration,
  });
  updateList();
});

events.on("stopEffect", (effectClass: string) => {
  effects.delete(effectClass);
  updateList();
});

events.on("stopAllEffects", (index: number) => {
  effects.clear();
  updateList();
});

function resetTimer() {
  timerBar.style.transitionDuration = "0ms";
  timerBar.style.width = "0%";

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      timerBar.style.transitionDuration = config.effectFrequency + "ms";
      timerBar.style.width = "100%";
    }),
  );
}

function updateList() {
  _updateList(Array.from(effects.values()));
}
