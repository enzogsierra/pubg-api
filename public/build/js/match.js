document.addEventListener("DOMContentLoaded", async () =>
{
    const matchId = window.location.href.substr(window.location.href.indexOf("=") + 1); // Get match id from URL
    const match = await getMatchStats(matchId);
    var player = []; // player[id] = {info} | Contains participants' info
    var rank = []; // rank[position] = [participants' id] | Contains all participants' id depeding on his rank

    // Participants
    match.included.forEach(data =>
    {
        if(data.type === "participant")
        {
            player[data.id] = // Save participants info
            {
                name: data.attributes.stats.name, 
                DBNOs: data.attributes.stats.DBNOs,
                assists: data.attributes.stats.assists,
                damage: data.attributes.stats.damageDealt,
                kills: data.attributes.stats.kills,
                timeSurvived: data.attributes.stats.timeSurvived
            };
        }
    });

    // Rosters
    match.included.forEach(data =>
    {
        if(data.type === "roster")
        {
            data.relationships.participants.data.forEach(playerId =>
            {
                const id = playerId.id;
                const place = data.attributes.stats.rank - 1;
                player[id].rank = place; // Add "rank" key to player
                rank[place] = rank[place] || []; 
                rank[place].push(id); // Set participant's id on his rank
            })
        }
    });

    // Show match info
    let rankid = 0;
    const tbody = document.querySelector(".tbody");

    rank.forEach(team =>
    {
        const tr = document.createElement("TR");
        const td1 = document.createElement("TH"); // rank
        const td2 = document.createElement("TD"); // players
        const td3 = document.createElement("TD"); // total kills
        const td4 = document.createElement("TD"); // total damage

        td1.scope = "row";
        td1.classList.add("text-center");
        td3.classList.add("text-center");
        td4.classList.add("text-center");

        //
        rankid++;
        let players = "";
        let kills = 0;
        let damage = 0;

        team.forEach(id => 
        {
            players = `${players}, <a href="/user?id=${player[id].name}" class="text-decoration-none text-light">${player[id].name}</a>`;
            kills += player[id].kills;
            damage += player[id].damage;
        });

        //
        td1.textContent = `#${rankid}`;
        td2.innerHTML = players.substr(2);
        td3.textContent = `${kills}`;
        td4.textContent = `${Intl.NumberFormat().format(damage.toFixed(0))}`;

        tbody.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
    });
})


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

/*match.included.forEach(player =>
{
    if(player.type === "participant")
    {
        const place = player.attributes.stats.winPlace - 1;
        teams[place] = teams[place] || [];
        teams[place].push(player.attributes.stats.name);
    }
});*/
