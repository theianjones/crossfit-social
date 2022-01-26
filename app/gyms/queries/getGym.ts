import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetGym = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
  withOwner: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(GetGym),
  resolver.authorize(),
  async ({ id, withOwner = false }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const gym = await db.gym.findFirst({
      where: { id },
      ...(withOwner && {
        include: {
          gymRoles: { select: { user: { select: { name: true, email: true } } } },
        },
      }),
    })

    if (!gym) throw new NotFoundError()

    return gym
  }
)
