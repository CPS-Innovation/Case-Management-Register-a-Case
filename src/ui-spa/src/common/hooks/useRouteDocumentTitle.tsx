import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { pageTitles } from "../constants/pageTitles";

const DEFAULT_TITLE = "Home";

export const useRouteDocumentTitle = (): { title: string } => {
  const { pathname } = useLocation();
  const [title, setTitle] = useState<string>("");
  useEffect(() => {
    const lastSlashIndex = pathname.lastIndexOf("/");
    const lastSegment = pathname.substring(lastSlashIndex);
    const title = `${pageTitles[lastSegment] ?? DEFAULT_TITLE} - Register A Case`;
    document.title = title;
    setTitle(title);
  }, [pathname]);
  return { title };
};

export default useRouteDocumentTitle;
