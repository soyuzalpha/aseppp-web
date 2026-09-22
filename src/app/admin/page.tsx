import { isAdmin } from "@/lib/auth";
import AdminClient from "./AdminClient";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return (await isAdmin()) ? <AdminClient /> : <LoginForm />;
}
