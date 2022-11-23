export function handleSetPrompt(
  medium,
  query,
  style,
  prompt,
  page,
  pageSetter,
  promptSetter
) {
  if (!medium && !query && !style && !prompt) return;

  if (page && pageSetter && page > 1) {
    pageSetter(1);
  }

  if (
    medium === process.env.NEXT_PUBLIC_DEFAULT_MEDIUM &&
    style === process.env.NEXT_PUBLIC_DEFAULT_STYLE
  ) {
    promptSetter(`Painting of ${query}`);
  } else if (
    medium !== process.env.NEXT_PUBLIC_DEFAULT_MEDIUM &&
    style !== process.env.NEXT_PUBLIC_DEFAULT_STYLE
  ) {
    promptSetter(`${medium} painting of ${query} in the ${style} style`);
  } else if (
    medium === process.env.NEXT_PUBLIC_DEFAULT_MEDIUM &&
    style !== process.env.NEXT_PUBLIC_DEFAULT_STYLE
  ) {
    promptSetter(`Painting of ${query} in the ${style} style`);
  } else if (
    medium !== process.env.NEXT_PUBLIC_DEFAULT_MEDIUM &&
    style === process.env.NEXT_PUBLIC_DEFAULT_STYLE
  ) {
    promptSetter(`${medium} painting of ${query}`);
  }
}
