import { IChaosMod } from "$common/IChaosMod";

export type EffectType = "personal" | "global";

export interface IEffectInfo {
  effectName: string;
  isTimed?: boolean;
  _isByClient?: boolean;
}

export abstract class Effect implements IEffectInfo {
  /** Name that will be displayed on screen */
  abstract readonly effectName: string;
  /** Whether this affects the player or the whole world */
  abstract readonly type: EffectType;
  /** Whether this effects ends after duration */
  readonly isTimed: boolean = false;
  /** Whether this effect should be hidden from display */
  readonly isHidden: boolean = false;
  /** Whether the name of this effect should be anonymous at first */
  readonly isAnonymous: boolean = false;

  // following props are only programmatic
  public _time: number = 0;
  public _isByClient: boolean = false;
  readonly _className: string;

  constructor(protected readonly chaosmod: IChaosMod) {
    this._className = this.constructor.name;
  }

  toJSON(): IEffectInfo {
    const { effectName, isTimed } = this;
    return { effectName, isTimed };
  }

  onServerStart?(): void | Promise<void>;
  onServerTick?(): void | Promise<void>;
  onServerStop?(): void | Promise<void>;

  onStart?(): void | Promise<void>;
  onTick?(): void | Promise<void>;
  onStop?(): void | Promise<void>;
}

export type EffectConstructor = new (...params: ConstructorParameters<typeof Effect>) => Effect;
