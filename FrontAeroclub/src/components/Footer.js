import React, { useEffect, useState } from 'react';
import '../components/styles/Footer.css'


function Footer() {
   
  return (
    <footer className="footer">
      <div className="footer-content">
        <nav>
          <ul>
            <p>Desarrolladores:</p>
            <li><a href="https://www.linkedin.com/in/agustinmoscato/" target='blank'>Agustín Moscato</a></li>
            <li><a href="https://www.linkedin.com/in/juanigpunte/" target='blank'>Juan Ignacio Punte</a></li>
            <li><a href="https://www.linkedin.com/in/katherineluzmolinategaldi/" target='blank'>Katherine Molina</a></li>
            <li><a href="https://github.com/Renn4" target='blank'>Martín Peralta</a></li>
            <li><a href="https://www.linkedin.com/in/eric-andy-arias" target='blank'>Eric Andy Arias</a></li>
          </ul>
        </nav>
        <p>&copy; 2025 All rights reserved.</p>
      </div>
    </footer>
  );


}

export default Footer;