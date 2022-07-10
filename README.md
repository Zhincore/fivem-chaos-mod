# Chaos Mod

> This project is WIP (work in progress)

This FiveM server plugin tries to replicate what [Chaos Mod V](https://github.com/gta-chaos-mod/ChaosModV) does, but for the whole server.

Every 30 seconds a random effect is started. It is either global (every player gets it) or individual (each player gets different effect). The effect can also be timed (will end after 90 seconds, e.g. drunk effect) or one-shot (happens once, e.g. ragdoll).

Most effects are taken from the [Chaos Mod V](https://github.com/gta-chaos-mod/ChaosModV) repository and rewritten for our usage unless specified otherwise. All rights and admiration belong to the original authors.

## Usage

The ChaosMod can be (de)activated by the `/chaosmod` command (requires the player to have permission or run it from server console).

## Installation

1. Download this repository as a zip or git-clone it
2. Put it in your server's resources folder
3. Name the folder something more memorable (e.g. `chaosmod` instead of the fivem-chaos-mod)
4. Put `ensure chaosmod` in your `server.cfg`
5. Restart the server (or run `refresh` and `start chaosmod`, you're the admin)

Refer to the Usage section for usage.
