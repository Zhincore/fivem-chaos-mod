import { IChaosMod } from "$common/IChaosMod";
import { Effect, EffectConstructor } from "$common/Effect";
import { Effects } from "$common/effects";
import { IndividualEffect } from "$common/effects/IndividualEffect";
import config from "$common/config";

const effectList = Object.values(Effects);

export class ChaosModServer implements IChaosMod {
  readonly environment = "server";
  private timer?: CitizenTimer;
  private active = false;
  readonly currentEffects = new Map<EffectConstructor, Effect>();

  constructor() {
    setTick(() => {
      for (const effect of this.currentEffects.values()) {
        if (effect.onServerTick) effect.onServerTick();
      }
    });
  }

  get isActive() {
    return this.active;
  }
  toggleActive(active?: boolean) {
    active = active ?? !this.active;
    if (active === this.active) return;

    if (active) this.setTimer();
    else this.clearTimer();
    this.stopAllEffects();

    emitNet("ChaosMod:setActive", -1, (this.active = active));
  }

  timerTick() {
    this.setTimer();

    /// Start new effect if any available
    if (effectList.length > this.currentEffects.size) {
      let ChosenEffect: EffectConstructor;

      // Individual effect
      if (Math.random() <= config.individualEffectChance) {
        ChosenEffect = IndividualEffect;
      }
      // Random shared effect
      else {
        // Choose an effect that is not active
        const _effectList = [...effectList];
        do {
          ChosenEffect = _effectList.splice(Math.floor(Math.random() * _effectList.length), 1)[0];
        } while (_effectList.length && (ChosenEffect == IndividualEffect || this.currentEffects.has(ChosenEffect)));
      }

      this.startEffect(ChosenEffect);
    }

    /// Remove old effects
    for (const [effectClass, effect] of this.currentEffects.entries()) {
      if (effect._time) effect._time--;
      else this.stopEffect(effectClass);
    }

    emitNet("ChaosMod:timerTick", -1);
  }

  startEffect(EffectClass: EffectConstructor) {
    const effect = new EffectClass(this);
    effect._time = config.effectDuration;

    if (effect.onServerStart) effect.onServerStart();

    this.currentEffects.set(EffectClass, effect);
    emitNet("ChaosMod:startedEffect", -1, effect._className);
  }

  stopEffect(EffectClass: EffectConstructor) {
    const effect = this.currentEffects.get(EffectClass);
    if (!effect) return;

    if (effect.onServerStop) effect.onServerStop();
    emitNet("ChaosMod:stoppedEffect", -1, effect._className);
    this.currentEffects.delete(EffectClass);
  }

  stopAllEffects() {
    for (const effect of this.currentEffects.values()) {
      if (effect.onServerStop) effect.onServerStop();
    }
    this.currentEffects.clear();
  }

  setTimer() {
    this.timer = setTimeout(() => this.timerTick(), config.effectFrequency);
  }

  clearTimer() {
    if (!this.timer) return;
    clearTimeout(this.timer);
    this.timer = undefined;
  }
}
