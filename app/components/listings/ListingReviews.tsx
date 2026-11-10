"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillStar } from "react-icons/ai";
import { SafeUser } from "@/app/types";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

export default function ListingReviews({
  listingId,
  reviews,
  canReview,
  currentUser,
}: {
  listingId: string;
  reviews: ReviewItem[];
  canReview: boolean;
  currentUser?: SafeUser | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const average = useMemo(
    () => reviews.length ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1) : null,
    [reviews],
  );

  const submitReview = async () => {
    setSaving(true);
    try {
      await axios.post(`/api/listings/${listingId}/reviews`, { rating, comment });
      toast.success("Review saved");
      setComment("");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Could not save your review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-[#2b2e36]">
      <div className="flex items-center gap-2 text-xl font-semibold">
        <AiFillStar className="text-rose-500" />
        <span>{average ?? "New"}</span>
        <span className="text-neutral-500">· {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
      </div>

      {currentUser && canReview && (
        <div className="mt-6 rounded-xl border border-neutral-200 p-4 dark:border-[#2b2e36]">
          <h3 className="font-semibold">Share your experience</h3>
          <label className="mt-3 flex items-center gap-3 text-sm">
            Rating
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="rounded-md border bg-white px-3 py-2 dark:border-neutral-600 dark:bg-neutral-900">
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
            </select>
          </label>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={1000}
            placeholder="What did you like about your stay?"
            className="mt-3 min-h-24 w-full rounded-lg border border-neutral-300 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-900"
          />
          <button disabled={saving || comment.trim().length < 5} onClick={submitReview} className="mt-3 rounded-lg bg-rose-500 px-5 py-2 font-semibold text-white disabled:opacity-50">
            {saving ? "Saving…" : "Post review"}
          </button>
        </div>
      )}

      {currentUser && !canReview && (
        <p className="mt-3 text-sm text-neutral-500">Reviews unlock after a completed stay.</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-xl border border-neutral-200 p-4 dark:border-[#2b2e36]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{review.user.name || "Guest"}</span>
              <span className="flex items-center gap-1 text-sm"><AiFillStar className="text-rose-500" />{review.rating}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
