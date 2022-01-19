import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteGym = z.object({
  id: z.string(),
})

export default resolver.pipe(resolver.zod(DeleteGym), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const gym = await db.gym.deleteMany({ where: { id } })

  return gym
})
