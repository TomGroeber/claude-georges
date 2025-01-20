import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PropTypes from 'prop-types';

export default function LazyLoadImageProp({ imageSrc, className }) {
  return (
    <div>
      <LazyLoadImage
        alt="vacation_image"
        className={`${className ? className : 'h-10 w-10 border-2 rounded-full'} object-cover`}
        src={imageSrc}
        effect="blur"
      />
    </div>
  );
}

LazyLoadImageProp.propTypes = {
  imageSrc: PropTypes.any,
  className: PropTypes.any
};
