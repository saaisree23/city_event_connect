let events = JSON.parse(localStorage.getItem("events")) || [];
let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

let selectedEventIndex = null;

/* =========================
   SAVE FUNCTIONS
========================= */

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
}

function saveRegistrations() {
    localStorage.setItem("registrations", JSON.stringify(registrations));
}

/* =========================
   ADD EVENT MODAL
========================= */

function openAddModal() {
    document.getElementById("addEventModal").style.display = "block";
}

function closeAddModal() {
    document.getElementById("addEventModal").style.display = "none";
}

/* =========================
   REGISTRATION MODAL
========================= */

function openModal(index) {
    selectedEventIndex = index;

    const eventFee = events[index].fee;

    document.getElementById("registerBtn").innerText =
        "Register (₹" + eventFee + ")";

    document.getElementById("registrationModal").style.display = "block";
}

function closeModal() {
    document.getElementById("registrationModal").style.display = "none";
}

/* =========================
   ADD EVENT FUNCTION
========================= */

function addEvent() {
    const title = document.getElementById("title").value.trim();
    const college = document.getElementById("college").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const location = document.getElementById("location").value.trim();
    const fee = document.getElementById("fee").value.trim();

    if (!title || !college || !category || !date || !location || !fee) {
        alert("Please fill all fields properly.");
        return;
    }

    events.push({
        title,
        college,
        category,
        date,
        location,
        fee
    });

    saveEvents();
    displayEvents();

    // Clear fields
    document.getElementById("title").value = "";
    document.getElementById("college").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    document.getElementById("location").value = "";
    document.getElementById("fee").value = "";

    closeAddModal();
}

/* =========================
   DISPLAY EVENTS
========================= */

function displayEvents() {

    const container = document.getElementById("eventsContainer");
    container.innerHTML = "";

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const filterCollege =
        document.getElementById("filterCollege").value;

    const filterCategory =
        document.getElementById("filterCategory").value;

    const upcomingOnly =
        document.getElementById("upcomingOnly").checked;

    const today = new Date().toISOString().split("T")[0];

    let filteredEvents = events.filter(event => {
        return (
            (filterCollege === "All" || event.college === filterCollege) &&
            (filterCategory === "All" || event.category === filterCategory) &&
            event.title.toLowerCase().includes(searchText) &&
            (!upcomingOnly || event.date >= today)
        );
    });

    if (filteredEvents.length === 0) {
        container.innerHTML = "<p>No events found.</p>";
        return;
    }

    filteredEvents.forEach((event, index) => {

        const isRegistered = registrations.some(
            r => r.eventIndex === index
        );

        const card = document.createElement("div");
        card.className = "event-card";

        card.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>College:</strong> ${event.college}</p>
            <p><strong>Category:</strong> ${event.category}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Fee:</strong> ₹${event.fee}</p>

            <button onclick="openModal(${index})"
                style="background:${isRegistered ? '#16a34a' : '#4f46e5'};">
                ${isRegistered ? "Registered" : "Register"}
            </button>
        `;

        container.appendChild(card);
    });
}

/* =========================
   SUBMIT REGISTRATION
========================= */

function submitRegistration() {

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const college = document.getElementById("regCollege").value.trim();

    if (!name || !email || !phone || !college) {
        alert("Please fill all fields.");
        return;
    }

    const requiredFee = events[selectedEventIndex].fee;

    registrations.push({
        eventIndex: selectedEventIndex,
        name,
        email,
        phone,
        college,
        paidAmount: requiredFee
    });

    saveRegistrations();
    closeModal();
    displayEvents();

    alert("Payment of ₹" + requiredFee +
        " Successful! Registration Confirmed.");

    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPhone").value = "";
    document.getElementById("regCollege").value = "";
}

/* =========================
   INITIAL LOAD
========================= */

displayEvents();