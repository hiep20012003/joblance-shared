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

export function base64ToBase64Url(base64: string) {
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  return `${name[0]}****@${domain}`;
};

// Convert text to slug format
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fromSlug(slug: string): string {
  return slug
    .replace(/\band\b/g, '&')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
