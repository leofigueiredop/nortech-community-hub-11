
import React from 'react';

interface PaymentIconProps {
  name: string;
  bgColorClass: string;
  textColorClass: string;
  type: 'square' | 'rounded' | 'circle';
}

const PaymentIcon: React.FC<PaymentIconProps> = ({
  name,
  bgColorClass,
  textColorClass,
  type
}) => {
  const shapeClasses = {
    square: 'w-12 h-8 rounded',
    rounded: 'w-12 h-8 rounded-lg',
    circle: 'w-8 h-8 rounded-full'
  };

  return (
    <div className={`${bgColorClass} ${textColorClass} ${shapeClasses[type]} flex items-center justify-center font-bold text-xs`}>
      {name}
    </div>
  );
};

export default PaymentIcon;
