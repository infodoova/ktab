import React from "react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import "./PlaySessionLoader.css";

/**
 * Editorial brand loader displayed on initial interactive session startup.
 * Replaces generic skeletons with a premium Ktab logo and animated progress bar.
 */
export function PlaySessionLoader({ message = "جاري تجهيز مغامرتك التفاعلية..." }) {
  return (
    <div className="ktab-play-loader" dir="rtl" role="status" aria-live="polite">
      <div className="ktab-play-loader__content">
        <div className="ktab-play-loader__logo-wrap">
          <img
            src={brandIconImg}
            alt="كتاب"
            className="ktab-play-loader__logo"
          />
        </div>

        <div className="ktab-play-loader__progress-track" aria-hidden="true">
          <div className="ktab-play-loader__progress-bar" />
        </div>

        <p className="ktab-play-loader__message">{message}</p>
      </div>
    </div>
  );
}

export default PlaySessionLoader;
