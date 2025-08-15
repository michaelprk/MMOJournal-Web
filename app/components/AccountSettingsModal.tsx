import React, { useMemo, useState } from "react";
import Modal from "./ui/Modal";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AccountSettingsModal({ isOpen, onClose }: Props) {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const canDelete = useMemo(() => confirmText.trim().toUpperCase() === "DELETE MY ACCOUNT", [confirmText]);

  const handleDownload = async () => {
    if (!user?.id) return;
    setError(null);
    setBusy(true);
    try {
      const [profileRes, buildsRes, huntsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("pokemon_builds").select("*").eq("user_id", user.id),
        supabase.from("shiny_hunts").select("*").eq("user_id", user.id),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (buildsRes.error) throw buildsRes.error;
      if (huntsRes.error) throw huntsRes.error;

      const payload = {
        meta: {
          generated_at: new Date().toISOString(),
          user_id: user.id,
        },
        profile: profileRes.data || null,
        pokemon_builds: buildsRes.data || [],
        shiny_hunts: huntsRes.data || [],
      } as const;

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mmojournal_export_${user.id}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || "Failed to export data");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !canDelete) return;
    setError(null);
    setBusy(true);
    try {
      // Delete user-owned rows. Order chosen to minimize FK issues.
      const delBuilds = await supabase.from("pokemon_builds").delete().eq("user_id", user.id);
      if (delBuilds.error) throw delBuilds.error;

      const delHunts = await supabase.from("shiny_hunts").delete().eq("user_id", user.id);
      if (delHunts.error) throw delHunts.error;

      const delProfile = await supabase.from("profiles").delete().eq("user_id", user.id);
      if (delProfile.error) throw delProfile.error;

      // Sign out after delete
      await signOut();
      onClose();
      window.location.assign("/login");
    } catch (e: any) {
      setError(e?.message || "Failed to delete account data");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
      <div className="space-y-4">
        <p className="text-white/80 text-sm">
          Download a copy of your data, or delete your account data. Deleting will permanently remove your
          builds, hunts, and profile from MMOJournal. This cannot be undone.
        </p>

        {error && (
          <div className="rounded-md border border-red-600/50 bg-red-500/10 p-2 text-red-300 text-sm">
            {String(error)}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={busy || !user}
            className="rounded-md bg-yellow-400 px-3 py-2 font-semibold text-black disabled:opacity-60"
          >
            Download My Data (JSON)
          </button>
          <button
            onClick={() => setConfirming((v) => !v)}
            disabled={busy || !user}
            className="rounded-md border border-red-600 px-3 py-2 font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-60"
          >
            Delete Account…
          </button>
        </div>

        {confirming && (
          <div className="mt-2 space-y-2 rounded-md border border-white/15 p-3">
            <p className="text-white/70 text-sm">
              Type <span className="font-mono font-bold text-white">DELETE MY ACCOUNT</span> to confirm. This
              permanently removes your data from MMOJournal tables.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={!canDelete || busy}
                className="rounded-md bg-red-600 px-3 py-2 font-semibold text-white disabled:opacity-60"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setConfirming(false);
                  setConfirmText("");
                }}
                disabled={busy}
                className="rounded-md border border-white/20 px-3 py-2 text-white/80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}


