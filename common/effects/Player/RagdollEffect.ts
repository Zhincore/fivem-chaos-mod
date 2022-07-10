import { Effect } from "$common/Effect";

// https://github.com/gta-chaos-mod/ChaosModV/blob/master/ChaosMod/Effects/db/Player/PlayerRagdoll.cpp
export class RagdollEffect extends Effect {
  readonly effectName = "Ragdoll";
  readonly type = "personal";

  async onStart() {
    const playerPed = PlayerPedId();
    ClearPedTasksImmediately(playerPed);
    SetPedToRagdoll(playerPed, 10000, 10000, 0, true, true, false);
  }
}
