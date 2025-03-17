import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    id: 1,
    src: '/Banner 3.jpg',
  }
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg md:rounded-2xl">
      <div className="relative">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt="Banner"
              className="w-full h-auto object-cover max-h-[200px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[500px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel; 