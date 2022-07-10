import { Effect, EffectConstructor } from "$common/Effect";
import { PersonalEffects } from "$common/Effects";

/**
 * Special effect that is used to choose random effect for a given player on their client side.
 * It is hidden and only the effect that is chosen is visible.
 * Only personal effects are selected to not affect other players too much.
 */
export class IndividualEffect extends Effect {
  readonly effectName = "_individual";
  readonly type = "global";
  readonly isTimed = false;
  readonly isHidden = true;

  onStart() {
    let ChosenEffect: EffectConstructor;
    const _effectList = [...Object.values(PersonalEffects)];

    do {
      ChosenEffect = _effectList.splice(Math.floor(Math.random() * _effectList.length), 1)[0];
    } while (_effectList.length && this.chaosmod.currentEffects.has(ChosenEffect));

    this.chaosmod.startEffect(ChosenEffect);
  }
}
