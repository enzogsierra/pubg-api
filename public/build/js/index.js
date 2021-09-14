document.addEventListener("DOMContentLoaded", function()
{
    const nicksearch = document.querySelector(".pubg-nicksearch");
    const randnick = ["shroud", "chocoTaco", "WackyJacky101", "TGLTN", "sparkingg", "ibiza"];
    nicksearch.placeholder = randnick[Math.floor(Math.random() * randnick.length)];
});
