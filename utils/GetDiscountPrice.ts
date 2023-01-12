interface IDiscountProps {
  percent: number;
  max: number;
  price: number;
}

export const getDiscountCouponPrice = ({
  percent,
  max,
  price,
}: IDiscountProps) => {
  const discountAmount = (percent / 100) * price;
  if (discountAmount > max) {
    return price - max;
  } else {
    return discountAmount;
  }
};
