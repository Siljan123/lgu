/**
 * Formats a contact input as a PH mobile number:
 * - Local: 0912-345-6789
 * - International: +63 912 345 6789 (if input starts with "+")
 * Strips any letters/symbols — digits and a leading "+" only.
 */
export function formatContactInput(value: string): string {
  const isIntl = value.trim().startsWith('+')
  let digits = value.replace(/\D/g, '') // strips everything except digits

  if (isIntl) {
    if (digits.startsWith('63')) {
      digits = digits.slice(2)
    }
    digits = digits.slice(0, 10) // 9XX XXX XXXX

    let formatted = '+63'
    if (digits.length > 0) formatted += ` ${digits.slice(0, 3)}`
    if (digits.length > 3) formatted += ` ${digits.slice(3, 6)}`
    if (digits.length > 6) formatted += ` ${digits.slice(6, 10)}`
    return formatted
  }

  digits = digits.slice(0, 11)
  if (digits.length > 7) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`
  } else if (digits.length > 4) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  }
  return digits
}

/**
 * Validates PH mobile number, local or international format.
 */
export function isValidContact(value: string): boolean {
  const localPattern = /^09\d{2}-\d{3}-\d{4}$/
  const intlPattern = /^\+63 9\d{2} \d{3} \d{4}$/
  return localPattern.test(value) || intlPattern.test(value)
}