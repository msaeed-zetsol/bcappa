const Language = () => {
    const svgMarkup = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16" cy="16" r="16" fill="#EAF8FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.0625 16C9.0625 21.2027 10.7973 22.9375 16 22.9375C21.2027 22.9375 22.9375 21.2027 22.9375 16C22.9375 10.7973 21.2027 9.0625 16 9.0625C10.7973 9.0625 9.0625 10.7973 9.0625 16Z" stroke="#0398E5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5234 18.4764L14.7039 14.7039L18.4764 13.5234L17.2959 17.2952L13.5234 18.4764Z" stroke="#0398E5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  
    return <SvgXml xml={svgMarkup} />;
  };
  
  export default Language;