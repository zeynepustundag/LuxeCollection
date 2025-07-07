// src/components/ProductCard.tsx
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, price, popularityScore, images } = product;

  // Derive available color keys from images object
  const colors = Object.keys(images) as string[];

  // Initialize selected color to first available
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    if (swiper) {
      const index = colors.indexOf(selectedColor);
      if (index >= 0) swiper.slideTo(index);
    }
  }, [selectedColor, swiper, colors]);

  // Render stars with halves
  const renderStars = () => {
  const rating = popularityScore * 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const stars: JSX.Element[] = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar key={`full-${i}`} className="text-amber-500 w-4 h-4 inline-block" />
    );
  }

  if (halfStar) {
    stars.push(
      <FaStarHalfAlt key="half" className="text-amber-500 w-4 h-4 inline-block" />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-${i}`} className="text-gray-300 w-4 h-4 inline-block" />
    );
  }

  return stars;
};

  // Map color keys to display names and hex codes
  const colorMap: Record<string, { name: string; hex: string }> = {
    yellow: { name: 'Yellow Gold', hex: '#E6CA97' },
    white: { name: 'White Gold', hex: '#D9D9D9' },
    rose: { name: 'Rose Gold', hex: '#E1A4A9' },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      {/* Image Carousel */}
      <div className="relative">
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation]}
          navigation
          initialSlide={colors.indexOf(selectedColor)}
          onSlideChange={({ activeIndex }) => setSelectedColor(colors[activeIndex])}
          className="h-56"
          style={{
            '--swiper-navigation-color': '#000000',
            '--swiper-navigation-size': '1.5rem'
          } as React.CSSProperties}
        >
          {colors.map(colorKey => (
            <SwiperSlide key={colorKey}>
              <img
                src={images[colorKey]}
                alt={`${name} in ${colorMap[colorKey]?.name || colorKey}`}
                className="w-full h-56 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-montserrat text-black truncate">{name}</h3>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <p className="text-base font-montserrat text-black">${price} USD</p>
          </div>
          
        </div>

        {/* Color picker */}
        <div className="mt-2 flex items-center gap-2">
          {colors.map(colorKey => (
            <button
              key={colorKey}
              onClick={() => setSelectedColor(colorKey)}
              className={`w-6 h-6 rounded-full border-[1.5px] focus:outline-none ${selectedColor === colorKey ? 'border-black' : 'border-transparent'
                }`}
              style={{ backgroundColor: colorMap[colorKey]?.hex || '#ccc' }}
              aria-label={colorMap[colorKey]?.name || colorKey}
            />
          ))}
        </div>
        <div>
          <p className="mt-2 text-sm text-slate-500 font-montserrat">
            {colorMap[selectedColor]?.name || selectedColor}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-1">
          {renderStars()}
          <span className="text-sm text-slate-500 ml-1 font-montserrat">{(popularityScore * 5).toFixed(1) }/5</span>
        </div>
      </div>
    </div>
  )
};
