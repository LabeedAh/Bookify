const appointments = [];
const form = document.getElementById("appointmentForm");
const slotsDiv = document.getElementById("slots");
const tableBody = document.getElementById("appointmentData");

function GetValue(inputName) {
    return document.getElementById(inputName).value;
}

function RenderAppointment(appointment) {
    const row = document.createElement("tr");
    const { name, age, phone, address, date, slot } = appointment;
    row.innerHTML = `
        <td>${name}</td>
        <td>${age}</td>
        <td>${phone}</td>
        <td>${address}</td>
        <td>${date}</td>
        <td>${slot}</td>
    `;

    tableBody.appendChild(row);
}

function AppointmentFormSubmit(event) {
    event.preventDefault();

    const { name, age, phone, address, date } = form.elements;
    const slot = document.querySelector("input[name='slot']:checked");

    if (
        !name.value ||
        !age.value ||
        !phone.value ||
        !address.value ||
        !date.value ||
        !slot
    ) {
        alert("Please fill in all fields and select a slot.");
        return;
    }

    const newAppointment = {
        name: name.value,
        age: age.value,
        phone: phone.value,
        address: address.value,
        date: date.value,
        slot: slot.value,
    };

    appointments.push(newAppointment);
    RenderAppointment(newAppointment);
    form.reset();
    slotsDiv.innerHTML = "";
}

function RenderSlots(selectedDate) {
    const availableSlots = AvailableSlots(selectedDate);
    slotsDiv.innerHTML = "";

    availableSlots.forEach((slot) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "slot";
        input.value = slot;

        const label = document.createElement("label");
        label.textContent = slot;
        label.classList.add("ml-2");

        const slotContainer = document.createElement("div");
        slotContainer.classList.add("flex", "items-center", "mb-2");
        slotContainer.appendChild(input);
        slotContainer.appendChild(label);

        slotsDiv.appendChild(slotContainer);
    });
}

function AvailableSlots(date) {
    const dayOfWeek = new Date(date).getDay();
    const slotsDay = [
        [], // Sunday (off day)
        ["09:00 AM-11:00 AM", "11:30 AM-01:00 PM", "03:00 PM-04:00 PM"], // Monday
        ["08:00 AM-09:00 AM", "10:00 AM-11:30 AM", "12:00 PM-01:30 PM"], // Tuesday
        ["09:30 AM-11:30 AM", "12:30 AM-02:00 PM"], // Wednesday
        ["08:30 AM-10:30 AM", "11:30 AM-01:00 PM", "03:30 PM-05:30 PM"], // Thursday
        ["09:00 AM-10:00 AM", "10:30 AM-12:30 PM", "03:00 PM-4:00 PM"], // Friday
        [], // Saturday (off day)
    ];
    return slotsDay[dayOfWeek];
}

// Event listeners
form.addEventListener("submit", AppointmentFormSubmit);
document.getElementById("date").addEventListener("change", function () {
    RenderSlots(this.value);
});

// Initial setup
const today = new Date();
const sevenDays = new Date(today);
sevenDays.setDate(today.getDate() + 7);
const minDate = today.toISOString().split("T")[0];
const maxDate = sevenDays.toISOString().split("T")[0];

document.getElementById("date").setAttribute("min", minDate);
document.getElementById("date").setAttribute("max", maxDate);


//For disabeling the Weekends
const picker = document.getElementById('date');
picker.addEventListener('input', function(e){
  var day = new Date(this.value).getUTCDay();
  if([6,0].includes(day)){
    e.preventDefault();
    this.value = '';
    alert('Weekends not allowed');
  }
});
