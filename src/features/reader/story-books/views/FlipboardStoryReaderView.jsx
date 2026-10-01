import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FlipboardReader } from "../components/FlipboardReader/FlipboardReader";
import "./FlipboardStoryReaderView.css";

/**
 * Dedicated Fullscreen View for the Flipboard 3D Storybook Reader.
 * Launched on pressing any story card, preview, or action button.
 */
export function FlipboardStoryReaderView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleExit = () => {
    if (location.state?.from?.parentPath) {
      navigate(location.state.from.parentPath);
    } else {
      navigate("/reader/story-books");
    }
  };

  return (
    <div className="flipboard-story-reader-page">
      <FlipboardReader
        storyId={id}
        initialStory={location.state?.story}
        onExit={handleExit}
      />
    </div>
  );
}

export default FlipboardStoryReaderView;
