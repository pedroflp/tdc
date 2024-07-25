import { MatchTeamsEnum, Player } from "@/flows/lol/queue/types";

const shuffleArray = (array: Array<Player>) => {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
      
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const balaceTeams = (teams: Array<Player>) => { 
  const blueTeam = teams.slice(0, 5);
  const redTeam = teams.slice(5, 10);
  
  return {
    [MatchTeamsEnum.BLUE]: blueTeam,
    [MatchTeamsEnum.RED]: redTeam
  };
}

export const handleRandomizeTeam = (players: Array<Player>) => {
  if (!players) return;

  const baseSuffledTeam = shuffleArray(players);
  const composition = balaceTeams(baseSuffledTeam);

  return composition;
}