import React from "react";
import "./PreservedGuillemets.css";

export function PreservedGuillemets({ text }) {
  return String(text ?? "").split(/([«»])/g).map((part, index) =>
    part === "«" || part === "»" ? (
      <bdi key={index} dir="ltr" className="ktab-preserved-guillemet">
        {part}
      </bdi>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}
