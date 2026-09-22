import classes from "./Spinner.module.scss";

type Props = {
  diameterPx: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const Spinner: React.FC<Props> = ({ diameterPx, ...props }) => (
  <div
    className={`${classes.spinner} spinner`}
    style={{ height: diameterPx, width: diameterPx }}
    {...props}
  ></div>
);
