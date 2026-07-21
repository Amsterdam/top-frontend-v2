import dayjs from "dayjs"

export const dummyMeldingenResponse: Melding[] = [
  {
    startDatum: dayjs().subtract(10, "day").format(),
    eindDatum: dayjs().subtract(7, "day").format(),
    nachten: 3,
    gasten: 4,
    isAangepast: true,
    isVerwijderd: true,
    gemaaktOp: dayjs()
      .subtract(24, "day")
      .set("hour", 10)
      .set("minute", 32)
      .format(),
  },
  {
    startDatum: dayjs().subtract(30, "day").format(),
    eindDatum: dayjs().subtract(28, "day").format(),
    nachten: 2,
    gasten: 1,
    isAangepast: false,
    isVerwijderd: false,
    gemaaktOp: dayjs()
      .subtract(40, "day")
      .set("hour", 22)
      .set("minute", 2)
      .format(),
  },
  {
    startDatum: dayjs().subtract(50, "day").format(),
    eindDatum: dayjs().subtract(48, "day").format(),
    nachten: 2,
    gasten: 4,
    isAangepast: true,
    isVerwijderd: false,
    gemaaktOp: dayjs()
      .subtract(50, "day")
      .set("hour", 18)
      .set("minute", 8)
      .format(),
  },
  {
    startDatum: dayjs().subtract(60, "day").format(),
    eindDatum: dayjs().subtract(58, "day").format(),
    nachten: 2,
    gasten: 3,
    isAangepast: false,
    isVerwijderd: false,
    gemaaktOp: dayjs()
      .subtract(60, "day")
      .set("hour", 18)
      .set("minute", 8)
      .format(),
  },
  {
    startDatum: dayjs().subtract(70, "day").format(),
    eindDatum: dayjs().subtract(67, "day").format(),
    nachten: 3,
    gasten: 4,
    isAangepast: false,
    isVerwijderd: false,
    gemaaktOp: dayjs()
      .subtract(70, "day")
      .set("hour", 9)
      .set("minute", 29)
      .format(),
  },
  {
    startDatum: dayjs().subtract(80, "day").format(),
    eindDatum: dayjs().subtract(75, "day").format(),
    nachten: 5,
    gasten: 4,
    isAangepast: true,
    isVerwijderd: false,
    gemaaktOp: dayjs()
      .subtract(80, "day")
      .set("hour", 18)
      .set("minute", 7)
      .format(),
  },
]

export default dummyMeldingenResponse
