export function cleanValue(input: HTMLInputElement, regex: RegExp): string {
  const { value } = input;
  const cursor = input.selectionStart as number;

  const beforeCursor = value.slice(0, cursor);
  const afterCursor = value.slice(cursor, value.length);

  const filteredBeforeCursor = beforeCursor.replace(regex, '');
  const filterAfterCursor = afterCursor.replace(regex, '');

  const newValue = filteredBeforeCursor + filterAfterCursor;
  const newCursor = filteredBeforeCursor.length;

  input.value = newValue;
  input.selectionStart = newCursor;
  input.selectionEnd = newCursor;

  return newValue;
}
