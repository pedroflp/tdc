export type MatchOptionCardProps = {
  src: string,
  alt: string,
  name: string,
  description: string,
  onClick: (mode: MatchModesEnum) => void,
  disabled?: boolean,
  selected: boolean,
  mode: MatchModesEnum,
  showFire?: boolean,
}

export enum MatchModesEnum {
  CLASSIC = "classic",
  HARDCORE = "hardcore"
}

export const MatchModesIcons = {
  [MatchModesEnum.CLASSIC]: "/assets/icons/default-match.png",
  [MatchModesEnum.HARDCORE]: "/assets/icons/hardcore-match.png"
}

export const MatchModesNames = {
  [MatchModesEnum.CLASSIC]: "Clássico",
  [MatchModesEnum.HARDCORE]: "Hardcore"
}