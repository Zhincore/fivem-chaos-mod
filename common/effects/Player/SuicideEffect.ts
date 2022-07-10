import { Effect } from "$common/Effect";
import { sleep } from "$common/utils";

// https://github.com/gta-chaos-mod/ChaosModV/blob/master/ChaosMod/Effects/db/Player/PlayerSuicide.cpp
export class SuicideEffect extends Effect {
  readonly effectName = "Suicide";
  readonly type = "personal";

  async onStart() {
    const playerPed = PlayerPedId();

    if (!IsPedInAnyVehicle(playerPed, false) && IsPedOnFoot(playerPed) && GetPedParachuteState(playerPed) == -1) {
      // Suicide
      RequestAnimDict("mp_suicide");
      while (!HasAnimDictLoaded("mp_suicide")) await sleep(0);

      const pistolHash = GetHashKey("WEAPON_PISTOL");
      GiveWeaponToPed(playerPed, pistolHash, 1, true, true);
      TaskPlayAnim(playerPed, "mp_suicide", "pistol", 8.0, -1.0, 1150, 1, 0, false, false, false);
      await sleep(750);
      SetPedShootsAtCoord(playerPed, 0, 0, 0, true);
      RemoveAnimDict("mp_suicide");
    }
    SetEntityHealth(playerPed, 0);
  }
}
