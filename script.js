const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

const maxCount = 50;
const savedAttendance = JSON.parse(localStorage.getItem("attendanceCounts") || "null");
let count = savedAttendance === null ? 0 : savedAttendance.count;
const attendees = savedAttendance === null || !Array.isArray(savedAttendance.attendees)
  ? []
  : savedAttendance.attendees;

const teamCounts = {
  water: savedAttendance === null ? 0 : savedAttendance.teamCounts.water,
  zero: savedAttendance === null ? 0 : savedAttendance.teamCounts.zero,
  power: savedAttendance === null ? 0 : savedAttendance.teamCounts.power,
};

const teamCountElements = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"),
};

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

function updateAttendeeList() {
  attendeeList.textContent = "";

  attendees.forEach(function (attendee) {
    const attendeeItem = document.createElement("li");
    const name = document.createElement("span");
    const team = document.createElement("span");

    name.className = "attendee-name";
    name.textContent = attendee.name;
    team.className = "attendee-team";
    team.textContent = teamNames[attendee.team];

    attendeeItem.append(name, team);
    attendeeList.append(attendeeItem);
  });
}

function updateAttendanceDisplay() {
  attendeeCount.textContent = count;
  teamCountElements.water.textContent = teamCounts.water;
  teamCountElements.zero.textContent = teamCounts.zero;
  teamCountElements.power.textContent = teamCounts.power;

  const progressPercentage = Math.min((count / maxCount) * 100, 100);
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.setAttribute("aria-valuenow", Math.min(count, maxCount));
}

updateAttendanceDisplay();
updateAttendeeList();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  count += 1;
  teamCounts[team] += 1;
  attendees.push({
    name: name,
    team: team,
  });

  updateAttendanceDisplay();
  updateAttendeeList();
  localStorage.setItem("attendanceCounts", JSON.stringify({
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  }));

  greeting.textContent = `Welcome, ${name}! You are checked in with ${teamName}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  form.reset();
});