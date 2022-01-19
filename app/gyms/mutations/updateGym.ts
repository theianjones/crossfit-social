import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateGym = z.object({
  id: z.string(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateGym),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const gym = await db.gym.update({
      where: { id },
      data,
    })

    return gym
  }
)
