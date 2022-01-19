import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetGymsInput
  extends Pick<Prisma.GymFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetGymsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: gyms,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.gym.count({ where }),
      query: (paginateArgs) => db.gym.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      gyms,
      nextPage,
      hasMore,
      count,
    }
  }
)
