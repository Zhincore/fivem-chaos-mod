import { Effect } from "$common/Effect";

export class CloneEffect extends Effect {
  readonly effectName = "Clone player";
  readonly type = "personal";

  async onStart() {
    const friendly = Math.random() < 0.5;

    const [_, relationshipGroup] = AddRelationshipGroup(
      friendly ? "_COMPANION_CLONE_FRIENDLY" : "_COMPANION_CLONE_HOSTILE",
    );
    SetRelationshipBetweenGroups(friendly ? 0 : 5, relationshipGroup, GetHashKey("PLAYER"));
    SetRelationshipBetweenGroups(friendly ? 0 : 5, GetHashKey("PLAYER"), relationshipGroup);

    const playerPed = PlayerPedId();

    const ped = ClonePed(playerPed, true, true, false);
    if (IsPedInAnyVehicle(playerPed, false)) {
      SetPedIntoVehicle(ped, GetVehiclePedIsIn(playerPed, false), -2);
    }

    SetPedSuffersCriticalHits(ped, false);
    SetPedHearingRange(ped, 9999);
    SetPedConfigFlag(ped, 281, true);
    SetPedCanRagdollFromPlayerImpact(ped, false);
    SetRagdollBlockingFlags(ped, 5);

    SetPedRelationshipGroupHash(ped, relationshipGroup);

    if (friendly) {
      SetPedAsGroupMember(ped, GetPlayerGroup(PlayerId()));
    }

    SetPedCombatAttributes(ped, 5, true);
    SetPedCombatAttributes(ped, 46, true);

    GiveWeaponToPed(ped, GetSelectedPedWeapon(playerPed), 9999, true, true);

    SetPedAccuracy(ped, 100);
    SetPedFiringPattern(ped, 0xc6ee6b4c);
  }
}
