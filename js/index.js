const appointments = [];
let editIndex = "";
const bookedSlots = {};
const form = document.getElementById("appointmentForm");
const slotsDiv = document.getElementById("slots");
const tableBody = document.getElementById("appointmentData");
let arrPackages = [];
const today = new Date();
const sevenDays = new Date(today);

function RenderAppointment(appointment, index) {
  const row = document.createElement("tr");
  const { name, age, phone, address, date, slot } = appointment;
  row.innerHTML = `
        <td class="px-4 py-2 border border-gray-300">${name}</td>
        <td class="px-4 py-2 border border-gray-300">${age}</td>
        <td class="px-4 py-2 border border-gray-300">${phone}</td>
        <td class="px-4 py-2 border border-gray-300">${address}</td>
        <td class="px-4 py-2 border border-gray-300 bg-yellow-300">${date}</td>
        <td class="px-4 py-2 border border-gray-300">${slot}</td>
        <td class="px-4 py-2 border border-gray-300"><button onclick="DeleteApointment(${index})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button></td>
        <td class="px-4 py-2 border border-gray-300"><button onclick="EditAppointment(${index})" class="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"><a href="#form">Edit</a></button></td>
        `;

        
  tableBody.appendChild(row);
}

function AppointmentFormSubmit(event) {
    event.preventDefault();
    const { name, age, phone, address, date } = form.elements;
    const slot = document.querySelector("input[name='slot']:checked");
  
    if (![name.value, age.value, phone.value, address.value, date.value, slot].every(Boolean)) {
      alert("Please fill in all fields and select a slot.");
      return;
    }
  
    const selectedDate = date.value;
    const selectedSlot = slot.value;
  
    if (bookedSlots[selectedDate] && bookedSlots[selectedDate].includes(selectedSlot)) {
      ShowToast("This slot is already booked for the selected date.");
      return;
    }
  
    const newAppointment = {
      name: name.value,
      age: age.value,
      phone: phone.value,
      address: address.value,
      date: selectedDate,
      slot: selectedSlot
    };
  
    if (editIndex !== "") {
      appointments[editIndex] = newAppointment;
      tableBody.innerHTML = ""; // Clear table
      appointments.forEach(RenderAppointment);
      editIndex = ""; // Clear editIndex
      ShowToast("Appointment details updated successfully.");
    } else {
      appointments.push(newAppointment);
      RenderAppointment(newAppointment, appointments.length - 1);
      // Add the booked slot to the bookedSlots object
      if (!bookedSlots[selectedDate]) {
        bookedSlots[selectedDate] = [selectedSlot];
      } else {
        bookedSlots[selectedDate].push(selectedSlot);
      }
      ShowToast("Appointment scheduled successfully.");
    }
  
    form.reset();
  }
  
function RenderSlots(selectedDate) {
  const availableSlots = AvailableSlots(selectedDate);
  slotsDiv.innerHTML =
    availableSlots.length === 0
      ? "No slots available for selected date."
      : availableSlots
          .map(
            (slot) => `
          <div class="flex items-center mb-2">
            <input type="radio" name="slot" value="${slot}">
            <label class="ml-2">${slot}</label>
          </div>
        `
          )
          .join("");
}

function DeleteApointment(index) {
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
  
    deleteModal.style.display = 'block';
  
    confirmDeleteBtn.onclick = function() {
      const deletedAppointment = appointments.splice(index, 1)[0];
      tableBody.innerHTML = ""; // Clear table
      appointments.forEach(RenderAppointment);
      // Remove slot from bookedSlots
      const { date, slot } = deletedAppointment;
      if (bookedSlots[date]) {
        const index = bookedSlots[date].indexOf(slot);
        if (index !== -1) {
          bookedSlots[date].splice(index, 1);
        }
      }
      deleteModal.style.display = 'none';
    }
  
    cancelDeleteBtn.onclick = function() {
      deleteModal.style.display = 'none';
    }
  }
  

function EditAppointment(index) {
  const appointment = appointments[index];
  const slotInput = document.querySelector(`input[name='slot'][value='${appointment.slot}']`);
  if (slotInput) {
    slotInput.checked = true;
  }
  for (const key in appointment) {
    if (key !== "slot") {
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
  return slotsDay[dayOfWeek] || [];
}

form.addEventListener("submit", AppointmentFormSubmit);
document.getElementById("date").addEventListener("change", function () {
  RenderSlots(this.value);
});

sevenDays.setDate(today.getDate() + 7);
const minDate = today.toISOString().split("T")[0];
const maxDate = sevenDays.toISOString().split("T")[0];
document.getElementById("date").setAttribute("min", minDate);
document.getElementById("date").setAttribute("max", maxDate);

const picker = document.getElementById("date");
picker.addEventListener("input", function (e) {
  var day = new Date(this.value).getUTCDay();
  if ([6, 0].includes(day)) {
    e.preventDefault();
    this.value = "";
    ShowToast("Weekends Are Off...");
  }
});

function FindCustomer() {
  const selectedDate = document.getElementById("filter").value;
  const foundCustomers = appointments.filter((customer) => customer.date === selectedDate);
  if (foundCustomers.length === 0) {
    // alert("No customers found for the selected date.");
    ShowToast("No customers found for the selected date.");
    return;
  }
  tableBody.innerHTML = ""; // Clear table
  foundCustomers.forEach(RenderAppointment);
}

function ShowToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
