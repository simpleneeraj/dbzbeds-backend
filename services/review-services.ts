import reviews from "../models/reviews";

export const createReviewService = async (review: any) => {
  try {
    const newReview = await reviews.create(review);
    return newReview;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const approveReviewService = async (id: string) => {
  try {
    const review = await reviews.findByIdAndUpdate(
      id,
      {
        isApproved: true,
      },
      { new: true }
    );
    return review;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const denyReviewService = async (id: string) => {
  try {
    const review = await reviews.findByIdAndUpdate(
      id,
      {
        isApproved: false,
      },
      { new: true }
    );
    return review;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getPaginationsService = async (
  filters: any,
  limit: number,
  page: number
) => {
  try {
    const reviewsCount = await reviews.countDocuments(filters);
    const pages = Math.ceil(Number(reviewsCount) / Number(limit));
    return {
      totalPages: pages,
      nextPage: Number(page) < pages ? Number(page) + 1 : null,
    };
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getReviewsAdminService = async () => {
  try {
    const allReviews = await reviews.find();
    return allReviews;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getReviewsService = async () => {
  try {
    const allReviews = await reviews.find({ isApproved: true });
    return allReviews;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getReviewsByProductIdAdminService = async (id: string) => {
  try {
    const allReviews = await reviews.find({ productId: id });
    return allReviews;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getReviewsByProductIdService = async (id: string) => {
  try {
    const allReviews = await reviews.find({ productId: id, isApproved: true });
    return allReviews;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deleteReviewService = async (id: string) => {
  try {
    const review = await reviews.findByIdAndDelete(id);
    return review;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
