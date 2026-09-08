/**
 * Kleine className-helper (geen extra dependency nodig).
 * Filtert falsy waarden en voegt classes samen.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
