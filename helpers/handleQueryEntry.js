export function handleQueryEntry(value, setter) {
  let timeoutId;
  function enter(value) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      setter(value.trim());
    }, 250);
  }
  enter(value);
}