import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateChannelPost = z.object({
  title: z.string(),
  body: z.string(),
  channelId: z.number(),
  gymRoleId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateChannelPost),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const channelPost = await db.channelPost.create({ data: input })

    return channelPost
  }
)
