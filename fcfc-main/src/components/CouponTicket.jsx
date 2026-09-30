import React from 'react';
import QRCode from 'react-qr-code';
import { Globe } from 'lucide-react';
import './CouponTicket.css';
import couponBg from '../assets/couponbg.png';

const AndroidIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67C5.46,5.39,5.11,5.31,4.81,5.45C4.52,5.61,4.4,6,4.56,6.3l1.84,3.18 C2.69,11.53,0,15.68,0,20h24C24,15.68,21.31,11.53,17.6,9.48z M6,17c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S6.55,17,6,17z M18,17 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S18.55,17,18,17z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.49 3.607-2.94 1.154-1.687 1.628-3.326 1.654-3.413-.038-.013-3.197-1.226-3.223-4.857-.026-3.04 2.484-4.509 2.597-4.575-1.417-2.078-3.606-2.364-4.385-2.441-1.921-.194-4.004 1.162-4.527 1.162zm2.944-4.908c.81-.974 1.353-2.33 1.205-3.676-1.157.046-2.585.768-3.42 1.74-.75.817-1.393 2.193-1.218 3.523 1.292.1 2.623-.623 3.433-1.587z"/>
  </svg>
);

export default function CouponTicket({ code, fundingValue = '$50', submissionValue = '$10', validity = '30 Days' }) {
  const searchUrl = `${window.location.origin}/search-coupon?code=${code}`;
  const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="coupon-ticket-container">
      <div className="coupon-ticket-bg">
        <img src={couponBg} alt="Coupon Background" className="coupon-ticket-img" />
        
        <div className="coupon-ticket-content">
          <h2 className="coupon-ticket-title">Fortune Crowd Fund Coupon</h2>
          
          <div className="coupon-ticket-body">
            <div className="coupon-ticket-left">
              <div className="coupon-ticket-qr-wrapper">
                <span className="coupon-ticket-label">COUPON</span>
                <div className="coupon-ticket-qr-inner">
                  <QRCode value={searchUrl} size={256} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <span className="coupon-ticket-code-text">{code}</span>
              </div>
            </div>
            
            <div className="coupon-ticket-center">
              <div className="coupon-ticket-value-main">Funding Coupon Value {fundingValue}</div>
              <div className="coupon-ticket-value-sub">Submission Coupon Value {submissionValue}</div>
              <div className="coupon-ticket-date">Generated: {generatedDate}</div>
              <div className="coupon-ticket-validity">Validity: {validity}</div>
              
              <div className="coupon-ticket-footer-logos">
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={14} /> fcfc.fund</span>
                <span className="coupon-ticket-sep">|</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AndroidIcon /> fcfc</span>
                <span className="coupon-ticket-sep">|</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AppleIcon /> ios fcfc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
