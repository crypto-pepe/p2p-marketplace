import type { SvelteComponent } from "svelte";

export type Link = {
  content?: string | SvelteComponent;
  title?: string;
  href: string;
  referrerpolicy?: string;
  target?: string
}