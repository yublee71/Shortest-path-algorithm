import { Button, Tooltip } from "@mantine/core";

interface ButtonTooltipProps {
  label: string;
  tooltipLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

export function ButtonTooltip({
  label,
  tooltipLabel,
  onClick,
  disabled,
  color,
  variant,
}: ButtonTooltipProps) {
  return (
    <Tooltip label={tooltipLabel} withArrow openDelay={400}>
      <Button
        onClick={onClick}
        disabled={disabled}
        color={color}
        variant={variant}
      >
        {label}
      </Button>
    </Tooltip>
  );
}
