import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateGymRole = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateGymRole),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const gymRole = await db.gymRole.update({ where: { id }, data })

    return gymRole
  }
)
