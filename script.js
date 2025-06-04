
let startTime = null;
let currentURL = '';
let timeData = JSON.parse(localStorage.getItem("focusData") || "{}");

const API_BASE = 'http://0.0.0.0:3000'; // Backend API base URL

async function startTracking() {
  currentURL = document.getElementById("urlInput").value;
  if (!currentURL) return alert("Enter a URL first");
  startTime = Date.now();
  console.log("Tracking started for:", currentURL);
}

async function stopTracking() {
  if (!startTime) return;
  const duration = Math.floor((Date.now() - startTime) / 1000);
  
  // Store locally for immediate chart update
  timeData[currentURL] = (timeData[currentURL] || 0) + duration;
  localStorage.setItem("focusData", JSON.stringify(timeData));
  
  // Send to backend
  try {
    const response = await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: currentURL,
        duration: duration,
        user: 'demo_user' // You can make this dynamic later
      })
    });
    
    if (response.ok) {
      console.log('Data saved to database');
    } else {
      console.error('Failed to save to database');
    }
  } catch (error) {
    console.error('Error sending data to backend:', error);
  }
  
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

async function tagURL() {
  const tag = document.getElementById("tagSelect").value;
  if (!currentURL) return alert("Start tracking first");
  
  // Store locally
  localStorage.setItem(`tag_${currentURL}`, tag);
  
  // Send to backend (you can implement this endpoint later)
  try {
    console.log(`Tagged ${currentURL} as ${tag}`);
    alert(`Tagged ${currentURL} as ${tag}`);
  } catch (error) {
    console.error('Error tagging URL:', error);
  }
}

function startPomodoro() {
  document.getElementById("pomodoroStatus").textContent = "Pomodoro started! Ends in 25 mins.";
  
  // Send pomodoro start to backend (you can implement this later)
  console.log('Pomodoro session started');
  
  setTimeout(() => {
    alert("Pomodoro ended! Take a 5-minute break.");
    document.getElementById("pomodoroStatus").textContent = "Pomodoro complete.";
  }, 25 * 60 * 1000);
}

updateChart();
