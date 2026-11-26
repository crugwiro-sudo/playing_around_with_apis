// CHANGE 1: new URL, key and fields (replaces your old API_URL)
const API_KEY = "rc_live_1258635f3b584c288dadb0864f42a965";
const BASE_URL = "https://api.restcountries.com/countries/v5";
const FIELDS = "names.common,capitals,region,population,area.kilometers,flag.url_svg";

const searchEl = document.getElementById("search");
const regionEl = document.getElementById("region");
const sortEl = document.getElementById("sort");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

let countries = [];

function normalize(c) {
    return {
        name: { common: c.names.common },
        capital: c.capitals && c.capitals.length ? [c.capitals[0].name] : null,
        region: c.region || "",
        population: c.population || 0,
        area: (c.area && c.area.kilometers) || 0,
        flags: { svg: c.flag && c.flag.url_svg }
    };
}

async function loadCountries() {
    try {
        countries = [];
        let offset = 0;
        let more = true;

        while (more) {
            const res = await fetch(
                `${BASE_URL}?response_fields=${FIELDS}&limit=100&offset=${offset}`,
                { headers: { Authorization: `Bearer ${API_KEY}` } }
            );
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.errors ? json.errors[0].message : `HTTP ${res.status}`);
            }
            countries.push(...json.data.objects.map(normalize));
            more = json.data.meta.more;
            offset += 100;
        }

        fillRegions();
        render();
    } catch (err) {
        statusEl.textContent = `Error loading countries: ${err.message}`;
    }
}

// Fill the region dropdown with unique regions (unchanged)
function fillRegions() {
    const regions = [...new Set(countries.map(country => country.region).filter(region => region))];
    regions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionEl.appendChild(option);
    });
}

function render() {
    const query = searchEl.value.toLowerCase();
    const region = regionEl.value;

    let list = countries.filter(country => {
        const name = country.name.common.toLowerCase();
        const capital = country.capital ? country.capital[0].toLowerCase() : "";
        const matchesSearch = name.includes(query) || capital.includes(query);
        const matchesRegion = region ? country.region === region : true;
        return matchesSearch && matchesRegion;
    });

    const sorters = {
        "name-asc": (a, b) => a.name.common.localeCompare(b.name.common),
        "name-desc": (a, b) => b.name.common.localeCompare(a.name.common),
        "pop-asc": (a, b) => a.population - b.population,
        "pop-desc": (a, b) => b.population - a.population,
        "area-asc": (a, b) => a.area - b.area,
        "area-desc": (a, b) => b.area - a.area
    };
    list.sort(sorters[sortEl.value]);

    statusEl.textContent = `Found ${list.length} countries`;

    resultsEl.innerHTML = list.map(country => `
        <div class="card">
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            <div>
                <h3>${country.name.common}</h3>
                <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
                <p>Region: ${country.region || "N/A"}</p>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Area: ${country.area.toLocaleString()} km²</p>
            </div>
        </div>
    `).join("");
}

searchEl.addEventListener("input", render);
regionEl.addEventListener("change", render);
sortEl.addEventListener("change", render);

loadCountries();