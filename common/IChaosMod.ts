import { Effect, EffectConstructor } from "$common/Effect";

export interface IChaosMod {
  environment: "server" | "client";
  currentEffects: Map<EffectConstructor, Effect>;

  startEffect(Effect: EffectConstructor): void;
  stopEffect(Effect: EffectConstructor): void;
}
