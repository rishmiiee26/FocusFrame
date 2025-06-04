
let startTime = null;
let currentURL = '';
let timeData = JSON.parse(localStorage.getItem("focusData") || "{}");

function startTracking() {
  currentURL = document.getElementById("urlInput").value;
  if (!currentURL) return alert("Enter a URL first");
  startTime = Date.now();
  console.log("Tracking started for:", currentURL);
}

function stopTracking() {
  if (!startTime) return;
  const duration = Math.floor((Date.now() - startTime) / 1000);
  timeData[currentURL] = (timeData[currentURL] || 0) + duration;
  localStorage.setItem("focusData", JSON.stringify(timeData));
  startTime = null;
  updateChart();
}

function updateChart() {
  const labels = Object.keys(timeData);
  const values = Object.values(timeData);
  const data = {
    labels,
    datasets: [{
      label: "Time (seconds)",
      data: values,
      backgroundColor: "#4caf50"
    }]
  };
  new Chart(document.getElementById("timeChart"), {
    type: "bar",
    data,
    options: {
      responsive: true
    }
  });
}

function tagURL() {
  const tag = document.getElementById("tagSelect").value;
  if (!currentURL) return alert("Start tracking first");
  localStorage.setItem(`tag_${currentURL}`, tag);
  alert(`Tagged ${currentURL} as ${tag}`);
}

function startPomodoro() {
  document.getElementById("pomodoroStatus").textContent = "Pomodoro started! Ends in 25 mins.";
  setTimeout(() => {
    alert("Pomodoro ended! Take a 5-minute break.");
    document.getElementById("pomodoroStatus").textContent = "Pomodoro complete.";
  }, 25 * 60 * 1000);
}

updateChart();
