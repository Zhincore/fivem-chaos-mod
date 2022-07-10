import { Effect } from "$common/Effect";

// https://github.com/gta-chaos-mod/ChaosModV/blob/master/ChaosMod/Effects/db/Peds/PedsMinions.cpp
export class MinionsEffect extends Effect {
  readonly effectName = "Minions";
  readonly type = "global";
  readonly isTimed = true;

  onTick() {
    for (const ped of GetGamePool("CPed")) {
      if (!GetPedConfigFlag(ped, 223, true)) {
        SetPedConfigFlag(ped, 223, true);
      }
    }
  }

  onStop() {
    for (const ped of GetGamePool("CPed")) {
      if (GetPedConfigFlag(ped, 223, true)) {
        SetPedConfigFlag(ped, 223, false);
      }
    }
  }
}
