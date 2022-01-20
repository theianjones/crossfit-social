import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetChannel = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetChannel), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const channel = await db.channel.findFirst({ where: { id } })

  if (!channel) throw new NotFoundError()

  return channel
})
