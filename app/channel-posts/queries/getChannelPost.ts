import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetChannelPost = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetChannelPost), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const channelPost = await db.channelPost.findFirst({ where: { id } })

  if (!channelPost) throw new NotFoundError()

  return channelPost
})
