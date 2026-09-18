import React from "react";
import { Search, X } from "lucide-react";
import { useStoriesFilterBar } from "./useStoriesFilterBar";
import "./StoriesFilterBar.css";

/**
 * Pure declarative presentation component for the inline filter bar.
 */
export function StoriesFilterBar({
  searchQuery = "",
  onSearchChange,
  selectedGenre = "ALL",
  onGenreSelect,
  availableGenres,
}) {
  const {
    genres,
    handleInputChange,
    handleClearSearch,
    handleGenreClick,
    isGenreActive,
  } = useStoriesFilterBar({
    onSearchChange,
    selectedGenre,
    onGenreSelect,
    availableGenres,
  });

  return (
    <div className="ktab-stories-filter" dir="rtl" aria-label="تصفية القصص">
      {/* Search Input Row */}
      <div className="ktab-stories-filter__search-wrap">
        <Search size={16} className="ktab-stories-filter__search-icon" aria-hidden="true" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="ابحث عن مغامرة، فكرة، أو تصنيف..."
          className="ktab-stories-filter__input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="ktab-stories-filter__clear-btn"
            aria-label="مسح البحث"
            title="مسح"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Pills Strip */}
      <div className="ktab-stories-filter__pills-strip" role="tablist">
        {genres.map((genreItem) => {
          const isSelected = isGenreActive(genreItem.id);

          return (
            <button
              key={genreItem.id}
              type="button"
              onClick={() => handleGenreClick(genreItem.id)}
              className={`ktab-stories-filter__pill ${
                isSelected ? "ktab-stories-filter__pill--active" : ""
              }`}
              role="tab"
              aria-selected={isSelected}
            >
              <span>{genreItem.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StoriesFilterBar;
