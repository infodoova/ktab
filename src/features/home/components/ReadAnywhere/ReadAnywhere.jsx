import React from "react";
import { useReadAnywhere } from "../../hooks/useReadAnywhere";
import "./ReadAnywhere.css";

/**
 * "Read Anywhere" section — Readwise Reader inspired.
 * Bold headline + subtitle + 1 single big image.
 * Placed below Pricing. Pure Light Mode, zero clutter.
 */
export default function ReadAnywhere() {
  const { headline, description, image, imageAlt } = useReadAnywhere();

  return (
    <section id="read-anywhere" className="ra-section" dir="rtl">
      <div className="ra-header">
        <h2 className="ra-headline">{headline}</h2>
        {description && <p className="ra-description">{description}</p>}
      </div>

      <div className="ra-image-wrap">
        <img
          src={image}
          alt={imageAlt}
          className="ra-image"
          loading="lazy"
        />
      </div>
    </section>
  );
}
