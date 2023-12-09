const cookieBanner = document.querySelector(".cookie-container")
const cookieBtn = document.querySelector(".cookie-container button")

setTimeout(() => {
    if(!localStorage.getItem("bannerDisplayed")) //se clicco okay, non comparirÃ  piÃ¹ dopo il refresh il banner
     cookieBanner.classList.add("active");
}, 1000);

cookieBtn.addEventListener("click", () => {
    cookieBanner.classList.remove("active");
    localStorage.setItem("bannerDisplayed", "true")
});