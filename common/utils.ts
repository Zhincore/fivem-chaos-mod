/**
 * Replacment for C++'s `WAIT()`
 */
export async function sleep(duration: number) {
  return new Promise((r) => setTimeout(r, duration, undefined));
}
