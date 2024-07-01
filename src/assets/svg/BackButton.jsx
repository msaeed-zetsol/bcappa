import React from 'react';
import { SvgXml } from 'react-native-svg';

const BackButton = () => {
  const svgMarkup = `
<svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="58" height="58" rx="15" fill="#F1F3FF"/>
<path d="M19.958 29.3202L37.458 29.3202" stroke="#02A7FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.0166 36.3487C27.0166 36.3487 19.9583 32.5442 19.9583 29.3218C19.9583 26.0972 27.0166 22.2915 27.0166 22.2915" stroke="#02A7FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `;

  return <SvgXml xml={svgMarkup} width="55" height="55" />;
};

export default BackButton;
