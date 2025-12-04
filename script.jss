async function checkServer() {
    let link = document.getElementById("serverLink").value;
    let resultBox = document.getElementById("result");

    if (!link.includes("privateserver")) {
        resultBox.innerHTML = "❌ Invalid private server link";
        return;
    }

    resultBox.innerHTML = "Checking...";

    try {
        // Extract place ID
        let placeId = link.match(/\/games\/(\d+)/)[1];

        let gameInfo = await fetch(`https://games.roblox.com/v1/games?universeIds=${placeId}`)
            .then(r => r.json());

        let game = gameInfo.data[0];

        let ownerInfo = await fetch(`https://users.roblox.com/v1/users/${game.creator.id}`)
            .then(r => r.json());

        let presence = await fetch(`https://presence.roblox.com/v1/presence/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds: [game.creator.id] })
        }).then(r => r.json());

        let status = presence.userPresences[0];

        resultBox.innerHTML = `
            <b>Game:</b> ${game.name}<br>
            <b>Owner:</b> ${ownerInfo.name}<br>
            <b>Owner Online:</b> ${status.userPresenceType != 0 ? "🟢 Yes" : "🔴 No"}<br>
            <b>Owner In-Game:</b> ${status.userPresenceType == 2 ? "🟢 Yes" : "🔴 No"}<br>
        `;
    } catch (err) {
        resultBox.innerHTML = "❌ Error. Try again or check link.";
    }
              }
