export type MatchOptionCardProps = {
  src: string,
  alt: string,
  name: string,
  description: string,
  onClick: (mode: MatchModesEnum) => void,
  disabled?: boolean,
  selected: boolean,
  mode: MatchModesEnum
}

export enum MatchModesEnum {
  CLASSIC = "classic",
  HARDCORE = "hardcore"
}