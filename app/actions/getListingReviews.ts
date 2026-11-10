import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function getListingReviews(listingId: string) {
  const [reviews, currentUser] = await Promise.all([
    prisma.review.findMany({
      where: { listingId },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    getCurrentUser(),
  ]);

  const existingReview = currentUser
    ? await prisma.review.findUnique({
        where: { userId_listingId: { userId: currentUser.id, listingId } },
        select: { id: true },
      })
    : null;
  const completedStay = currentUser
    ? await prisma.reservation.findFirst({
        where: { listingId, userId: currentUser.id, endDate: { lte: new Date() } },
        select: { id: true },
      })
    : null;

  return {
    reviews: reviews.map((review) => ({ ...review, createdAt: review.createdAt.toISOString() })),
    canReview: Boolean(existingReview || completedStay),
  };
}
