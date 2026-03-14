/**
 * Simple class name merger utility
 */
export const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');
