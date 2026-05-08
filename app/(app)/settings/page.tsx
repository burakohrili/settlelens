"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "ar", label: "العربية" },
];

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "TR", label: "Turkey" },
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

type Profile = {
  name: string;
  email: string;
  preferred_language: string;
  country: string;
  state_province: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    preferred_language: "en",
    country: "US",
    state_province: "",
  });
  const [userId, setUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [initials, setInitials] = useState("?");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/en/login");
        return;
      }
      setUserId(user.id);

      const { data } = await (
        supabase as unknown as {
          from: (t: string) => {
            select: (s: string) => {
              eq: (c: string, v: string) => {
                single: () => Promise<{ data: Profile | null }>;
              };
            };
          };
        }
      )
        .from("profiles")
        .select("name,email,preferred_language,country,state_province")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({ ...data, email: user.email ?? data.email ?? "" });
        const parts = (data.name ?? "").trim().split(" ");
        const ini =
          parts.length >= 2
            ? parts[0][0] + parts[parts.length - 1][0]
            : parts[0]?.[0] ?? "?";
        setInitials(ini.toUpperCase());
      }
    }
    load();
  }, [router, supabase]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await (
        supabase as unknown as {
          from: (t: string) => {
            update: (d: unknown) => {
              eq: (c: string, v: string) => Promise<unknown>;
            };
          };
        }
      )
        .from("profiles")
        .update({
          name: profile.name,
          preferred_language: profile.preferred_language,
          country: profile.country,
          state_province: profile.state_province,
        })
        .eq("id", userId);

      setSaveMsg("Changes saved.");
      const parts = profile.name.trim().split(" ");
      const ini =
        parts.length >= 2
          ? parts[0][0] + parts[parts.length - 1][0]
          : parts[0]?.[0] ?? "?";
      setInitials(ini.toUpperCase());
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    setPwSuccess("");
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) {
      setPwError(error.message);
    } else {
      setPwSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1
          className="text-2xl font-bold text-[#1C2B3A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-[#8B7355]">
          Manage your profile and preferences.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1C2B3A] text-2xl font-bold text-[#C8973A]">
          {initials}
        </div>
        <div>
          <p className="font-medium text-[#1C2B3A]">{profile.name || "Your Name"}</p>
          <p className="text-sm text-[#8B7355]">{profile.email}</p>
        </div>
      </div>

      {/* Profile section */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
        <h2 className="font-semibold text-[#1C2B3A]">Profile</h2>

        <div>
          <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm focus:border-[#C8973A] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full rounded-lg border border-[#D4C5B0] bg-[#F7F3EE] px-3 py-2 text-sm text-[#8B7355]"
          />
          <p className="mt-1 text-xs text-[#8B7355]">
            To change your email, contact support@settlelens.com
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
            Preferred Language
          </label>
          <select
            value={profile.preferred_language}
            onChange={(e) =>
              setProfile({ ...profile, preferred_language: e.target.value })
            }
            className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm focus:border-[#C8973A] focus:outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
              Country
            </label>
            <select
              value={profile.country}
              onChange={(e) =>
                setProfile({ ...profile, country: e.target.value, state_province: "" })
              }
              className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm focus:border-[#C8973A] focus:outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {profile.country === "US" && (
            <div>
              <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
                State
              </label>
              <select
                value={profile.state_province}
                onChange={(e) =>
                  setProfile({ ...profile, state_province: e.target.value })
                }
                className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm focus:border-[#C8973A] focus:outline-none"
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {saveMsg && (
          <p
            className={`text-sm ${saveMsg.includes("Failed") ? "text-[#E85252]" : "text-[#4FA86E]"}`}
          >
            {saveMsg}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#1C2B3A] px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Password section */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
        <h2 className="font-semibold text-[#1C2B3A]">Change Password</h2>

        <div>
          <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm focus:border-[#C8973A] focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm focus:border-[#C8973A] focus:outline-none"
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm focus:border-[#C8973A] focus:outline-none"
            placeholder="Repeat new password"
          />
        </div>

        {pwError && <p className="text-sm text-[#E85252]">{pwError}</p>}
        {pwSuccess && <p className="text-sm text-[#4FA86E]">{pwSuccess}</p>}

        <button
          onClick={handlePasswordChange}
          disabled={pwSaving || !newPassword}
          className="rounded-lg bg-[#2E4D6B] px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {pwSaving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
