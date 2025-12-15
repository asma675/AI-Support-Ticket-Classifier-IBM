function randomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}
function randomLatency() {
  return Math.floor(Math.random() * 220) + 90;
}
function classifyTicket(text) {
  const lower = text.toLowerCase();
  const tags = [];
  let priority = "Medium";
  let team = "General Support Queue";
  if (lower.includes("down") || lower.includes("cannot access") || lower.includes("outage")) {
    priority = "P1 - Critical";
    tags.push("outage", "availability");
    team = "Incident Response / SRE";
  }
  if (lower.includes("slow") || lower.includes("performance")) {
    priority = priority === "P1 - Critical" ? priority : "P2 - High";
    tags.push("performance");
    team = "Performance Engineering";
  }
  if (lower.includes("billing") || lower.includes("invoice")) {
    tags.push("billing");
    team = "Billing Operations";
  }
  if (lower.includes("password") || lower.includes("login")) {
    tags.push("authentication");
    team = "Identity & Access Management";
  }
  if (!tags.length) {
    tags.push("triage");
  }
  const actions = [];
  if (priority === "P1 - Critical") {
    actions.push("Create or attach to a major incident bridge.");
    actions.push("Page the on-call SRE and application owner.");
  } else if (priority === "P2 - High") {
    actions.push("Acknowledge ticket within 15 minutes and start investigation.");
  } else {
    actions.push("Respond within SLA and gather impact details from the requester.");
  }
  return { priority, team, tags, actions };
}
window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("mainInput");
  const sampleBtn = document.getElementById("sampleBtn");
  const clearBtn = document.getElementById("clearBtn");
  const runBtn = document.getElementById("runBtn");
  const extraControls = document.getElementById("extraControls");
  const outputPanel = document.getElementById("outputPanel");
  const outputBody = document.getElementById("outputBody");
  const metricConfidence = document.getElementById("metricConfidence");
  const metricLatency = document.getElementById("metricLatency");
  const metricPattern = document.getElementById("metricPattern");
  extraControls.innerHTML = `
    <div class="field">
      <label for="channel">Channel</label>
      <select id="channel">
        <option value="email">Email</option>
        <option value="chat">Chat</option>
        <option value="portal">Self-Service Portal</option>
      </select>
    </div>
  `;
  const channel = document.getElementById("channel");
  sampleBtn.addEventListener("click", () => {
    input.value = "Our analytics dashboard has been completely down for the last 20 minutes for all users in the Toronto region. Multiple clients have emailed saying they cannot access any reports.";
  });
  clearBtn.addEventListener("click", () => {
    input.value = "";
    outputBody.innerHTML = "<p>Paste a sample support ticket and click <strong>Run AI Analysis</strong> to see how a classifier could power triage and routing.</p>";
    outputPanel.querySelector(".output-header").innerHTML = '<span>Awaiting input...</span><span class="chip">No run yet</span>';
    metricConfidence.textContent = "-";
    metricLatency.textContent = "-";
    metricPattern.textContent = "-";
  });
  runBtn.addEventListener("click", () => {
    const text = input.value;
    const { priority, team, tags, actions } = classifyTicket(text);
    const latency = randomLatency();
    const confidence = randomFloat(0.8, 0.97);
    outputPanel.querySelector(".output-header").innerHTML = '<span>Classification complete (simulated)</span><span class="chip">' + priority + '</span>';
    let bodyHtml = "";
    bodyHtml += "<p><strong>Routing Decision</strong></p>";
    bodyHtml += "<p>Channel: <strong>" + channel.value + "</strong><br>";
    bodyHtml += "Assigned queue: <strong>" + team + "</strong><br>";
    bodyHtml += "Priority: <strong>" + priority + "</strong></p>";
    bodyHtml += "<p><strong>Tags</strong></p><div class='tags-row'>";
    tags.forEach(t => { bodyHtml += "<span class='tag'>" + t + "</span>"; });
    bodyHtml += "</div>";
    bodyHtml += "<p><strong>Suggested Playbook Steps</strong></p><ul>";
    actions.forEach(a => { bodyHtml += "<li>" + a + "</li>"; });
    bodyHtml += "</ul>";
    outputBody.innerHTML = bodyHtml;
    metricConfidence.textContent = confidence;
    metricLatency.textContent = latency.toString();
    metricPattern.textContent = "Ops • Ticket Classification";
  });
});