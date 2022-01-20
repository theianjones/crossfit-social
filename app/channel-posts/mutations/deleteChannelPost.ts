import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteChannelPost = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteChannelPost),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const channelPost = await db.channelPost.deleteMany({ where: { id } })

    return channelPost
  }
)
