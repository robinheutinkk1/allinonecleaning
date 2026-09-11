import "server-only";
import { cookies } from "next/headers";

/**
 * Demo-sessie voor de TagPoint Demo-beheeromgeving (/beheer).
 *
 * Dit is bewust géén echte authenticatie: de omgeving bevat alleen voorbeeldgegevens
 * en slaat niets op. Een cookie markeert dat de bezoeker via de demo-loginpagina is
 * binnengekomen, zodat de omgeving zich als een echt beheer gedraagt.
 */
export const DEMO_SESSION_COOKIE = "tp_demo_session";
export const DEMO_SESSION_VALUE = "demo";

/** Vooringevulde demo-inloggegevens (worden op de loginpagina getoond). */
export const DEMO_CREDENTIALS = { email: "demo@tagpoint.nl", password: "tagpoint-demo" } as const;

export async function hasDemoSession(): Promise<boolean> {
  const store = await cookies();
  return store.get(DEMO_SESSION_COOKIE)?.value === DEMO_SESSION_VALUE;
}
