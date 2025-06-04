let startTime = null;
let currentURL = '';
let timeData = JSON.parse(localStorage.getItem("focusData") || "{}");

// ✅ Supabase credentials (replace with your actual values)
const SUPABASE_URL = 'https://ubziobxksfpvxbazjsro.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViemlvYnhrc2ZwdnhiYXpqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMjI1OTcsImV4cCI6MjA2NDU5ODU5N30.Oi4GXZZKeT2rwoKEbRB8xgH-7wVV7v-jf91mylU72mk';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Start tracking time
async function startTracking() {
  currentURL = document.getElementById("urlInput").value;
  if (!currentURL) return alert("Enter a URL first");
  startTime = Date.now();
  console.log("⏱️ Tracking started for:", currentURL);
}

// Stop tracking and log time
async function stopTracking() {
  if (!startTime) return;
  const duration = Math.floor((Date.now() - startTime) / 1000);

  // Store locally for chart
  timeData[currentURL] = (timeData[currentURL] || 0) + duration;
  localStorage.setItem("focusData", JSON.stringify(timeData));

  // ✅ Save to Supabase
  try {
    const { data, error } = await supabase.from('focus_sessions').insert([
      {
        url: currentURL,
        duration: duration,
        user: 'demo_user', // Optional user ID
        timestamp: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error('❌ Supabase error:', error.message);
    } else {
      console.log('✅ Data saved to Supabase:', data);
    }
  } catch (err) {
    console.error('Error inserting to Supabase:', err);
  }

  startTime = null;
  updateChart();
}

// Update the bar chart
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

// Tag a URL as productive or distracting
async function tagURL() {
  const tag = document.getElementById("tagSelect").value;
  if (!currentURL) return alert("Start tracking first");

  localStorage.setItem(`tag_${currentURL}`, tag);

  // ✅ Save tag to Supabase (optional: create a new table or add 'tag' to focus_sessions)
  try {
    const { error } = await supabase.from('focus_sessions').insert([
      {
        url: currentURL,
        duration: 0,
        user: 'demo_user',
        tag: tag,
        timestamp: new Date().toISOString()
      }
    ]);
    if (error) {
      console.error('❌ Tag error:', error.message);
    } else {
      console.log(`✅ Tagged ${currentURL} as ${tag}`);
      alert(`Tagged ${currentURL} as ${tag}`);
    }
  } catch (err) {
    console.error('Error tagging URL:', err);
  }
}

// Pomodoro timer
function startPomodoro() {
  document.getElementById("pomodoroStatus").textContent = "Pomodoro started! Ends in 25 mins.";

  console.log('🍅 Pomodoro session started');

  setTimeout(() => {
    alert("Pomodoro ended! Take a 5-minute break.");
    document.getElementById("pomodoroStatus").textContent = "Pomodoro complete.";
  }, 25 * 60 * 1000);
}

// Initial chart render
updateChart();
