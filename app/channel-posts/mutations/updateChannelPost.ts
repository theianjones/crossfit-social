import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateChannelPost = z.object({
  id: z.number(),
  title: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateChannelPost),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const channelPost = await db.channelPost.update({ where: { id }, data })

    return channelPost
  }
)
