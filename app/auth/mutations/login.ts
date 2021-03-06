import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { Role, SessionGymReference } from "types"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)
  const gyms: SessionGymReference[] = await db.gymRole
    .findMany({ where: { userId: user.id }, select: { gymId: true, name: true } })
    .then((gymRoles) => {
      return gymRoles.map((role) => ({ gymId: role.gymId, role: role.name }))
    })

  await ctx.session.$create({ userId: user.id, role: user.role as Role, gyms })

  return user
})
