/**
 * En format 06.01.02.03.04
 */
export const getPhoneNumberInString = (phoneNumber: string): string => {
  let phoneMatch: RegExpMatchArray | null = null
  if (phoneNumber.length <= 10) {
    phoneMatch = phoneNumber.match(/.{1,2}/g)
  }

  return phoneMatch ? phoneMatch.join('.') : phoneNumber
}
