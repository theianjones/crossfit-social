import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetGymRole = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetGymRole), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const gymRole = await db.gymRole.findFirst({ where: { id } })

  if (!gymRole) throw new NotFoundError()

  return gymRole
})
