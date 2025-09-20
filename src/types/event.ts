import type { ClientEvents } from 'discord.js';

export interface EventDefinition<K extends keyof ClientEvents = keyof ClientEvents> {
  config: {
    name: K;
    once?: boolean;
  };
  main: (...args: ClientEvents[K]) => void;
}