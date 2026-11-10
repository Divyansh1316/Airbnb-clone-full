"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";

interface WishlistItem {
  id: string;
  name: string;
  listingIds: string[];
  updatedAt: string;
}

export default function WishlistsClient({ wishlists }: { wishlists: WishlistItem[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const createWishlist = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/wishlists", { name });
      setName("");
      toast.success("Collection created");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Could not create collection.");
    } finally {
      setSaving(false);
    }
  };

  const deleteWishlist = async (id: string) => {
    try {
      await axios.delete(`/api/wishlists/${id}`);
      toast.success("Collection deleted");
      router.refresh();
    } catch {
      toast.error("Could not delete collection.");
    }
  };

  return (
    <Container>
      <Heading title="Wishlists" subtitle="Keep the stays you love together." />
      <form onSubmit={createWishlist} className="mt-8 flex max-w-lg gap-3">
        <input value={name} onChange={(event) => setName(event.target.value)} maxLength={50} required placeholder="e.g. Weekend by the sea" className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-3 dark:border-neutral-600 dark:bg-neutral-900" />
        <button disabled={saving} className="rounded-lg bg-rose-500 px-5 font-semibold text-white disabled:opacity-60">Create</button>
      </form>
      {wishlists.length ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishlists.map((wishlist) => (
            <article key={wishlist.id} className="rounded-2xl border border-neutral-200 p-5 shadow-sm dark:border-[#2b2e36]">
              <Link href={`/wishlists/${wishlist.id}`} className="block">
                <h2 className="text-lg font-semibold">{wishlist.name}</h2>
                <p className="mt-1 text-sm text-neutral-500">{wishlist.listingIds.length} saved {wishlist.listingIds.length === 1 ? "stay" : "stays"}</p>
              </Link>
              <button onClick={() => deleteWishlist(wishlist.id)} className="mt-4 text-sm text-rose-500 hover:underline">Delete collection</button>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-neutral-500">Create a collection, then save listings to it.</p>
      )}
    </Container>
  );
}
