import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetChannelPostsInput
  extends Pick<Prisma.ChannelPostFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetChannelPostsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: channelPosts,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.channelPost.count({ where }),
      query: (paginateArgs) =>
        db.channelPost.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            gymRole: {
              include: { user: { select: { email: true, name: true } } },
            },
          },
        }),
    })

    return {
      channelPosts,
      nextPage,
      hasMore,
      count,
    }
  }
)
