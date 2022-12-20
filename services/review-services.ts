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

export const deleteReviewService = async (id: string) => {
  try {
    const review = await reviews.findByIdAndDelete(id);
    return review;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
