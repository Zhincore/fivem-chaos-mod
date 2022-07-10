import * as MiscEffects from "./Misc";
import * as PedsEffects from "./Peds";
import * as PlayerEffects from "./Player";
import * as IndividualEffect from "./IndividualEffect";

import { IChaosMod } from "$common/IChaosMod";
import { EffectConstructor } from "$common/Effect";

const fakeChaosMod: IChaosMod = {
  currentEffects: new Map(),
  environment: "server",
  startEffect() {},
  stopEffect() {},
};

export const Effects: Record<string, EffectConstructor> = Object.assign(
  {},
  MiscEffects,
  PlayerEffects,
  PedsEffects,
  IndividualEffect,
);

export const [GlobalEffects, PersonalEffects] = (() => {
  const glob: Record<string, EffectConstructor> = {};
  const pers: Record<string, EffectConstructor> = {};

  for (const [name, Effect] of Object.entries(Effects)) {
    const effect = new Effect(fakeChaosMod);
    if (effect.type == "personal") pers[name] = Effect;
    else glob[name] = Effect;
  }
  return [glob, pers];
})();
