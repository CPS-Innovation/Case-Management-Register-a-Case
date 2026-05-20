import { Button } from "../govuk";
import { Link, useLocation } from "react-router-dom";
import styles from "./SaveAndCancel.module.scss";

type SaveAndCancelProps = {
  onSave: (event: React.FormEvent) => void;
  isCaseSummaryPage?: boolean;
  disabled?: boolean;
};

const SaveAndCancel = ({
  onSave,
  isCaseSummaryPage = false,
  disabled = false,
}: SaveAndCancelProps) => {
  const location = useLocation();
  return (
    <div className={styles.saveAndCancelWrapper}>
      <Button type="submit" onClick={onSave} disabled={disabled}>
        {isCaseSummaryPage ? "Accept and create" : "Save and continue"}
      </Button>
      {!disabled && (
        <Link
          to={"/case-registration/cancel-case-registration-confirmation"}
          className="govuk-link--no-visited-state"
          state={{ backRoute: location.pathname }}
        >
          Cancel
        </Link>
      )}
    </div>
  );
};

export default SaveAndCancel;
