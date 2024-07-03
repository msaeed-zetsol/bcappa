import React from 'react';
import { SvgXml } from 'react-native-svg';

const Camera = () => {
  const svgMarkup = `
 <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.8652 9.415C11.8652 7.96763 10.6915 6.79395 9.2441 6.79395C7.79673 6.79395 6.62305 7.96763 6.62305 9.415C6.62305 10.8624 7.79673 12.0361 9.2441 12.0361C10.6915 12.0361 11.8652 10.8624 11.8652 9.415Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.24384 15.8337C15.9482 15.8337 16.7465 13.8249 16.7465 9.47225C16.7465 6.42137 16.343 4.78892 13.8017 4.08716C13.5684 4.01348 13.3096 3.87313 13.1 3.64243C12.7614 3.27138 12.514 2.1319 11.6965 1.78716C10.8789 1.44331 7.5956 1.45909 6.79121 1.78716C5.9877 2.11611 5.7263 3.27138 5.3877 3.64243C5.17805 3.87313 4.92016 4.01348 4.68595 4.08716C2.14472 4.78892 1.74121 6.42137 1.74121 9.47225C1.74121 13.8249 2.53946 15.8337 9.24384 15.8337Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3367 6.50065H13.3442" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `;

  return <SvgXml xml={svgMarkup}  width={18} height={18}/>;
};

export default Camera;
