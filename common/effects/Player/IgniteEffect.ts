import { Effect } from "$common/Effect";

export class IgniteEffect extends Effect {
  readonly effectName = "Ignite player";
  readonly type = "personal";

  async onStart() {
    const playerPed = PlayerPedId();

    if (IsPedInAnyVehicle(playerPed, false)) {
      const playerVeh = GetVehiclePedIsIn(playerPed, false);
      SetVehicleEngineHealth(playerVeh, -1);
      SetVehiclePetrolTankHealth(playerVeh, -1);
      SetVehicleBodyHealth(playerVeh, -1);
    } else {
      StartEntityFire(playerPed);
    }
  }
}
