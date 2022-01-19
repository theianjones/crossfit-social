import createGymRole from "app/gym-roles/mutations/createGymRole"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateGym = z.object({
  name: z.string(),
  gymRoles: z.array(z.object({ email: z.string() })),
})

export default resolver.pipe(
  resolver.zod(CreateGym),
  resolver.authorize(),
  async ({ gymRoles, ...input }, ctx) => {
    const gym = await db.gym.create({ data: input })
    const emails = gymRoles.map((owner) => owner.email)
    const newGymRoles = await db.user
      .findMany({
        where: { email: { in: emails } },
        select: { id: true },
      })
      .then((owners) =>
        owners.map(
          async (owner) =>
            await createGymRole(
              {
                gymId: gym.id,
                userId: owner.id,
                name: "owner",
              },
              ctx
            )
        )
      )

    return gym
  }
)
