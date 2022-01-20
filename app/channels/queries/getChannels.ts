import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetChannelsInput
  extends Pick<Prisma.ChannelFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetChannelsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: channels,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.channel.count({ where }),
      query: (paginateArgs) => db.channel.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      channels,
      nextPage,
      hasMore,
      count,
    }
  }
)
