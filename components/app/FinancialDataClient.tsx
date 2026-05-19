"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, Check, X, Loader2, Briefcase, Home, Car, PiggyBank, TrendingDown, CreditCard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { NumericInput } from "@/components/ui/NumericInput";

type Asset = { id: string; name: string; category: string; current_value: number; owned_by: string; mortgage_balance: number };
type Debt = { id: string; name: string; category: string; balance: number; owned_by: string };

type Labels = {
  save: string;
  cancel: string;
  deleteConfirm: string;
  name: string;
  value: string;
  owner: string;
  balance: string;
  joint: string;
  me: string;
  spouse: string;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(n);
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  real_estate: <Home size={14} />,
  vehicle: <Car size={14} />,
  retirement: <PiggyBank size={14} />,
  business: <Briefcase size={14} />,
  crypto: <TrendingDown size={14} />,
};

export function AssetList({ initialAssets, labels }: { initialAssets: Asset[]; labels: Labels }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initialAssets);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState(0);
  const [editOwner, setEditOwner] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function startEdit(a: Asset) {
    setEditId(a.id);
    setEditName(a.name);
    setEditValue(a.current_value);
    setEditOwner(a.owned_by);
    setDeleteId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, current_value: editValue, owned_by: editOwner }),
      });
      if (res.ok) {
        setAssets((prev) => prev.map((a) => a.id === id ? { ...a, name: editName, current_value: editValue, owned_by: editOwner } : a));
        setEditId(null);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteAsset(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        setDeleteId(null);
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  if (assets.length === 0) return null;

  return (
    <ul className="divide-y divide-[var(--sand)]">
      {assets.map((a) => (
        <li key={a.id} className="px-5 py-3">
          {editId === a.id ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={labels.name}
                  className="col-span-1 border border-[var(--sand)] rounded px-2 py-1 font-ui text-sm focus:outline-none focus:border-[var(--gold)]"
                />
                <NumericInput
                  value={editValue}
                  onChange={setEditValue}
                  placeholder={labels.value}
                  className="border border-[var(--sand)] rounded px-2 py-1 font-mono text-sm focus:outline-none focus:border-[var(--gold)]"
                />
                <select
                  value={editOwner}
                  onChange={(e) => setEditOwner(e.target.value)}
                  className="border border-[var(--sand)] rounded px-2 py-1 font-ui text-sm focus:outline-none focus:border-[var(--gold)]"
                >
                  <option value="joint">{labels.joint}</option>
                  <option value="me">{labels.me}</option>
                  <option value="spouse">{labels.spouse}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(a.id)}
                  disabled={saving}
                  className={cn(buttonVariants({ size: "sm" }), "bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90 text-xs", saving && "opacity-70")}
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  <span className="ml-1">{labels.save}</span>
                </button>
                <button onClick={() => setEditId(null)} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs border-[var(--sand)]")}>
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[var(--navy)] min-w-0">
                {CATEGORY_ICON[a.category] ?? <Briefcase size={14} />}
                <span className="font-ui text-sm truncate">{a.name}</span>
                <span className="font-ui text-xs text-[var(--brown)] capitalize shrink-0">{a.owned_by}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-sm text-[var(--navy)]">{fmt(a.current_value)}</span>
                {deleteId === a.id ? (
                  <>
                    <button
                      onClick={() => deleteAsset(a.id)}
                      disabled={deleting}
                      className="font-ui text-xs text-[var(--danger)] hover:underline"
                    >
                      {deleting ? <Loader2 size={12} className="animate-spin inline" /> : labels.deleteConfirm}
                    </button>
                    <button onClick={() => setDeleteId(null)} className="font-ui text-xs text-[var(--brown)]">
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(a)} className="p-1 text-[var(--brown)] hover:text-[var(--navy)] transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => { setDeleteId(a.id); setEditId(null); }} className="p-1 text-[var(--brown)] hover:text-[var(--danger)] transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function DebtList({ initialDebts, labels }: { initialDebts: Debt[]; labels: Labels }) {
  const router = useRouter();
  const [debts, setDebts] = useState(initialDebts);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBalance, setEditBalance] = useState(0);
  const [editOwner, setEditOwner] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function startEdit(d: Debt) {
    setEditId(d.id);
    setEditName(d.name);
    setEditBalance(d.balance);
    setEditOwner(d.owned_by);
    setDeleteId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/debts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, balance: editBalance, owned_by: editOwner }),
      });
      if (res.ok) {
        setDebts((prev) => prev.map((d) => d.id === id ? { ...d, name: editName, balance: editBalance, owned_by: editOwner } : d));
        setEditId(null);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteDebt(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/debts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDebts((prev) => prev.filter((d) => d.id !== id));
        setDeleteId(null);
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  if (debts.length === 0) return null;

  return (
    <ul className="divide-y divide-[var(--sand)]">
      {debts.map((d) => (
        <li key={d.id} className="px-5 py-3">
          {editId === d.id ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={labels.name}
                  className="col-span-1 border border-[var(--sand)] rounded px-2 py-1 font-ui text-sm focus:outline-none focus:border-[var(--gold)]"
                />
                <NumericInput
                  value={editBalance}
                  onChange={setEditBalance}
                  placeholder={labels.balance}
                  className="border border-[var(--sand)] rounded px-2 py-1 font-mono text-sm focus:outline-none focus:border-[var(--gold)]"
                />
                <select
                  value={editOwner}
                  onChange={(e) => setEditOwner(e.target.value)}
                  className="border border-[var(--sand)] rounded px-2 py-1 font-ui text-sm focus:outline-none focus:border-[var(--gold)]"
                >
                  <option value="joint">{labels.joint}</option>
                  <option value="me">{labels.me}</option>
                  <option value="spouse">{labels.spouse}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(d.id)}
                  disabled={saving}
                  className={cn(buttonVariants({ size: "sm" }), "bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90 text-xs", saving && "opacity-70")}
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  <span className="ml-1">{labels.save}</span>
                </button>
                <button onClick={() => setEditId(null)} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs border-[var(--sand)]")}>
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[var(--navy)] min-w-0">
                <CreditCard size={14} />
                <span className="font-ui text-sm truncate">{d.name}</span>
                <span className="font-ui text-xs text-[var(--brown)] capitalize shrink-0">{d.owned_by}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-sm text-[var(--danger)]">{fmt(d.balance)}</span>
                {deleteId === d.id ? (
                  <>
                    <button
                      onClick={() => deleteDebt(d.id)}
                      disabled={deleting}
                      className="font-ui text-xs text-[var(--danger)] hover:underline"
                    >
                      {deleting ? <Loader2 size={12} className="animate-spin inline" /> : labels.deleteConfirm}
                    </button>
                    <button onClick={() => setDeleteId(null)} className="font-ui text-xs text-[var(--brown)]">
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(d)} className="p-1 text-[var(--brown)] hover:text-[var(--navy)] transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => { setDeleteId(d.id); setEditId(null); }} className="p-1 text-[var(--brown)] hover:text-[var(--danger)] transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
