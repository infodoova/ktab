import React, { useRef, useEffect, useCallback, useImperativeHandle } from "react";
import HTMLFlipBook from "react-pageflip";
import { PageFlip } from "page-flip";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import "./PageCurlTransition.css";

/**
 * Patch PageFlip prototype to guarantee strict single-page (portrait) behavior across all viewports.
 * Fixes StPageFlip's internal flipPrev coordinate bug in portrait mode where { x: 10 }
 * is checked against 2-page bounds and rejected by isPointOnCorners when disableFlipByClick is true.
 */
if (!PageFlip._ktabSinglePagePatched) {
  PageFlip._ktabSinglePagePatched = true;

  const configureSinglePage = (instance) => {
    try {
      if (instance.setting) {
        instance.setting.disableFlipByClick = true;
      }

      if (instance.render) {
        instance.render.getOrientation = () => "portrait";
        instance.render.orientation = "portrait";
        instance.render.calculateBoundsRect = function () {
          const w = this.setting.width;
          const h = this.setting.height;
          const middlePoint = { x: w / 2, y: h / 2 };
          const left = middlePoint.x - w / 2 - w;
          this.boundsRect = {
            left,
            top: middlePoint.y - h / 2,
            width: w * 2,
            height: h,
            pageWidth: w,
          };
          this.orientation = "portrait";
          return "portrait";
        };
      }

      if (instance.pages) {
        instance.pages.getSpread = function () {
          return this.portraitSpread;
        };
        instance.pages.createSpread = function () {
          this.portraitSpread = [];
          this.landscapeSpread = [];
          for (let i = 0; i < this.pages.length; i++) {
            this.portraitSpread.push([i]);
            this.landscapeSpread.push([i]); // Strictly 1 page per spread in all modes
          }
        };
        instance.pages.createSpread();
      }

      if (instance.flipController) {
        instance.flipController.flipPrev = function (corner = "bottom") {
          const rect = instance.render.getRect();
          this.flip({
            x: rect.left + 15,
            y: corner === "top" ? 15 : rect.height - 15,
          });
        };
        instance.flipController.flipNext = function (corner = "bottom") {
          const rect = instance.render.getRect();
          this.flip({
            x: rect.left + rect.pageWidth * 2 - 15,
            y: corner === "top" ? 15 : rect.height - 15,
          });
        };
      }
    } catch (err) {
      console.warn("Could not patch PageFlip instance:", err);
    }
  };

  const origLoadFromHTML = PageFlip.prototype.loadFromHTML;
  PageFlip.prototype.loadFromHTML = function () {
    const res = origLoadFromHTML.apply(this, arguments);
    configureSinglePage(this);
    if (this.pages && typeof this.setting?.startPage === "number") {
      this.pages.show(this.setting.startPage);
    }
    return res;
  };

  const origUpdateFromHtml = PageFlip.prototype.updateFromHtml;
  PageFlip.prototype.updateFromHtml = function () {
    const res = origUpdateFromHtml.apply(this, arguments);
    configureSinglePage(this);
    return res;
  };

  const origFlipPrev = PageFlip.prototype.flipPrev;
  PageFlip.prototype.flipPrev = function (corner = "bottom") {
    try {
      const fc = this.flipController;
      const rect = this.render?.getRect();
      if (fc && rect) {
        fc.flip({
          x: rect.left + 15,
          y: corner === "top" ? 15 : rect.height - 15,
        });
        return;
      }
    } catch (e) {}
    return origFlipPrev.apply(this, arguments);
  };

  const origFlipNext = PageFlip.prototype.flipNext;
  PageFlip.prototype.flipNext = function (corner = "bottom") {
    try {
      const fc = this.flipController;
      const rect = this.render?.getRect();
      if (fc && rect) {
        fc.flip({
          x: rect.left + rect.pageWidth * 2 - 15,
          y: corner === "top" ? 15 : rect.height - 15,
        });
        return;
      }
    } catch (e) {}
    return origFlipNext.apply(this, arguments);
  };
}

/**
 * ForwardRef Page Leaf required by the StPageFlip engine.
 * Renders authentic reading text on the front face, and the solid
 * themed cover with the monochrome Ktab BrandIcon on the turning reverse sheet.
 */
const PageLeaf = React.memo(
  React.forwardRef(({ page, pageNum, theme, renderContent }, ref) => {
    return (
      <div
        ref={ref}
        className={`ktab-page-curl-leaf ktab-page-curl-leaf--theme-${theme} ktab-book-page--${theme}`}
        dir="rtl"
      >
        {/* Front Face: Book Text Content */}
        <div className="ktab-page-curl-content">
          {renderContent(page, pageNum)}
        </div>

        {/* Back Face: Solid Background with Monochrome Brand Emblem */}
        <div className="ktab-page-curl-backface" aria-hidden="true">
          <div className="ktab-curl-brand-logo">
            <img
              src={brandIconImg}
              alt=""
              className="ktab-curl-brand-img"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  })
);

/**
 * High-Fidelity Physical 3D Book Page Curl Transition.
 * - Powered by StPageFlip's mathematical mesh engine calculating corner bending,
 *   dynamic clipping polygons, and multi-layer gradient drop shadows.
 * - Strictly locked into Single-Page mode (1 page per turn in both directions).
 * - Fixed portrait-mode backward flip coordinates to ensure reliable prev turns on tap & swipe.
 * - Solid branded theme reverse sheet with centered BrandIcon on the turning flap.
 */
export const PageCurlTransition = React.forwardRef(function PageCurlTransition(
  {
    pages = [],
    currentPageIndex = 0,
    pageWidth,
    pageHeight,
    theme,
    onPageChange,
    renderContent,
  },
  ref
) {
  const flipBookRef = useRef(null);
  const containerRef = useRef(null);

  /**
   * Calibrates StPageFlip internal engine on runtime mounts:
   * Enforces 1 page per spread, portrait bounds, and hooks backface clone styling.
   */
  const attachEngineHooks = useCallback(() => {
    const pf = flipBookRef.current?.pageFlip();
    if (!pf) return;

    try {
      const render = pf.getRender();
      if (render) {
        render.getOrientation = () => "portrait";
        render.orientation = "portrait";
        render.calculateBoundsRect = function () {
          const w = this.setting.width;
          const h = this.setting.height;
          const middlePoint = { x: w / 2, y: h / 2 };
          const left = middlePoint.x - w / 2 - w;

          this.boundsRect = {
            left,
            top: middlePoint.y - h / 2,
            width: w * 2,
            height: h,
            pageWidth: w,
          };
          this.orientation = "portrait";
          return "portrait";
        };

        if (render.getOrientation() !== "portrait") {
          render.updateOrientation("portrait");
        }
      }

      const pageCollection = pf.getPageCollection();
      if (pageCollection) {
        pageCollection.getSpread = function () {
          return this.portraitSpread;
        };
        pageCollection.createSpread = function () {
          this.portraitSpread = [];
          this.landscapeSpread = [];
          for (let i = 0; i < this.pages.length; i++) {
            this.portraitSpread.push([i]);
            this.landscapeSpread.push([i]);
          }
        };
        pageCollection.createSpread();
        pageCollection.show(currentPageIndex);
      }

      const fc = pf.getFlipController();
      if (fc) {
        fc.flipPrev = function (corner = "bottom") {
          const rect = pf.getRender().getRect();
          this.flip({
            x: rect.left + 15,
            y: corner === "top" ? 15 : rect.height - 15,
          });
        };
        fc.flipNext = function (corner = "bottom") {
          const rect = pf.getRender().getRect();
          this.flip({
            x: rect.left + rect.pageWidth * 2 - 15,
            y: corner === "top" ? 15 : rect.height - 15,
          });
        };
      }
    } catch (err) {
      console.warn("Could not enforce portrait bounds in StPageFlip:", err);
    }

    // Hook HTMLPage prototype newTemporaryCopy to style the forward-curling flap
    try {
      const pageCollection = pf.getPageCollection();
      const loadedPages = pageCollection?.getPages();
      if (loadedPages && loadedPages.length > 0) {
        const proto = Object.getPrototypeOf(loadedPages[0]);
        if (proto && !proto._ktabBackfaceHooked) {
          proto._ktabBackfaceHooked = true;
          const origNewTemporaryCopy = proto.newTemporaryCopy;
          proto.newTemporaryCopy = function () {
            const copy = origNewTemporaryCopy.apply(this, arguments);
            if (this.copiedElement) {
              this.copiedElement.classList.add("ktab-page-curl-leaf--back");
            }
            return copy;
          };
        }
      }
    } catch (err) {
      console.warn("Could not patch StPageFlip newTemporaryCopy:", err);
    }
  }, [currentPageIndex]);

  useEffect(() => {
    attachEngineHooks();
    const frameId = requestAnimationFrame(attachEngineHooks);
    const timerId = setTimeout(attachEngineHooks, 100);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, [attachEngineHooks, pageWidth, pageHeight, theme, pages.length]);

  useImperativeHandle(ref, () => ({
    triggerCurlNext: () => {
      try {
        const pf = flipBookRef.current?.pageFlip();
        if (!pf) return;
        const fc = pf.getFlipController();
        const render = pf.getRender();
        const rect = render?.getRect();
        if (fc && rect) {
          fc.flip({
            x: rect.left + rect.pageWidth * 2 - 15,
            y: rect.height - 15,
          });
        } else {
          pf.flipNext("bottom");
        }
      } catch (err) {
        console.warn("FlipBook next error:", err);
      }
    },
    triggerCurlPrev: () => {
      try {
        const pf = flipBookRef.current?.pageFlip();
        if (!pf) return;
        const fc = pf.getFlipController();
        const render = pf.getRender();
        const rect = render?.getRect();
        if (fc && rect) {
          fc.flip({
            x: rect.left + 15,
            y: rect.height - 15,
          });
        } else {
          pf.flipPrev("bottom");
        }
      } catch (err) {
        console.warn("FlipBook prev error:", err);
      }
    },
    goToPage: (pageNum) => {
      try {
        const pf = flipBookRef.current?.pageFlip();
        if (!pf) return;
        const targetSpread = pageNum - 1;
        const currentSpread = pf.getPageCollection()?.getCurrentSpreadIndex();
        if (targetSpread === currentSpread) return;

        if (targetSpread > currentSpread) {
          pf.getPageCollection()?.setCurrentSpreadIndex(targetSpread - 1);
          const fc = pf.getFlipController();
          const rect = pf.getRender()?.getRect();
          if (fc && rect) {
            fc.flip({
              x: rect.left + rect.pageWidth * 2 - 15,
              y: rect.height - 15,
            });
          } else {
            pf.flipNext("bottom");
          }
        } else {
          pf.getPageCollection()?.setCurrentSpreadIndex(targetSpread + 1);
          const fc = pf.getFlipController();
          const rect = pf.getRender()?.getRect();
          if (fc && rect) {
            fc.flip({
              x: rect.left + 15,
              y: rect.height - 15,
            });
          } else {
            pf.flipPrev("bottom");
          }
        }
      } catch (err) {
        console.warn("FlipBook flip error:", err);
      }
    },
    pageFlip: () => flipBookRef.current?.pageFlip(),
  }));

  if (!pages || pages.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="ktab-page-curl-wrap"
      style={{
        width: `${pageWidth}px`,
        maxWidth: `${pageWidth}px`,
        height: `${pageHeight}px`,
      }}
      dir="ltr"
    >
      <HTMLFlipBook
        ref={flipBookRef}
        key={`${pageWidth}-${pageHeight}-${theme}`}
        width={pageWidth}
        height={pageHeight}
        size="fixed"
        minWidth={pageWidth}
        maxWidth={pageWidth}
        minHeight={pageHeight}
        maxHeight={pageHeight}
        showCover={false}
        usePortrait={true}
        autoSize={false}
        startPage={currentPageIndex}
        drawShadow={true}
        maxShadowOpacity={0.75}
        flippingTime={560}
        useMouseEvents={true}
        swipeDistance={25}
        clickEventForward={true}
        showPageCorners={true}
        disableFlipByClick={true}
        className="ktab-page-curl-container"
        style={{
          width: `${pageWidth}px`,
          maxWidth: `${pageWidth}px`,
          height: `${pageHeight}px`,
        }}
        onInit={attachEngineHooks}
        onUpdate={attachEngineHooks}
        onFlip={(e) => {
          onPageChange?.(e.data + 1);
        }}
      >
        {pages.map((p, idx) => (
          <PageLeaf
            key={idx}
            page={p}
            pageNum={idx + 1}
            theme={theme}
            renderContent={renderContent}
          />
        ))}
      </HTMLFlipBook>
    </div>
  );
});

export default PageCurlTransition;
