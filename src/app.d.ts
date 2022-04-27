/// <reference types="@sveltejs/kit" />

declare var __GIT_VERSION__: string;
declare var __GIT_COMMITHASH__: string;

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string;
	}

	// interface Platform {}

	// interface Session {}

	// interface Stuff {}
}
