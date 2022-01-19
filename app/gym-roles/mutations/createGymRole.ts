import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { roles } from "../roles"

const CreateGymRole = z.object({
  name: z.string(),
  userId: z.number(),
  gymId: z.string(),
})

class CreateGymRoleError extends Error {}

export default resolver.pipe(
  resolver.zod(CreateGymRole),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    if (!roles.includes(input.name)) {
      throw new CreateGymRoleError(`role name was not included in expected list of roles.`)
    }

    const gymRole = await db.gymRole.create({ data: input })
    const oldGyms = ctx.session.$publicData.gyms
    await ctx.session.$setPublicData({
      gyms: [...oldGyms, { gymId: gymRole.gymId, role: gymRole.name }],
    })

    return gymRole
  }
)
