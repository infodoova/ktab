import { useTrailerBookController } from "../../hooks/useTrailerBookController";
import "./TrailerBookController.css";

// Keep a book's polling and actions alive when its visible card moves between sections.
export function TrailerBookController({ bookId, isAdmin, onChange }) {
  useTrailerBookController(bookId, isAdmin, onChange);
  return null;
}
