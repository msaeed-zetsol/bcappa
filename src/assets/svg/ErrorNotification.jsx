const ErrorNotification = () => {
    const svgMarkup = `
<svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="14.5097" cy="15.0773" rx="14.5097" ry="14.5148" fill="#F94040"/>
<path d="M12.676 8.02644H15.8205V18.2726H12.676V8.02644ZM15.3713 22.7647C14.7723 23.3636 13.7456 23.3636 13.1252 22.7647C12.5263 22.1658 12.5263 21.0962 13.1252 20.4973C13.7456 19.8983 14.7723 19.8983 15.3713 20.4973C15.9916 21.0962 15.9916 22.1658 15.3713 22.7647Z" fill="white"/>
</svg>

    `;
  
    return <SvgXml xml={svgMarkup}  height={40} width={40}/>;
  };
  
  export default ErrorNotification;