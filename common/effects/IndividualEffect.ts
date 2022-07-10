import { Effect, EffectConstructor } from "$common/Effect";
import { PersonalEffects } from "$common/Effects";

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
