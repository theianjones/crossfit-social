import { Head, BlitzLayout, Link, Routes, useMutation, useQuery, useSession } from "blitz"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { Content, Flex } from "@adobe/react-spectrum"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <Flex justifyContent={"space-between"} alignItems={"center"} gap={"size-250"}>
        <div>{currentUser.name || currentUser.email}</div>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
      </Flex>
    )
  } else {
    return (
      <Flex justifyContent={"space-between"} alignItems={"center"} gap={"size-250"}>
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
      </Flex>
    )
  }
}

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  const session = useSession()
  const count = (session?.gyms ?? []).length

  return (
    <Content height={"100vh"}>
      <Head>
        <title>{title || "crossfit-social"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent={"space-between"} alignItems={"center"} gap={"size-250"}>
        <Flex justifyContent={"space-between"} alignItems={"center"} gap={"size-250"}>
          <Link href={Routes.Home()}>CF Social</Link>
          {count > 0 && <Link href={Routes.GymsPage()}>Your Gyms</Link>}
        </Flex>
        <UserInfo />
      </Flex>
      <main className="px-6">{children}</main>
    </Content>
  )
}

export default Layout
