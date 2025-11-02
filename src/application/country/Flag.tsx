import { FlagResizer } from "./FlagResizer";
import flagsData from "./flagsData";

export function Flag({
  countryCode,
  size = 24,
}: {
  countryCode: string;
  size?: number;
}) {
  const flag = flagsData.find((item) => item.code === countryCode)?.flag;

  return <FlagResizer size={size}>{flag ?? `🏳️`}</FlagResizer>;
}
