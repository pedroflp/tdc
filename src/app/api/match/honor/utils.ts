
const Pontuation = {
    BASE: 10,
    percentage: {
        MVP: 50,
        HOSTAGE: 50,
        BRICKLAYER: -30,
        LOSER: -20
    }
}

export function calculateMatchPontuation(winner: boolean, {mvp, bricklayer, hostage}: {mvp: boolean, bricklayer: boolean, hostage: boolean}) {
    let points = 0;

    if (winner) points+=Pontuation.BASE;
    else points+=Pontuation.BASE*Pontuation.percentage.LOSER*0.01;

    if (mvp) points+=Pontuation.BASE*Pontuation.percentage.MVP*0.01;
    if (hostage) points+=Pontuation.BASE*Pontuation.percentage.HOSTAGE*0.01;
    if (bricklayer) points+=Pontuation.BASE*Pontuation.percentage.BRICKLAYER*0.01;

    return points
}