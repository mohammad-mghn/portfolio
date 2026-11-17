import type { InputProps } from "sanity";

/** Persian fields are typed right to left, next to their English twin. */
export function RtlInput(props: InputProps) {
  return (
    <div dir="rtl" lang="fa">
      {props.renderDefault(props)}
    </div>
  );
}
