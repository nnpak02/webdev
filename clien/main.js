
const MY_DRONE_ID = 65010806;
const config_url = `http://127.0.0.1:8000/config/65010806`;
const log_url = `https://app-tracking.pockethost.io/api/collections/drone_logs/records`;

const divConfig = document.getElementById("config");
const divStatus = document.getElementById("status");
const myForm = document.getElementById("my-form");

var my_config;

const getConfig = async (droneId) => {
    const rawData = await fetch(config_url);
    const jsonData = await rawData.json();

    console.log({ jsonData });
    return jsonData;
}

const displayWaiting = () => {
    const html = `<p>Drone ID: ${MY_DRONE_ID}, Waiting for config...</p>`
    divConfig.innerHTML = html;
}
const displayConfig = (config) => {
    console.log({ config});
    const html = `
    <ul>
        <li>Drone ID: ${config.drone_id}</li>
        <li>Drone Name: ${config.drone_name}</li>
        <li>Drone Condition: ${config.condition}</li>
        <li>Drone Light: ${config.light}</li>
        <li>Drone Max Speed: ${config.max_speed}</li>
        <li>Country: ${config.country}</li>
    </ul>`;
    divConfig.innerHTML = html;
}

const displayStatus = (msg) => {
    const html = `<p>${msg}</p>`
    divStatus.innerHTML = html;
}

const postLog = async (data) => {
    fetch(log_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

const main = async () => {
    console.log(`Drone ID: ${MY_DRONE_ID}`);
    displayWaiting();
    const myConfig = await getConfig(MY_DRONE_ID);
    my_config = myConfig;
    displayConfig(myConfig);

    myForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const temperature = data.get("temperature");

        const log = {
            drone_id: MY_DRONE_ID,
            drone_name: my_config.drone_name,
            celsius: temperature,
            country: my_config.country
        }

        displayStatus("Posting log...");
        await postLog(log);
        displayStatus("Posting done");

        console.log("Click", { log });
    });
}

main();