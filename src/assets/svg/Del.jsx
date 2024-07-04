import React from 'react';
import { SvgXml } from 'react-native-svg';

const Del = () => {
  const svgMarkup = `
<svg width="11" height="34" viewBox="0 0 11 34" fill="red" xmlns="http://www.w3.org/2000/svg">
<circle cx="2" cy="2" r="2" fill="#D9D9D9"/>
<circle cx="9" cy="2" r="2" fill="#D9D9D9"/>
<circle cx="2" cy="12" r="2" fill="#D9D9D9"/>
<circle cx="2" cy="22" r="2" fill="#D9D9D9"/>
<circle cx="2" cy="32" r="2" fill="#D9D9D9"/>
<circle cx="9" cy="12" r="2" fill="#D9D9D9"/>
<circle cx="9" cy="22" r="2" fill="#D9D9D9"/>
<circle cx="9" cy="32" r="2" fill="#D9D9D9"/>
</svg>

  `;

  return <SvgXml xml={svgMarkup}  fill="red"/>;
};
export default Del ;