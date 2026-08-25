// =========================================
// LocalHelp - Main JavaScript
// =========================================

console.log("LocalHelp application loaded.");


// Hero search
const heroSearchForm = document.getElementById("heroSearchForm");

if (heroSearchForm) {

    heroSearchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const service =
            document.getElementById("heroService").value.trim();

        const location =
            document.getElementById("heroLocation").value.trim();

        const message =
            document.getElementById("searchMessage");


        if (!service || !location) {

            message.innerHTML = `
                <div class="alert alert-warning">
                    Please enter both a service and location.
                </div>
            `;

            return;
        }


        message.innerHTML = `
            <div class="alert alert-success">
                Searching for <strong>${service}</strong>
                professionals near <strong>${location}</strong>...
            </div>
        `;

    });

}