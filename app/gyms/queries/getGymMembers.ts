import { Ctx, paginate, resolver, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

interface GetGymMemberInput
  extends Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  gymId: string
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ gymId, where, orderBy, skip = 0, take = 100 }: GetGymMemberInput, ctx: Ctx) => {
    ctx.session.$authorize()

    if (!ctx.session.gyms.map((gym) => gym.gymId).includes(gymId)) {
      throw new AuthorizationError("You dont have access to that gym.")
    }
    const constructedWhere = {
      ...where,
      gymRoles: { some: { gymId } },
    }

    const {
      items: members,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.user.count({ where: constructedWhere }),
      query: (paginateArgs) =>
        db.user.findMany({ ...paginateArgs, where: constructedWhere, orderBy }),
    })

    return {
      members,
      nextPage,
      hasMore,
      count,
    }
  }
)
