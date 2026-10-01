/**
 * The backend has no "empty" opening_date: when none is sent it stores this
 * default. It lies before every schedule created in AZA, so filtering from
 * this date is the same as not filtering. The frontend treats it as "no
 * opening date": shown as empty/"Geen", and sent back when the field is left
 * empty (so a PUT can clear a previously set date).
 */
export const NO_OPENING_DATE = "2019-01-01"
