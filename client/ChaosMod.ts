import { IChaosMod } from "$common/IChaosMod";
import { Effect, EffectConstructor } from "$common/Effect";
import { Effects } from "$common/effects";
import config from "$common/config";

export class ChaosMod implements IChaosMod {
  readonly environment = "client";
  private active = false;
  readonly currentEffects = new Map<EffectConstructor, Effect>();

  constructor() {
    this.registerEventHandlers();

    setTick(() => {
      for (const effect of this.currentEffects.values()) {
        if (effect.onTick) effect.onTick();
      }
    });
  }

  private emitNui(eventName: string, ...data: any) {
    SendNuiMessage(JSON.stringify({ type: eventName, data }));
  }

  toggleActive(active?: boolean) {
    active = active ?? !this.active;
    if (active === this.active) return;
    this.active = active;

    this.emitNui("setActive", active, config);
    this.emitNui("resetTimer");
    this.stopAllEffects();
  }

  timerTick() {
    /// Remove old effects
    for (const [effectClass, effect] of this.currentEffects.entries()) {
      if (effect.isAnonymous && effect._time != config.effectDuration) {
        this.emitNui("setEffect", effectClass.name, effect);
      }

      if (effect._time) effect._time--;
      else if (effect._isByClient) this.stopEffect(effectClass);
    }

    this.emitNui("resetTimer");
  }

  startEffect(EffectOrName: EffectConstructor | string, isServer?: boolean) {
    const EffectClass = typeof EffectOrName === "string" ? Effects[EffectOrName] : EffectOrName;
    if (!EffectClass) throw new Error(`Effect '${EffectOrName}' is not defined.`);

    // Replace existing instance of this effect
    const existingEffect = this.currentEffects.get(EffectClass);
    if (existingEffect) {
      this.currentEffects.delete(EffectClass);
      if (existingEffect.onStop) existingEffect.onStop();
    }

    const effect = new EffectClass(this);
    effect._time = config.effectDuration;
    effect._isByClient = !isServer;
    if (effect.onStart) effect.onStart();

    this.currentEffects.set(EffectClass, effect);
    if (!effect.isHidden) {
      this.emitNui("setEffect", EffectClass.name, {
        ...effect.toJSON(),
        effectName: effect.isAnonymous ? "Nothing" : effect.effectName,
      });
    }
  }

  stopEffect(EffectOrName: EffectConstructor | string) {
    const EffectClass = typeof EffectOrName === "string" ? Effects[EffectOrName] : EffectOrName;
    if (!EffectClass) throw new Error(`Effect '${EffectOrName}' is not defined.`);

    const effect = this.currentEffects.get(EffectClass);
    if (!effect) return;

    if (effect.onStop) effect.onStop();
    if (!effect.isHidden) this.emitNui("stopEffect", EffectClass.name);
    this.currentEffects.delete(EffectClass);
  }

  stopAllEffects() {
    for (const effect of this.currentEffects.values()) {
      if (effect.onStop) effect.onStop();
    }
    this.currentEffects.clear();
    this.emitNui("stopAllEffects");
  }

  registerEventHandlers() {
    onNet("ChaosMod:setActive", (active: boolean) => {
      this.toggleActive(active);
    });

    onNet("ChaosMod:startedEffect", (effectClassName: string) => {
      this.startEffect(effectClassName, true);
    });

    onNet("ChaosMod:stoppedEffect", (effectClassName: string) => {
      this.stopEffect(effectClassName);
    });

    onNet("ChaosMod:timerTick", () => {
      this.timerTick();
    });
  }
}
