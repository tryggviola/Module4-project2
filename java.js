// Creates a new div when the search input is used
function createSelectorDiv(element) {
	selector = document.createElement("div");
	selector.id = "selector";

	// Appends the child to the parent
	element.parentNode.appendChild(selector);

	// Position it below the input element
	selector.style.left = element.getBoundingClientRect().left + "px";
	selector.style.top = element.getBoundingClientRect().bottom + "px";
	selector.style.width = element.getBoundingClientRect().width + "px";

	return selector;
}

// Defining the search bar and event listeners.
const cityInput = document.getElementById("cityInput");
cityInput.autocomplete = "off";
cityInput.addEventListener("click", inputClick);
cityInput.addEventListener("input", search);

//Clear search input on click
function inputClick() {
	cityInput.value = "";
}

// Search function
async function search(e) {
	const citySearch = e.target.value;

	let selector = document.getElementById("selector");

	if (citySearch.trim() !== "") {
		if (selector == null) {
			selector = createSelectorDiv(e.target);
		}

		// Creates a searching button when searching and hiding it when it is not searching
		selector.innerHTML = "";
		let opt = document.createElement("button");
		opt.disabled = true;
		opt.innerHTML = "Searching";
		selector.appendChild(opt);

		// Search API and how we are getting data from it
		const results = await fetch(
			`https://api.weatherapi.com/v1/search.json?q=${citySearch}`,
			{
				headers: {
					key: "53d546bb9dd74e698a5140712211411",
				},
			}
		);

		// Await functions so it wonts display results unless it is fully loaded
		const jsonResults = await results.json();

		selector.innerHTML = "";

		// Create button with no result message or show results from the API
		if (jsonResults.length === 0) {
			let opt = document.createElement("button");
			opt.disabled = true;
			opt.innerHTML = "No results";
			selector.appendChild(opt);
		} else {
			jsonResults.forEach((result) => {
				let opt = document.createElement("button");
				opt.setAttribute("onclick", "insertValue(this);");
				opt.innerHTML = result.name;
				selector.appendChild(opt);
			});
		}
	}
}

const moreInfoWrapper = document.getElementById("moreInfoWrapper");
const selectedCity = document.getElementById("selectedCity");

async function insertValue(elem) {
	cityInput.value = elem.innerHTML;
	elem.parentNode.parentNode.removeChild(elem.parentNode);

	selectedCity.innerHTML = "";
	moreInfoWrapper.innerHTML = "";

	const findMoreInfo = document.getElementById("moreInfo");
	if (findMoreInfo) findMoreInfo.remove();

	// The API and how we are getting data from it
	const results = await fetch(
		`https://api.weatherapi.com/v1/current.json?q=${elem.innerHTML}`,
		{
			headers: {
				key: "53d546bb9dd74e698a5140712211411",
			},
		}
	);
	// Await command so we wont show any data unless it is fully loaded
	const jsonResults = await results.json();

	// Getting the image from the API and showing it in the DOM
	if (jsonResults.current && jsonResults.current.condition) {
		let icon = document.createElement("img");
		icon.alt = "image";
		icon.src = `https:${jsonResults.current.condition.icon}`;

		selectedCity.appendChild(icon);
	}
	// Create DIV for weather information and picture
	let city = document.createElement("div");
	city.className = "city";
	selectedCity.appendChild(city);

	// Getting the city name from the API and showing it in the DOM
	if (jsonResults.location) {
		let name = document.createElement("p");
		name.className = "cityName";
		name.innerHTML = jsonResults.location.name;

		city.appendChild(name);
	}

	// Getting the temperature from the API and showing it in the DOM
	if (jsonResults.current) {
		let degree = document.createElement("p");
		degree.className = "cityInfo";
		degree.innerHTML = `${jsonResults.current.temp_c}°c`;

		// Getting the wind speed from the API and showing it in the DOM
		let wind = document.createElement("p");
		wind.className = "cityInfo";
		wind.innerHTML = `${jsonResults.current.wind_kph}km/h`;

		// Append degree and wind to city div
		city.appendChild(degree);
		city.appendChild(wind);

		// Create moreInfo button
		let moreInfoButton = document.createElement("button");
		moreInfoButton.id = "moreInfoButton";
		moreInfoButton.setAttribute("onclick", "displayMoreInfo();");
		moreInfoButton.innerHTML = "More info";

		// Create moreInfo div
		let moreInfo = document.createElement("div");
		moreInfo.id = "moreInfo";
		moreInfo.className = "moreInfo";

		// Append moreInfoButton and moreInfo div to moreInfoWrapper
		moreInfoWrapper.appendChild(moreInfoButton);
		moreInfoWrapper.appendChild(moreInfo);

		// Create feels like info for More info div
		let feelsLike = document.createElement("p");
		feelsLike.innerHTML = `Feels like: ${jsonResults.current.feelslike_c}°c`;

		// Create humidity info for More info div
		let humidity = document.createElement("p");
		humidity.innerHTML = `Humidity: ${jsonResults.current.humidity}°c`;

		// Create wind degree info for More info div
		let windDegree = document.createElement("p");
		windDegree.innerHTML = `Wind degree: ${jsonResults.current.wind_degree}°`;

		// Create updated date info for More info div
		let updated = document.createElement("p");
		const date = new Date(jsonResults.current.last_updated);
		updated.innerHTML = `Updated: ${date.toLocaleString()}`;

		// Append all children to moreInfo div
		moreInfo.appendChild(feelsLike);
		moreInfo.appendChild(humidity);
		moreInfo.appendChild(windDegree);
		moreInfo.appendChild(updated);
	}
}

// Displaying the more info button in different states and showing/hiding extra information on click.
function displayMoreInfo() {
	const moreInfo = document.getElementById("moreInfo");
	const moreInfoButton = document.getElementById("moreInfoButton");

	if (moreInfo && moreInfo.style.display === "block") {
		moreInfo.style.display = "none";
		moreInfoButton.innerHTML = "More info";
	} else {
		moreInfo.style.display = "block";
		moreInfoButton.innerHTML = "Less info";
	}
}
