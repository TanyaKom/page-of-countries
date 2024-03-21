document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    const switchThemeButton = document.querySelector(".switch-btn");
    const sunIcon = document.querySelector(".sun-icon");
    const moonIcon = document.querySelector(".moon-icon");
    const select = document.querySelector("select");
    const items = document.querySelector(".cards");
    let input = document.querySelector("#input");
    const selectedRegion = document.getElementById("select_region");

    function createCountries(countries) {
        items.innerHTML = "";
        countries.forEach(country => {
            const countryElem = document.createElement("div");
            countryElem.classList.add("card");
            countryElem.setAttribute("data-region", country.region);
            countryElem.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}">
            <h2>${country.name.common}</h2>
            <p>
                <span class="title">Population:</span>
                <span class="text">${country.population}</span><br>
                <span class="title">Region:</span>
                <span class="text" data-region="${country.region}">${country.region}</span><br>
                <span class="title">Capital:</span>
                <span class="text">${country.capital}</span>
            </p>`;

            items.appendChild(countryElem);
            countryElem.style.display = "block";
            
        });
    }

    async function loadCountries() {
        const url = "https://restcountries.com/v3.1/all";
        try {
            const response = await fetch(url);
            const data = await response.json();
            createCountries(data);
        } catch (error) {
            console.error("error.message");
        }
    }
    loadCountries();

    input.addEventListener("input", () => {
        const searchCountry = input.value.trim().toLowerCase();
        const countries = Array.from(items.children);
        countries.forEach(country => {
            const countryName = country.querySelector("h2").textContent.toLocaleLowerCase();
            if (countryName.includes(searchCountry)) {
                country.style.display = "block";
            } else {
                country.style.display = "none";
            }
        });
    });

    function filterCountries(selectedRegion) {
        const allCountries = Array.from(items.children);
        allCountries.forEach(country => {
            const countryRegion = country.querySelector(".text[data-region]").textContent.toLowerCase();
            if (selectedRegion === "all" || countryRegion === selectedRegion) {
                country.style.display = "block";
            } else {
                country.style.display = "none";
            }
        });
    }

    select.addEventListener("change", () => {
        const selected = select.value;
        filterCountries(selected);
    });

    function store(value, icon) {
        localStorage.setItem("darkmode", value);
        localStorage.setItem("icon", icon);
    }

    function load() {
        const darkmode = localStorage.getItem("darkmode");
        const icon = localStorage.getItem("icon");
        if(!darkmode) {
            store(false, "sun");
        } else if (darkmode == "true") {
            body.classList.add("darkmode");
            moonIcon.classList.remove("hidden");
            sunIcon.classList.add("hidden");
        }
        if(icon === "sun") {
            sunIcon.classList.remove("hidden");
            moonIcon.classList.add("hidden");
        } else {
            sunIcon.classList.add("hidden");
            moonIcon.classList.remove("hidden");
        }
    }
    load();
    
    switchThemeButton.addEventListener("click", () => {
        body.classList.toggle("darkmode");
        sunIcon.classList.toggle("hidden")
        moonIcon.classList.toggle("hidden");
    
        const darkmode = body.classList.contains("darkmode");
        const icon = darkmode ? "moon" : "sun";
        store(darkmode, icon);
    });
});