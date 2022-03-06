import { useEffect } from "react";

const initialTitle: string = document.title;

export function useTitle(title?: string): void {
  useEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = initialTitle;
    }

    return () => {
      document.title = initialTitle;
    };
  }, [title]);
}
