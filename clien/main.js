const MY_DRONE_ID = 65010806;
const config_url = `https://webdev-0ev5.onrender.com/config/65010806`;
const log_url = `https://app-tracking.pockethost.io/api/collections/drone_logs/records`;

const divConfig = document.getElementById("config");
const myForm = document.getElementById("my-form");
const statusButton = document.getElementById("status-button"); 

var my_config;


const getConfig = async (droneId) => {
    const rawData = await fetch(config_url);
    const jsonData = await rawData.json();
    console.log({ jsonData });
    return jsonData;
};


const getAllLogs = async () => {
    let logs = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
        const rawData = await fetch(`${log_url}?page=${currentPage}`);
        const jsonData = await rawData.json();

        logs = logs.concat(jsonData.items);
        totalPages = jsonData.totalPages;
        currentPage++;
    } while (currentPage <= totalPages);

    console.log("All Logs: ", logs);
    return logs;
};


const displayWaiting = () => {
    const html = `<p>Drone ID: ${MY_DRONE_ID}, Waiting for config...</p>`;
    divConfig.innerHTML = html;
};


const displayConfig = (config) => {
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
};


const postLog = async (data) => {
    await fetch(log_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};


const displayLogsTable = (logs) => {
    let html = `
    <table border="1">
        <thead>
            <tr>
                <th>Created</th>
                <th>Country</th>
                <th>Drone ID</th>
                <th>Drone Name</th>
                <th>Celsius</th>
            </tr>
        </thead>
        <tbody>`;

    
    logs.sort((a, b) => new Date(b.created) - new Date(a.created));

    logs.forEach(log => {
        html += `
        <tr>
            <td>${new Date(log.created).toLocaleString()}</td>
            <td>${log.country}</td>
            <td>${log.drone_id}</td>
            <td>${log.drone_name}</td>
            <td>${log.celsius}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    document.getElementById("logs_list").innerHTML = html;
};


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
        };

        await postLog(log);
        console.log("Log posted:", log);

        
        const logs = await getAllLogs();
        displayLogsTable(logs);
    });

    
    const logs = await getAllLogs();
    displayLogsTable(logs);

    
    statusButton.addEventListener("click", async () => {
        const logs = await getAllLogs(); 
        displayLogsTable(logs); 
    });

    
    window.getAllLogs = getAllLogs; 
    window.displayLogsTable = displayLogsTable; 
};

main();
