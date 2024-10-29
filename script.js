const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeModal = document.querySelector(".close");
const saveSettingsBtn = document.getElementById("save-settings");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const taskNameInput = document.getElementById("task-name");
const taskNameDisplay = document.getElementById("task-name-display");
const timeDisplay = document.getElementById("time-display");
const workTimeInput = document.getElementById("work-time");
const restTimeInput = document.getElementById("rest-time");
const historyList = document.getElementById("history-list");
const exportBtn = document.getElementById("export-btn");

let workTime = 1500;
let restTime = 300;
let timer = null;
let isWorking = true;
let startTime, taskHistory = JSON.parse(localStorage.getItem("taskHistory")) || [];

// Load existing history
renderHistory();

// Modal functionality
settingsBtn.onclick = () => settingsModal.style.display = "block";
closeModal.onclick = () => settingsModal.style.display = "none";
window.onclick = (e) => e.target == settingsModal ? settingsModal.style.display = "none" : null;

saveSettingsBtn.onclick = () => {
    workTime = parseInt(workTimeInput.value);
    restTime = parseInt(restTimeInput.value);
    localStorage.setItem("workTime", workTime);
    localStorage.setItem("restTime", restTime);
    alert("Settings saved!");
    settingsModal.style.display = "none";
};

// Timer functionality
startBtn.onclick = () => {
    if (timer) clearInterval(timer);
    taskNameDisplay.textContent = taskNameInput.value;
    const duration = isWorking ? workTime : restTime;
    startTime = new Date();
    timer = setInterval(() => updateTimer(duration), 1000);
};

resetBtn.onclick = resetTimer;

function updateTimer(duration) {
    let seconds = duration - Math.floor((new Date() - startTime) / 1000);
    if (seconds <= 0) {
        clearInterval(timer);
        alert(isWorking ? "Work session complete!" : "Rest session complete!");
        saveTaskHistory();
        taskNameDisplay.textContent = "";
        taskNameInput.value = "";
        isWorking = !isWorking;
        resetTimer();
    } else {
        timeDisplay.textContent = new Date(seconds * 1000).toISOString().substr(11, 8);
    }
}

function resetTimer() {
    clearInterval(timer);
    timeDisplay.textContent = "00:00:00";
    taskNameInput.value = "";
}

// Task history and export
function saveTaskHistory() {
    const task = {
        name: taskNameInput.value || "Unnamed Task",
        start: startTime.toLocaleString(),
        end: new Date().toLocaleString()
    };
    taskHistory.push(task);
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    taskHistory.forEach((task, index) => {
        const item = document.createElement("li");
        item.textContent = `${task.name} (Start: ${task.start}, End: ${task.end})`;

        // Create delete button for each task entry
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => deleteTaskHistory(index);

        item.appendChild(deleteBtn);
        historyList.appendChild(item);
    });
}

function deleteTaskHistory(index) {
    taskHistory.splice(index, 1); // Remove the specific task from history
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory)); // Update local storage
    renderHistory(); // Re-render the history list
}

exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(taskHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "task_history.json";
    a.click();
};
