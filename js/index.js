const appointments = [];
let editIndex = "";
const form = document.getElementById("appointmentForm");
const slotsDiv = document.getElementById("slots");
const tableBody = document.getElementById("appointmentData");
let arrPackages = [];

function RenderAppointment(appointment) {
  const row = document.createElement("tr");
  const { name, age, phone, address, date, slot } = appointment;
  row.innerHTML = `
        <td class="px-4 py-2 border border-gray-300">${name}</td>
        <td class="px-4 py-2 border border-gray-300">${age}</td>
        <td class="px-4 py-2 border border-gray-300">${phone}</td>
        <td class="px-4 py-2 border border-gray-300">${address}</td>
        <td class="px-4 py-2 border border-gray-300 bg-yellow-300">${date}</td>
        <td class="px-4 py-2 border border-gray-300">${slot}</td>
        <td class="px-4 py-2 border border-gray-300"><button onclick="DeleteAp(${appointments.indexOf(
          appointment
        )})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button></td>
        <td class="px-4 py-2 border border-gray-300"><button onclick="EditAp(${appointments.indexOf(
          appointment
        )})" class="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Edit</button></td>
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
    slot: slot.value
  };

  // Check if we're editing an existing appointment
  if (editIndex !== "") {
    // Update existing appointment data
    appointments[editIndex] = newAppointment;
    // Re-render the updated appointment
    document.getElementById("appointmentData").innerHTML = "";
    appointments.forEach((appointment, index) => {
      RenderAppointment(appointment, index);
    });
    // Clear editIndex
    editIndex = "";
  } else {
    // Add new appointment
    appointments.push(newAppointment);
    RenderAppointment(newAppointment);
  }
}

function RenderSlots(selectedDate) {
    const availableSlots = AvailableSlots(selectedDate);
    slotsDiv.innerHTML = availableSlots.length === 0
      ? "No slots available for selected date."
      : availableSlots.map(slot => `
          <div class="flex items-center mb-2">
            <input type="radio" name="slot" value="${slot}">
            <label class="ml-2">${slot}</label>
          </div>
        `).join('');
  }  

// Delete Function
function DeleteAp(index) {
  var a = confirm("Are you sure?");
  if (!a) return;
  appointments.splice(index, 1);
  document.getElementById("appointmentData").innerHTML = "";
  appointments.forEach((p, index) => {
    RenderAppointment(p, index, 0);
  });
}

function EditAp(index) {
    const appointment = appointments[index];
    
    // Set the value of the slot input element
    const slotInput = document.querySelector(`input[name='slot'][value='${appointment.slot}']`);
    if (slotInput) {
      slotInput.checked = true;
    }
  
    // Set the values of other input elements based on appointment properties
    for (const key in appointment) {
      if (key !== 'slot') {
        const element = document.getElementById(key);
        if (element) {
          element.value = appointment[key];
        }
      }
    }
  
    editIndex = index;
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
    [] // Saturday (off day)
  ];

  // Return an empty array if no slots are available for the selected day
  return slotsDay[dayOfWeek] || [];
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
const picker = document.getElementById("date");
picker.addEventListener("input", function (e) {
  var day = new Date(this.value).getUTCDay();
  if ([6, 0].includes(day)) {
    e.preventDefault();
    this.value = "";
    alert("Weekends are off...");
  }
});

function FindCustomer() {
  const selectedDate = document.getElementById("filter").value;
  const foundCustomers = appointments.filter(
    (customer) => customer.date === selectedDate
  );
  if (foundCustomers.length === 0) {
    alert("No customers found for the selected date.");
    return;
  }
  document.getElementById("appointmentData").innerHTML = "";
  foundCustomers.forEach(RenderAppointment);
}