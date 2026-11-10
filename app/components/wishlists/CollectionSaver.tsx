"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useLoginModal from "@/app/hooks/useLoginModal";

const CREATE_NEW = "__create_new_wishlist__";

interface WishlistOption {
  id: string;
  name: string;
}

export default function CollectionSaver({
  listingId,
  collections,
  signedIn,
}: {
  listingId: string;
  collections: WishlistOption[];
  signedIn: boolean;
}) {
  const loginModal = useLoginModal();
  const [availableCollections, setAvailableCollections] = useState(collections);
  const [selectedId, setSelectedId] = useState(collections[0]?.id ?? "");
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!signedIn) return loginModal.onOpen();
    if (!selectedId) return;

    setSaving(true);
    try {
      await axios.patch(`/api/wishlists/${selectedId}`, { listingId, action: "add" });
      toast.success("Saved to wishlist");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Could not save this stay.");
    } finally {
      setSaving(false);
    }
  };

  const createAndSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signedIn) return loginModal.onOpen();

    const name = newName.trim();
    if (!name) return;

    setSaving(true);
    try {
      const { data } = await axios.post("/api/wishlists", { name, listingId });
      setAvailableCollections((current) => [...current, { id: data.id, name: data.name }]);
      setSelectedId(data.id);
      setNewName("");
      setIsCreating(false);
      toast.success("Wishlist created and stay saved");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Could not create wishlist.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <select
          value={selectedId}
          onChange={(event) => {
            if (event.target.value === CREATE_NEW) {
              if (!signedIn) return loginModal.onOpen();
              setIsCreating(true);
              return;
            }
            setSelectedId(event.target.value);
          }}
          aria-label="Choose or create a wishlist"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
        >
          {!availableCollections.length && <option value="">Choose a wishlist</option>}
          {availableCollections.map((collection) => (
            <option key={collection.id} value={collection.id}>{collection.name}</option>
          ))}
          <option value={CREATE_NEW}>+ Create a new wishlist</option>
        </select>
        <button
          type="button"
          onClick={save}
          disabled={saving || (signedIn && !selectedId)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold disabled:opacity-50 dark:border-neutral-600"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={createAndSave} className="flex items-center gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            maxLength={50}
            required
            placeholder="Wishlist name"
            aria-label="New wishlist name"
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          />
          <button
            type="submit"
            disabled={saving || !newName.trim()}
            className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create & save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreating(false);
              setNewName("");
            }}
            className="px-2 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
