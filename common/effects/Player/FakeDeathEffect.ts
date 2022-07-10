import { Effect } from "$common/Effect";
import { sleep } from "$common/utils";

const messages: string[] = ["~g~jk, continue playing", "haha, fell for it", "SIKE!", "dayum"];

// https://github.com/gta-chaos-mod/ChaosModV/blob/master/ChaosMod/Effects/db/Player/PlayerFakeDeath.cpp
export class FakeDeathEffect extends Effect {
  readonly effectName = "Fake death";
  readonly type = "personal";
  readonly isAnonymous = true;

  private dying = false;
  private scaleform = 0;

  async onStart() {
    const playerPed = PlayerPedId();

    /// Suicide
    if (IsPedInAnyVehicle(playerPed, false)) {
      // Fake veh explosion
      const veh = GetVehiclePedIsIn(playerPed, false);
      const seats = GetVehicleModelNumberOfSeats(GetEntityModel(veh));
      let lastTimestamp = GetGameTimer();
      let detonateTimer = 5000;
      let beepTimer = 5000;

      while (DoesEntityExist(veh)) {
        await sleep(0);

        const curTimestamp = GetGameTimer();

        if ((detonateTimer -= curTimestamp - lastTimestamp) < beepTimer) {
          beepTimer *= 0.8;

          PlaySoundFromEntity(-1, "Beep_Red", veh, "DLC_HEIST_HACKING_SNAKE_SOUNDS", true, 0);
        }

        if (!IsPedInVehicle(PlayerPedId(), veh, false)) {
          for (let i = -1; i < seats - 1; i++) {
            const ped = GetPedInVehicleSeat(veh, i);

            if (!ped) continue;

            TaskLeaveVehicle(ped, veh, 4160);
          }
        }

        if (detonateTimer <= 0) {
          for (let i = 0; i < 6; i++) {
            SetVehicleDoorBroken(veh, i, false);
          }
          SetVehicleEngineHealth(veh, -4000);
          const coords = GetEntityCoords(veh, false);
          AddExplosion(coords[0], coords[1], coords[2], 7, 0, true, false, 1);

          break;
        }

        lastTimestamp = curTimestamp;
      }
    } else if (IsPedOnFoot(playerPed) && GetPedParachuteState(playerPed) == -1) {
      // Fake suicide
      RequestAnimDict("mp_suicide");
      while (!HasAnimDictLoaded("mp_suicide")) await sleep(0);

      const pistolHash = GetHashKey("WEAPON_PISTOL");
      GiveWeaponToPed(playerPed, pistolHash, 1, true, true);
      TaskPlayAnim(playerPed, "mp_suicide", "pistol", 8.0, -1.0, 1150, 1, 0, false, false, false);
      await sleep(500);
    }

    /// Death

    this.dying = true;
    /// Sound start
    SetAudioFlag("LoadMPData", true);
    RequestScriptAudioBank("OFFMISSION_WASTED", false);

    StartAudioScene("DEATH_SCENE");

    PlaySoundFrontend(-1, "Bed", "WastedSounds", true);

    SetCamEffect(1);
    SetTransitionTimecycleModifier("dying", 2);

    await sleep(2000);

    /// Wasted screen
    this.scaleform = RequestScaleformMovie("MP_BIG_MESSAGE_FREEMODE");
    while (!HasScaleformMovieLoaded(this.scaleform)) {
      await sleep(0);
    }

    BeginScaleformMovieMethod(this.scaleform, "SHOW_SHARD_WASTED_MP_MESSAGE");

    ScaleformMovieMethodAddParamPlayerNameString("~r~wasted");
    const subtext = messages[Math.floor(Math.random() * messages.length)];
    ScaleformMovieMethodAddParamPlayerNameString(subtext);

    EndScaleformMovieMethod();
    PlaySoundFrontend(-1, "TextHit", "WastedSounds", true);

    await sleep(2000);

    /// Cleanup
    this.dying = false;
    this.scaleform = 0;

    const veh = GetVehiclePedIsIn(playerPed, false);
    SetVehicleFixed(veh);
    StopAnimTask(playerPed, "mp_suicide", "pistol", 3);
    StopAudioScene("DEATH_SCENE");
    SetCamEffect(0);
    ClearTimecycleModifier();
    RemoveAnimDict("mp_suicide");
    SetPlayerInvincible(playerPed, false);
  }

  onTick() {
    if (this.dying) HideHudAndRadarThisFrame();
    if (this.scaleform) DrawScaleformMovieFullscreen(this.scaleform, 255, 255, 255, 255, 0);
  }
}
