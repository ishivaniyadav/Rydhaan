
    let cars = JSON.parse(localStorage.getItem('cars')) || [];
    function showSection(section, element) {
        document.querySelectorAll('.container').forEach(div => div.style.display = 'none');
        document.getElementById(section).style.display = 'block';
        document.querySelectorAll('.navbar a').forEach(a => a.classList.remove('active'));
        element.classList.add('active');
    }

    function previewImage() {
        let file = document.getElementById('carImage').files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let previewImg = document.getElementById('previewImg');
                previewImg.src = e.target.result;
                previewImg.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }

    function postCar() {
        let brand = document.getElementById('brand').value;
        let type = document.getElementById('type').value;
        let transmission = document.getElementById('transmission').value;
        let color = document.getElementById('color').value;
        let year = document.getElementById('year').value;
        let price = document.getElementById('price').value;
        let description = document.getElementById('description').value;
        let carImage = document.getElementById('carImage').files[0];

        if (!brand || !type || !transmission || !color || !year || !price || !description || !carImage) {
            alert("Please fill all fields and upload an image!");
            return;
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            let cars = JSON.parse(localStorage.getItem("cars")) || [];
            let carData = {
                id: Date.now(),
                brand,
                type,
                transmission,
                color,
                year,
                price,
                description,
                image: e.target.result
            };

            cars.push(carData);
            localStorage.setItem("cars", JSON.stringify(cars));

            document.getElementById("successMessage").style.display = "block";
            setTimeout(() => location.reload(), 1500);
        };

        reader.readAsDataURL(carImage);
    }

    function updateCarList() {
        let carList = document.getElementById('carList');
        if (!carList) {
            console.error("Car list element not found!");
            return;
        }

        carList.innerHTML = "";

        let cars = JSON.parse(localStorage.getItem('cars')) || [];

        cars.forEach(car => {
            let carDiv = document.createElement('div');
            carDiv.classList.add('car-card');
            carDiv.innerHTML = `
                <img src="${car.image}">
                <div>
                    <b>${car.brand} (${car.year})</b><br>
                    Type: ${car.type} | Transmission: ${car.transmission} | Color: ${car.color} <br>
                    Price: ₹${car.price}/hour
                </div>
                <button class="btn btn-update" onclick="editCar(${car.id})">Update</button>
                <button class="btn btn-delete" onclick="deleteCar(${car.id})">Delete</button>
            `;
            carList.appendChild(carDiv);
        });
    }

    function editCar(carId) {
        let cars = JSON.parse(localStorage.getItem('cars')) || [];
        let car = cars.find(car => car.id === carId);

        if (!car) return;

        document.getElementById('updateCarForm').style.display = 'block';
        document.getElementById('updateBrand').value = car.brand;
        document.getElementById('updateType').value = car.type;
        document.getElementById('updateTransmission').value = car.transmission;
        document.getElementById('updateColor').value = car.color;
        document.getElementById('updateYear').value = car.year;
        document.getElementById('updatePrice').value = car.price;
        document.getElementById('updateDescription').value = car.description;
        document.getElementById('updatePreviewImg').src = car.image;
        document.getElementById('updatePreviewImg').style.display = 'block';

        document.getElementById('submitUpdateBtn').setAttribute("onclick", `submitUpdate(${car.id})`);
    }

    function submitUpdate(carId) {
        let cars = JSON.parse(localStorage.getItem('cars')) || [];
        let carIndex = cars.findIndex(car => car.id === carId);

        if (carIndex === -1) return;

        let updatedCar = {
            ...cars[carIndex],
            brand: document.getElementById('updateBrand').value,
            type: document.getElementById('updateType').value,
            transmission: document.getElementById('updateTransmission').value,
            color: document.getElementById('updateColor').value,
            year: document.getElementById('updateYear').value,
            price: document.getElementById('updatePrice').value,
            description: document.getElementById('updateDescription').value
        };

        let imageFile = document.getElementById('updateCarImage').files[0];

        if (imageFile) {
            let reader = new FileReader();
            reader.onload = function (event) {
                updatedCar.image = event.target.result;
                cars[carIndex] = updatedCar;
                localStorage.setItem('cars', JSON.stringify(cars));
                updateCarList();
            };
            reader.readAsDataURL(imageFile);
        } else {
            cars[carIndex] = updatedCar;
            localStorage.setItem('cars', JSON.stringify(cars));
            updateCarList();
        }

        document.getElementById('updateCarForm').style.display = 'none';
        document.getElementById('updateSuccessMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('updateSuccessMessage').style.display = 'none';
        }, 3000);
    }

    function deleteCar(carId) {
        let cars = JSON.parse(localStorage.getItem('cars')) || [];
        cars = cars.filter(car => car.id !== carId);
        localStorage.setItem('cars', JSON.stringify(cars));

        updateCarList();
    }

    document.addEventListener("DOMContentLoaded", updateCarList);

        function loadBookings() {
            let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
            let bookingsTableBody = document.getElementById("bookingsTableBody");

            bookingsTableBody.innerHTML = ""; 
            bookings.forEach((booking, index) => {
                const row = `
    <tr>
        <td>${index + 1}</td>
        <td>${booking.renterName || "N/A"}</td>
        <td>${booking.email || "N/A"}</td>
        <td>${booking.address || "N/A"}</td>
        <td>${booking.carBrand || "N/A"}</td>
        <td>${booking.startDate || booking.fromTime || "N/A"}</td>
        <td>${booking.endDate || booking.toTime || "N/A"}</td>
    <td class="${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</td>
    <td>
    ${booking.status === 'pending' ? `
        <button onclick="updateBookingStatus(${index}, 'confirmed')">Approve</button>
        <button onclick="updateBookingStatus(${index}, 'canceled')">Reject</button>
    ` : '-'}
    </td>

    </tr>
    `;

    bookingsTableBody.innerHTML += row;
    });

        }

        document.addEventListener("DOMContentLoaded", loadBookings);


    function acceptBooking(index) {
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings[index].status = "confirmed";
        localStorage.setItem("bookings", JSON.stringify(bookings));
        loadBookingRequests();
    }

    function rejectBooking(index) {
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings[index].status = "canceled";
        localStorage.setItem("bookings", JSON.stringify(bookings));
        loadBookingRequests();
    }

    document.addEventListener("DOMContentLoaded", function () {
        const requestsContainer = document.getElementById("requests-container");
        if (!requestsContainer) {
            console.error("Error: 'requests-container' element not found!");
            return;
        }

        let requests = JSON.parse(localStorage.getItem("renterRequests")) || [];
        
        if (requests.length === 0) {
            requestsContainer.innerHTML = "<p>No requests found.</p>";
        } else {
            requestsContainer.innerHTML = "";
            requests.forEach((request, index) => {
                let requestElement = document.createElement("div");
                requestElement.classList.add("request-item");
                requestElement.innerHTML = `
                    <p><strong>Property:</strong> ${request.propertyName}</p>
                    <p><strong>Renter Name:</strong> ${request.renterName}</p>
                    <p><strong>Message:</strong> ${request.message}</p>
                    <button onclick="deleteRequest(${index})">Delete</button>
                `;
                requestsContainer.appendChild(requestElement);
            });
        }
    });

    function updateBookingStatus(index, newStatus) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings[index].status = newStatus;
    localStorage.setItem("bookings", JSON.stringify(bookings));

    localStorage.setItem("booking", JSON.stringify(bookings[index]));

    loadBookings(); 
    }
          const revenueChart = new Chart(document.getElementById('revenueChart'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'August'],
        datasets: [{
          label: 'Monthly Revenue (₹)',
          data: [12000, 15000, 14000, 18000, 20000, 15000, 18000, 19000],
          borderColor: '#007BFF',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    const bookingChart = new Chart(document.getElementById('bookingChart'), {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [{
          label: 'Bookings',
          data: [5, 8, 6, 10, 12, 14, 17, 20],
          backgroundColor: '#1755a7'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    const ratingChart = new Chart(document.getElementById('ratingChart'), {
      type: 'doughnut',
      data: {
        labels: ['5⭐', '4⭐', '3⭐', '2⭐', '1⭐'],
        datasets: [{
          label: 'User Ratings',
          data: [40, 32, 13, 10, 5],
          backgroundColor: [
            '#007BFF',
            '#17a2b8',
            '#ffc107',
            '#fd7e14',
            '#dc3545'
          ]
        }]
      },
      options: {
        responsive: true,
        radius: '70%',
        cutout: '50%',
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
