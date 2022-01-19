import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetGymRolesInput
  extends Pick<Prisma.GymRoleFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetGymRolesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: gymRoles,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.gymRole.count({ where }),
      query: (paginateArgs) => db.gymRole.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      gymRoles,
      nextPage,
      hasMore,
      count,
    }
  }
)
