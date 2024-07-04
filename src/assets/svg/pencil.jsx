import React from 'react';
import { SvgXml } from 'react-native-svg';

const Pencil = () => {
  const svgMarkup = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 27H6C5.73478 27 5.48043 26.8946 5.29289 26.7071C5.10536 26.5196 5 26.2652 5 26V20.4142C5 20.2829 5.02587 20.1529 5.07612 20.0315C5.12638 19.9102 5.20004 19.8 5.29289 19.7071L20.2929 4.70711C20.4804 4.51957 20.7348 4.41421 21 4.41421C21.2652 4.41421 21.5196 4.51957 21.7071 4.70711L27.2929 10.2929C27.4804 10.4804 27.5858 10.7348 27.5858 11C27.5858 11.2652 27.4804 11.5196 27.2929 11.7071L12 27Z" stroke="#5A5A5C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 8L24 15" stroke="#5A5A5C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M27 27H12L5.0636 20.0636" stroke="#5A5A5C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
};

export default Pencil;