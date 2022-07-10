import { ChaosMod } from "./ChaosMod";

const chaosmod = new ChaosMod();

on("onResourceStop", (resourceName: string) => {
  if (GetCurrentResourceName() != resourceName) return;
  chaosmod.stopAllEffects();
});
