import { Effect } from "$common/Effect";

// https://github.com/gta-chaos-mod/ChaosModV/blob/master/ChaosMod/Effects/db/Player/PlayerDrunk.cpp
export class DrunkEffect extends Effect {
  readonly effectName = "Drunk";
  readonly type = "personal";
  readonly isTimed = true;

  private timeUntilSteer = GetGameTimer();
  private enableDrunkSteering = false;
  private steering = 0;

  onTick() {
    if (!IsGameplayCamShaking()) {
      ShakeGameplayCam("DRUNK_SHAKE", 2);
    }

    const playerPed = PlayerPedId();

    SetPedIsDrunk(playerPed, true);

    RequestClipSet("MOVE_M@DRUNK@VERYDRUNK");
    SetPedMovementClipset(playerPed, "MOVE_M@DRUNK@VERYDRUNK", 1);

    SetAudioSpecialEffectMode(2);

    // No idea what these do, but game scripts also call these so just blindly follow
    N_0x487a82c650eb7799(1);
    N_0x0225778816fdc28c(1);

    // Random right / left steering
    if (IsPedInAnyVehicle(playerPed, false)) {
      const playerVeh = GetVehiclePedIsIn(playerPed, false);
      if (GetPedInVehicleSeat(playerVeh, -1) !== playerPed) return;

      if (this.enableDrunkSteering) {
        SetVehicleSteerBias(playerVeh, this.steering);
      }

      const curTick = GetGameTimer();

      if (this.timeUntilSteer < curTick) {
        let timeUntilSteer = GetGameTimer();

        if (this.enableDrunkSteering) {
          // Give player back control
          timeUntilSteer += GetRandomIntInRange(100, 500);
        } else {
          // Take control from player
          this.steering = GetRandomFloatInRange(-0.5, 0.5);
          timeUntilSteer += GetRandomIntInRange(50, 300);
        }

        this.enableDrunkSteering = !this.enableDrunkSteering;
      }
    }
  }

  onStop() {
    const playerPed = PlayerPedId();

    SetPedIsDrunk(playerPed, false);

    ResetPedMovementClipset(playerPed, 0);

    RemoveClipSet("MOVE_M@DRUNK@VERYDRUNK");

    StopGameplayCamShaking(true);

    N_0x487a82c650eb7799(0);
    N_0x0225778816fdc28c(0);
  }
}
