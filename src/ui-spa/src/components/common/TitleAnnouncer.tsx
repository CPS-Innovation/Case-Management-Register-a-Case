import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useRouteDocumentTitle } from "../../common/hooks/useRouteDocumentTitle";

const TitleAnnouncer: React.FC = () => {
  const titleRef = useRef<HTMLParagraphElement>(null);
  const location = useLocation();

  const { title } = useRouteDocumentTitle();
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current?.focus();
    }
  }, [location.pathname]);

  return (
    <p
      tabIndex={-1}
      ref={titleRef}
      aria-live="assertive"
      className="govuk-visually-hidden"
    >
      {title}
    </p>
  );
};

export default TitleAnnouncer;
