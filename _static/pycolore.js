window.onload = function() {
    const options = {
        linkSelector: 'a:not([href^="http"]):not([href^="#"])',
        animationSelector: ".body",
        containers: [".document"],
    }
    function initPage() {
        try {
            document.querySelector("[title='Next document'").onclick = function() {
                console.log("Coucou")
                window.scrollTo(0, 0)
            }
            document.querySelector("[title='Previous document'").onclick = function() {
                console.log("Coucou")
                window.scrollTo(0, 0)
            }    
        } catch (error) {
        }
        $("#searchbox").show(0)
    }
    initPage()
    const swup = new Swup(options)
    swup.on("contentReplaced", initPage)
}
