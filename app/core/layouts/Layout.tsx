import { Head, BlitzLayout, Link, Routes, useMutation, useQuery, useSession } from "blitz"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "../hooks/useCurrentUser"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <div className="flex justify-between items-center gap-4">
        <div>{currentUser.name || currentUser.email}</div>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
      </div>
    )
  } else {
    return (
      <div className="flex justify-between items-center gap-4">
        <Link href={Routes.SignupPage()}>
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href={Routes.LoginPage()}>
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </div>
    )
  }
}

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  const session = useSession()
  const count = (session?.gyms ?? []).length

  return (
    <div>
      <Head>
        <title>{title || "crossfit-social"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-between items-center gap-4">
        <div className="flex justify-between items-center gap-4">
          <Link href={Routes.Home()}>CF Social</Link>
          {count > 0 && <Link href={Routes.GymsPage()}>Your Gyms</Link>}
        </div>
        <UserInfo />
      </div>
      <main className="px-6">{children}</main>
    </div>
  )
}

export default Layout
