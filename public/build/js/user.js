const playerName = window.location.href.substr(window.location.href.indexOf("=") + 1); // Get player id from URL
let pData = [];

document.addEventListener("DOMContentLoaded", async () =>
{
    pData = await getPlayerData(playerName);

    // Load player matchs
    const section = document.querySelector("section");

    for(var i = 0; i < 30; i++) // Iterate over player matches
    {
        // Check if it's a valid match id
        if(pData.relationships.matches.data[i] === undefined)
        {
            if(i === 0) section.innerHTML = `<p class="text-muted text-center">This player has not played since a long time :(</p>`
            break;
        }

        //
        const matchId = pData.relationships.matches.data[i].id || "";
        const pStats = await getPlayerMatchStats(playerName, matchId);

        let html = "";
        html += `<a href="/match?id=${matchId}" class="match-link" target="_blank" title="View match stats">`;
        html +=
        `
            <div class="match-card">
                <h3 class="match-map">${pStats.map} - ${pStats.mode} - ${pStats.type}</h3>
                <h3></h3>
            </div>
        `;
        html += `<h4 class="match-rank">#${pStats.rank}</h4>`;
        html += `<p class="match-kills">${pStats.kills} kills</p>`;
        html += `<p class="match-damage">${pStats.damage} damage</p>`;
        html += `<p class="match-damage">Time survived: ${pStats.timeSurvived}</p>`;
        html += `</a>`;

        //
        const card = document.createElement("DIV");
        card.innerHTML = html; 
        card.classList = `match ${pStats.map} section`;
        section.appendChild(card);
    }
});


async function getPlayerData(playerName)
{
    const opts =
    {
        headers: 
        {
            Accept: "application/vnd.api+json",
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNzZmOWYzMC1kNWM0LTAxMzktZTRlOS02Mzk3ZDNjNzNlYmIiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjI3OTExMTg1LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImxhdGFtZXZlbnRzIn0.12S_uXEy_S0BNplFWvyyJmRd9Hbe5AXXQ1bLWtAmiqE"
        }
    };

    let tmp = await fetch(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerName}`, opts);
    tmp = await tmp.json();
    return tmp.data[0];
}


async function getMatchStats(matchId)
{
    const opts =
    {
        headers: { Accept: "application/vnd.api+json" }
    };

    let stats = await fetch(`https://api.pubg.com/shards/steam/matches/${matchId}`, opts);
    stats = await stats.json();
    return stats;
}


async function getPlayerMatchStats(playerName, matchId)
{
    let pId, pRank, pKills, pDamage, pTimeSurvived, map, mode, type, date;
    const match = await getMatchStats(matchId);
    console.log();

    // Get player stats in the match
    match.included.forEach(mIncluded => 
    {
        if(mIncluded.type === "participant" && mIncluded.attributes.stats.name === playerName)
        {
            pId = mIncluded.id;
            pKills = mIncluded.attributes.stats.kills;
            pDamage = mIncluded.attributes.stats.damageDealt;
            pTimeSurvived = mIncluded.attributes.stats.timeSurvived;
        }
    });

    // Get player rank
    match.included.forEach(mIncluded =>
    {
        if(mIncluded.type === "roster")
        {
            mIncluded.relationships.participants.data.forEach(rData =>
            {
                if(rData.id === pId) pRank = mIncluded.attributes.stats.rank;
            });
        }
    });

    // Get map data
    date = match.data.attributes.createdAt;

    switch(match.data.attributes.mapName)
    {
        case 'Baltic_Main': map = "erangel"; break;
        case 'Desert_Main': map = "miramar"; break;
        case 'Savage_Main': map = "sanhok"; break;
        case 'DihorOtok_Main': map = "vikendi"; break;
        case 'Summerland_Main': map = "karakin"; break;
        case 'Tiger_Main': map = "taego"; break;
        case 'Range_Main': map = "training"; break;
        default: map = "unkown map"; break;
    }
    switch(match.data.attributes.gameMode)
    {
        case 'solo-fpp': mode = "Solo | FPP"; break;
        case 'duo-fpp': mode = "Duo | FPP"; break;
        case 'squad-fpp': mode = "Squad | FPP"; break;
        case 'solo-tpp': mode = "Solo | TPP"; break;
        case 'duo-tpp': mode = "Duo | TPP"; break;
        case 'squad-tpp': mode = "Squad | TPP"; break;
        case 'tdm': mode = "TDM"; break;
        default: mode = "unkown mode"; break;
    }
    switch(match.data.attributes.matchType)
    {
        case 'custom': type = "Custom"; break;
        case 'training': type = "Training"; break;
        case 'seasonal', 'normal': type = "Normal"; break;
        case "competitive": type = "Ranked"; break;
        case 'arcade': type = "Arcade"; break;
        case 'training': type = "Training"; break;
        default: type = "Unknow Match Type"; break;
    }


    //
    return {
        rank: pRank, 
        kills: pKills, 
        damage: pDamage.toFixed(1), 
        timeSurvived: `${(pTimeSurvived / 60).toFixed(0)}:${(pTimeSurvived % 60).toFixed(0)}`,
        map: map,
        mode: mode,
        type: type,
        date: date
    };
}
