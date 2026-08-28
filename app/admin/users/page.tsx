import { createClient } from "@/lib/supabase/server";
import RoleSelect from "@/components/admin/RoleSelect";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink">Users</h1>
      <p className="text-sm text-ink/50 mt-1">
        Manually upgrade a student to Premium, or promote another admin.
      </p>
      <div className="mt-8 border border-line bg-white rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-ink/40 text-xs uppercase tracking-widest">
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-ink">{u.email}</td>
                <td className="px-5 py-3 text-ink/50">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <RoleSelect userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(users ?? []).length === 0 && (
          <p className="px-5 py-6 text-sm text-ink/40">No users yet.</p>
        )}
      </div>
    </div>
  );
}
