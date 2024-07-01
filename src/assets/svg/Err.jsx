import React from 'react';
import { SvgXml } from 'react-native-svg';

const Err = () => {
  const svgMarkup = `
  <svg width="107" height="108" viewBox="0 0 107 108" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="53.4899" cy="53.5839" rx="53.4899" ry="53.5087" fill="#F94040"/>
<path d="M46.7314 28.8H58.3234V66.5726H46.7314V28.8ZM56.6674 83.1326C54.4594 85.3406 50.6743 85.3406 48.3874 83.1326C46.1794 80.9246 46.1794 76.9817 48.3874 74.7737C50.6743 72.5657 54.4594 72.5657 56.6674 74.7737C58.9543 76.9817 58.9543 80.9246 56.6674 83.1326Z" fill="white"/>
</svg>

  `;

  return <SvgXml xml={svgMarkup} width="100%" height="100%" />;
};

export default Err;

