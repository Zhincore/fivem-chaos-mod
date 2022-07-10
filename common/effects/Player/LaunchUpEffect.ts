import { Effect } from "$common/Effect";
import { sleep } from "$common/utils";

export class LaunchUpEffect extends Effect {
  readonly effectName = "Launch player up";
  readonly type = "personal";

  async onStart() {
    const playerPed = PlayerPedId();
    let entity = playerPed;
    if (IsPedInAnyVehicle(playerPed, false)) {
      entity = GetVehiclePedIsIn(playerPed, false);
    } else {
      SetPedToRagdoll(playerPed, 10000, 10000, 0, true, true, false);
      await sleep(0);
    }

    const velocity = GetEntityVelocity(entity);
    SetEntityVelocity(entity, velocity[0], velocity[1], velocity[2] + 100);
  }
}
