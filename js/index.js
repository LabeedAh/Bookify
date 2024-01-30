const appointments = [];
let editIndex = '';
const form = document.getElementById("appointmentForm");
const slotsDiv = document.getElementById("slots");
const tableBody = document.getElementById("appointmentData");
// let arrPackages = [];

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
        <td><button onclick="DeleteAp(${appointments.indexOf(appointment)})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button></td>
        <td><button onclick="EditAp(${appointments.indexOf(appointment)})" class="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Edit</button></td>
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

    // Check if we're editing an existing appointment
    if (editIndex !== '') {
        // Update existing appointment data
        appointments[editIndex] = newAppointment;
        // Re-render the updated appointment
        document.getElementById("appointmentData").innerHTML = '';
        appointments.forEach((appointment, index) => {
            RenderAppointment(appointment, index);
        });
        // Clear editIndex
        editIndex = '';
    } else {
        // Add new appointment
        appointments.push(newAppointment);
        RenderAppointment(newAppointment);
    }
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

function DeleteAp(index) {
    
    var a = confirm("Are you sure?");
    if (!a) return;
    appointments.splice(index, 1);

    document.getElementById("appointmentData").innerHTML = '';
    console.log(appointments);
    
    appointments.forEach((p, index) => {
        RenderAppointment(p, index,0);
      
    });
}

function EditAp(index) {
    const appoint = appointments[index];

    // Assuming 'slot' is a property of the 'appoint' object
    const slotValue = appoint.slot;

    // Update the value of the input element with the name 'slot'
    const slotInputs = document.querySelectorAll("input[name='slot']");
    slotInputs.forEach(input => {
        if (input.value === slotValue) {
            input.checked = true; // Assuming 'slot' is for radio buttons
        }
    });

    // Assuming other properties of the appointment object are directly linked to input elements with corresponding IDs
    for (let key in appoint) {
        if (key !== 'slot') {
            const value = appoint[key];
            const element = document.getElementById(key);
            if (element) {
                element.value = value;
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
    alert('Weekends are off...');
  }
});

// const arrPackages = appointments; // Assuming your appointments array is named 'appointments'

// function findCustomer() {
//     const dat = document.getElementById('findByDate').value;
//     const foundCustomer = appointments.filter(appointment => appointment.date === dat);

//     if (foundCustomer.length === 0) {
//         alert('No Customer found');
//         // Optionally, you can display all appointments if none are found
//         PrintPackagesInfo(appointments);
//         return;
//     }

//     RenderAppointment(foundCustomer);
// }
