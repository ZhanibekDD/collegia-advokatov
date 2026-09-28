import Link from "next/link";
import { KeyRound } from "lucide-react";
import { safeAdminReturnPath } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ return_to?: string; error?: string }> }) {
  const params = await searchParams;
  const returnTo = safeAdminReturnPath(params.return_to ?? "/admin");
  return (
    <main className="admin-access-page admin-login-page">
      <section>
        <span><KeyRound aria-hidden="true" /></span>
        <h1>Вход в управление сайтом</h1>
        <p>Введите пароль администратора Коллегии адвокатов области Жетісу.</p>
        <form action="/api/admin/login" method="post">
          <input type="hidden" name="return_to" value={returnTo} />
          <label htmlFor="admin-password">Пароль</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus />
          {params.error ? <div className="admin-login-error" role="alert">Неверный пароль. Попробуйте ещё раз.</div> : null}
          <button type="submit">Войти</button>
        </form>
        <Link href="/">Вернуться на сайт</Link>
      </section>
    </main>
  );
}
