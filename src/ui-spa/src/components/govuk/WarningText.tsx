import * as GDS from "govuk-react-jsx";
import React from "react";

type WarningTextProps = {
  children: React.ReactNode;
  className?: string;
  iconFallbackText?: string;
};

export const WarningText: React.FC<WarningTextProps> = (props) => (
  <GDS.WarningText {...props} />
);
