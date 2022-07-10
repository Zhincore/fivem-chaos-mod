import { Effects } from "$common/effects";
import { ChaosModServer } from "./ChaosModServer";

const chaosmod = new ChaosModServer();

RegisterCommand(
  "chaosmod",
  (source: number, args: string[]) => {
    const toggle = (state?: boolean) => {
      chaosmod.toggleActive(state);
      sendMessage(source, `ChaosMod is now ${chaosmod.isActive ? "^2ACTIVE^0" : "^8inactive^0"}`);
    };

    if (args.length > 0) {
      switch (args[0].toLowerCase()) {
        case "effect":
          const EffectClass = Effects[args[1]];
          if (!EffectClass) return sendMessage(source, `Effect ${args[1]} doesn't exist`);

          chaosmod.startEffect(EffectClass);
          sendMessage(source, `Started effect ${args[1]}`);
          break;

        case "stopall":
          chaosmod.stopAllEffects();
          sendMessage(source, "Stopped all effects");
          break;

        case "on":
        case "off":
          toggle(args[0] === "on");
          break;

        default:
          sendMessage(source, "Usage: `chaosmod [on|off]`");
      }
    } else {
      toggle();
    }
  },
  true,
);

on("onResourceStop", (resourceName: string) => {
  if (GetCurrentResourceName() != resourceName) return;
  chaosmod.stopAllEffects();
});

function sendMessage(source: number, msg: string) {
  if (!source) return console.log(msg);
  emitNet("chat:addMessage", source, {
    color: [255, 255, 0],
    args: ["ChaosMod", msg],
  });
}
