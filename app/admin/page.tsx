import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import { isAdminUser } from "../lib/admin-auth";
import AdminDashboard from "./admin-dashboard";

export const dynamic = "force-dynamic";

async function AdminGate() {
  const user = await requireChatGPTUser("/admin");
  if (!isAdminUser(user)) {
    return (
      <main className="admin-access-page">
        <section>
          <span><LockKeyhole /></span>
          <h1>Доступ не предоставлен</h1>
          <p>Аккаунт <strong>{user.email}</strong> не включён в список администраторов сайта.</p>
          <Link href="/">Вернуться на сайт</Link>
        </section>
      </main>
    );
  }
  return <AdminDashboard userName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}

export default function AdminPage() {
  return <AdminGate />;
}
