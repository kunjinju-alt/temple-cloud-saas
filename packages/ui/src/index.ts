export type ButtonVariant = "primary" | "secondary" | "danger";

export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
};