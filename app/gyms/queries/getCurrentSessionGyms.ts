import { Ctx, paginate, resolver } from "blitz"
import db, { Prisma } from "db"
import getGyms from "./getGyms"

interface GetGymsInput
  extends Pick<Prisma.GymFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetGymsInput, ctx: Ctx) => {
    ctx.session.$authorize()
    const currentSessionWhere = {
      ...where,
      id: { in: ctx.session.gyms.map((gym) => gym.gymId) },
    }

    const result = await getGyms(
      {
        where: currentSessionWhere,
        orderBy,
        skip,
        take,
      },
      ctx
    )

    return result
  }
)
