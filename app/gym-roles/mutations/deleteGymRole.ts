import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteGymRole = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteGymRole), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const gymRole = await db.gymRole.deleteMany({ where: { id } })

  return gymRole
})
