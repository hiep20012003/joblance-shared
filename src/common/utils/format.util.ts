export function uppercaseFirstLetter(str: string): string {
  const valueString = str.toLowerCase();
  return valueString
    .split(' ')
    .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
    .join(' ');
}

export function toKebabCase(input: string): string {
  return input
    // Chuyển snake_case, UPPER_SNAKE_CASE thành space để xử lý chung
    .replace(/[_\s]+/g, '-')
    // Chuyển PascalCase / camelCase thành kebab-case
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1-$2')
    // Viết thường toàn bộ
    .toLowerCase();
}
