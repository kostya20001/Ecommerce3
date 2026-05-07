import "./Footer.css"

function Footer(){
    return (
        <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>About</h3>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div className='footer-section'>
            <h3>Support</h3>
            <ul>
              <li>Contact</li>
              <li>FAQ</li>
              <li>Shipping</li>
            </ul>
          </div>
          <div className='footer-section'>
            <h3>Legal</h3>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Returns</li>
            </ul>
          </div>
          <div className='footer-section newsletter'>
            <h3>Newsletter</h3>
            <p>Subscribe for exclusive deals</p>
            <div className='newsletter-form'>
            <input type='email' placeholder='Your email address'/>
            <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <p>© 2026 TechStore. All rights reserved.</p>
        </div>
      </div>

    </footer>
    );

}

export default Footer;