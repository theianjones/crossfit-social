import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateChannel = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateChannel),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const channel = await db.channel.update({ where: { id }, data })

    return channel
  }
)
