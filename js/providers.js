const searchInput =
    document.getElementById("providerSearch");

const serviceFilter =
    document.getElementById("serviceFilter");

const availabilityFilter =
    document.getElementById("availabilityFilter");

const providers =
    document.querySelectorAll(".provider-item");


function filterProviders() {

    const search =
        searchInput.value.toLowerCase().trim();

    const service =
        serviceFilter.value;

    const availability =
        availabilityFilter.value;


    providers.forEach(function (provider) {

        const name =
            provider.dataset.name.toLowerCase();

        const providerService =
            provider.dataset.service;

        const providerAvailability =
            provider.dataset.availability;


        const matchesSearch =
            name.includes(search) ||
            providerService.toLowerCase().includes(search);


        const matchesService =
            service === "all" ||
            providerService === service;


        const matchesAvailability =
            availability === "all" ||
            providerAvailability === availability;


        if (
            matchesSearch &&
            matchesService &&
            matchesAvailability
        ) {

            provider.style.display = "";

        } else {

            provider.style.display = "none";

        }

    });

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProviders
    );

}

if (serviceFilter) {

    serviceFilter.addEventListener(
        "change",
        filterProviders
    );

}

if (availabilityFilter) {

    availabilityFilter.addEventListener(
        "change",
        filterProviders
    );

}