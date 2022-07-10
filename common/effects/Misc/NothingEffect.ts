import { Effect } from "$common/Effect";

// I made this one myself, would you believe it?
export class NothingEffect extends Effect {
  readonly effectName = "Nothing";
  readonly type = "personal";
}
