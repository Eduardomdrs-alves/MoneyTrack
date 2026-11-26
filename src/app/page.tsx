import { HomeTemplate } from "@/components/templates/home-template";
import { getCurrentUser } from "@/lib/session";

/** Landing page (Server Component) */
export default async function HomePage() {
  const user = await getCurrentUser();
  return <HomeTemplate isAuthenticated={Boolean(user)} />;
}
