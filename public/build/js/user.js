const playerId = window.location.href.substr(window.location.href.indexOf("=") + 1); // Get player id from URL
let stats = [];


document.addEventListener("DOMContentLoaded", async () =>
{
    stats = await getPlayerStats(playerId);
    //stats = await fetch("./build/js/player.json");
    //stats = await stats.json();
    //console.log(stats);
    

    // /index
    /*
    const nicksearch = document.querySelector(".pubg-nicksearch");
    if(nicksearch)
    {
        const randnick = ["shroud", "chocoTaco", "WackyJacky101", "TGLTN", "sparkingg", "ibiza"];
        nicksearch.placeholder = randnick[Math.floor(Math.random() * randnick.length)];

    }

    // /user
    const playerNick = document.querySelector(".player-nick");
    if(playerNick)
    {
        /*const headers =
        {
            headers: 
            {
                Accept: "application/vnd.api+json",
                Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNzZmOWYzMC1kNWM0LTAxMzktZTRlOS02Mzk3ZDNjNzNlYmIiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjI3OTExMTg1LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImxhdGFtZXZlbnRzIn0.12S_uXEy_S0BNplFWvyyJmRd9Hbe5AXXQ1bLWtAmiqE"
            }
        }
        const player = playerNick.textContent;
        let stats = await fetch("./build/js/player.json");
        //if(stats.status === 404) window.location.href = "/?response=2";
        if(stats.status === 200)
        {
            stats = await stats.json();
            

        }
        
        const stats = await fetch(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${player}`, headers)
            .then(response => { return response.json(); })
            .then(data =>
            {
                //console.log(data.data[0].attributes.name);
                console.log(data.data[0])
            }
        );* /

        console.log(await getMatchStats("35cf1b5f-a880-4ce2-921f-ab0458808052"));
    }
    */

    //
    const section = document.querySelector("section");

    for(var i = 0; i < 20; i++)
    {
        let pmId, pmRank, pmKills, pmDamage, pmTimeSurvived;

        const matchId = stats.relationships.matches.data[i].id;
        const match = await getMatchStats(matchId);

        // Get player stats in the match
        match.included.forEach(pmstats =>
        {
            if(pmstats.type === "participant" && pmstats.attributes.stats.name === playerId)
            {
                pmId = pmstats.id;
                pmKills = pmstats.attributes.stats.kills;
                pmDamage = pmstats.attributes.stats.damageDealt;
                pmTimeSurvived = pmstats.attributes.stats.timeSurvived;
            }
        });

        // Get player rank
        match.included.forEach(pmstats =>
        {
            if(pmstats.type === "roster")
            {
                pmstats.relationships.participants.data.forEach(rData =>
                {
                    if(rData.id === pmId)
                    {
                        pmRank = pmstats.attributes.stats.rank;
                    }
                });
            }
        });


        //
        let html = "";
        let map = "";
        let mode = "";

        switch(match.data.attributes.mapName)
        {
            case 'Baltic_Main': map = "erangel"; break;
            case 'Desert_Main': map = "miramar"; break;
            case 'Savage_Main': map = "sanhok"; break;
            case 'DihorOtok_Main': map = "vikendi"; break;
            default: map = "erangel"; break;
            //default: map = match.data.attributes.mapName;
        }

        switch(match.data.attributes.gameMode)
        {
            case 'solo-fpp': mode = "Solo | FPP"; break;
            case 'duo-fpp': mode = "Duo | FPP"; break;
            case 'squad-fpp': mode = "Squad | FPP"; break;
            case 'solo-tpp': mode = "Solo | TPP"; break;
            case 'duo-tpp': mode = "Duo | TPP"; break;
            case 'squad-tpp': mode = "Squad | TPP"; break;
        }

        //
        html += `<a href="/match?id=${matchId}" class="match-link" title="View match stats"></a>`;
        html +=
        `
            <div class="match-header">
                <h3 class="match-map">${map} - ${mode}</h3>
                <h3>
            </div>
        `;
        html += `<h4 class="match-rank">#${pmRank}</h4>`;
        html += `<p class="match-kills">${pmKills} kills</p>`;
        html += `<p class="match-damage">${pmDamage.toFixed(1)} damage</p>`;
        html += `<p class="match-damage">Time survived: ${(pmTimeSurvived / 60).toFixed(0)}:${(pmTimeSurvived % 60).toFixed(0)}</p>`;

        const card = document.createElement("DIV");
        card.classList = `match ${map} section`;
        card.innerHTML = html;
        section.appendChild(card);

        //console.log(match.data.);
    }
});


async function getPlayerStats(player)
{
    const opts =
    {
        headers: 
        {
            Accept: "application/vnd.api+json",
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNzZmOWYzMC1kNWM0LTAxMzktZTRlOS02Mzk3ZDNjNzNlYmIiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjI3OTExMTg1LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImxhdGFtZXZlbnRzIn0.12S_uXEy_S0BNplFWvyyJmRd9Hbe5AXXQ1bLWtAmiqE"
        }
    };

    let stats = await fetch(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${player}`, opts);
    stats = await stats.json();
    return stats.data[0];
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
