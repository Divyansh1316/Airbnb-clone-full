"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import useLoginModal from "@/app/hooks/useLoginModal";

export default function CollectionSaver({
  listingId,
  collections,
  signedIn,
}: {
  listingId: string;
  collections: { id: string; name: string }[];
  signedIn: boolean;
}) {
  const loginModal = useLoginModal();
  const [selectedId, setSelectedId] = useState(collections[0]?.id ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!signedIn) return loginModal.onOpen();
    if (!selectedId) return;
    setSaving(true);
    try {
      await axios.patch(`/api/wishlists/${selectedId}`, { listingId, action: "add" });
      toast.success("Saved to collection");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Could not save this stay.");
    } finally {
      setSaving(false);
    }
  };

  if (signedIn && collections.length === 0) {
    return <Link href="/wishlists" className="text-sm font-semibold underline underline-offset-4">Create a wishlist</Link>;
  }

  return (
    <div className="flex items-center gap-2">
      <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} aria-label="Choose a wishlist" className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900">
        {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
        {!signedIn && <option value="">Save to wishlist</option>}
      </select>
      <button onClick={save} disabled={saving} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold disabled:opacity-50 dark:border-neutral-600">
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
