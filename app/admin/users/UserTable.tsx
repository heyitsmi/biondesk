"use client";

import { useState } from "react";
import { updateUserRole } from "./actions";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export default function UserTable({ users }: { users: User[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await updateUserRole(userId, newRole);
      if (!res.success) {
        alert(res.error || "Failed to update role");
      } else {
        setEditingId(null);
      }
    } catch (err) {
        alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">User</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Joined</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 text-slate-500 font-bold shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                      <select 
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={isLoading}
                        className="bg-white border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-1.5"
                      >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                      </select>
                  ) : (
                    <span 
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'admin' 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                    >
                         {user.role === 'admin' && <i className="ph-fill ph-shield-star"></i>}
                        {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                    {editingId === user.id ? (
                         <button 
                            onClick={() => setEditingId(null)}
                            className="text-slate-500 hover:text-slate-700 text-xs font-medium"
                         >
                             Cancel
                         </button>
                    ) : (
                        <button 
                            onClick={() => setEditingId(user.id)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline"
                        >
                            Edit
                        </button>
                    )}
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No users found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
