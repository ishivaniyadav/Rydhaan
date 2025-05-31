    let selectedCar = null;

    function showTab(tabName) {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
      });

      const clickedTab = Array.from(document.querySelectorAll('.tab')).find(tab =>
        tab.textContent.replace(/\s/g, '') === tabName.replace(/\s/g, '')
      );
      if (clickedTab) clickedTab.classList.add('active');

      const targetTab = document.getElementById(tabName);
      if (targetTab) {
        targetTab.classList.add('active');
        targetTab.style.display = 'block';
      }

      if (tabName === 'availableCars') displayCars();
      if (tabName === 'search') searchCars();
      if (tabName === 'myBookings') displayBookings();
    }

    function rentCar(index) {
      const cars = JSON.parse(localStorage.getItem('cars'));
      selectedCar = cars[index];
      document.getElementById('rentModal').style.display = 'block';
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('booking-form').reset();
      document.getElementById('total-price').textContent = '0';
      document.getElementById('book-now').style.display = 'none';
      document.getElementById('selected-price').textContent = selectedCar.price;
      document.getElementById('price-type').textContent = '';
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      document.getElementById('rentModal').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    function calculateIndexRent() {
      if (!selectedCar) {
        alert('No car selected!');
        return;
      }
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      if (!startDate || !endDate) {
        alert('Please select start and end dates.');
        return;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      let duration = (end - start) / (1000 * 60 * 60);
      if (duration <= 0) {
        alert('End time must be after start time.');
        return;
      }
      let total = 0;
      if (duration < 24) {
        total = duration * selectedCar.price;
        document.getElementById('price-type').textContent = 'Hourly pricing applied';
      } else {
        const days = Math.ceil(duration / 24);
        total = days * selectedCar.price * 24;
        document.getElementById('price-type').textContent = 'Daily pricing applied';
      }
      document.getElementById('total-price').textContent = Math.round(total);
      document.getElementById('book-now').style.display = 'inline-block';
    }

    function displayCars() {
      const carList = document.getElementById('carList');
      const cars = JSON.parse(localStorage.getItem('cars')) || [];
      carList.innerHTML = '';
      if (cars.length === 0) {
        carList.innerHTML = '<p>No cars available.</p>';
        return;
      }
      cars.forEach((car, index) => {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');
        carCard.innerHTML = `
          <img src="${car.image}" alt="Car Image">
          <div>
            <h4>${car.brand} (${car.year})</h4>
            <p>Type: ${car.type}, Transmission: ${car.transmission}</p>
            <p>Color: ${car.color}, Price: ₹${car.price}/hour</p>
            <button class="btn" onclick="rentCar(${index})">Rent</button>
          </div>
        `;
        carList.appendChild(carCard);
      });
    }

    function searchCars() {
      const brand = document.getElementById('searchInput').value.toLowerCase().trim();
      const type = document.getElementById('typeFilter').value.toLowerCase().trim();
      const transmission = document.getElementById('transmissionFilter').value.toLowerCase().trim();
      const year = document.getElementById('yearFilter').value.trim();
      const maxPrice = parseFloat(document.getElementById('priceFilter').value.trim());
      const sortBy = document.getElementById('sortBy').value;
      const searchResults = document.getElementById('searchResults');
      const cars = JSON.parse(localStorage.getItem('cars')) || [];

      let filteredCars = cars.filter(car => {
        return (
          (brand === '' || car.brand.toLowerCase().includes(brand)) &&
          (type === '' || car.type.toLowerCase().includes(type)) &&
          (transmission === '' || car.transmission.toLowerCase().includes(transmission)) &&
          (year === '' || car.year.toString().includes(year)) &&
          (isNaN(maxPrice) || car.price <= maxPrice)
        );
      });

      if (sortBy === 'price') filteredCars.sort((a, b) => a.price - b.price);
      else if (sortBy === 'year') filteredCars.sort((a, b) => b.year - a.year);
      else if (sortBy === 'brand') filteredCars.sort((a, b) => a.brand.localeCompare(b.brand));

      searchResults.innerHTML = '';
      if (filteredCars.length === 0) {
        searchResults.innerHTML = '<p>No matching cars found.</p>';
        return;
      }

      filteredCars.forEach((car, index) => {
        const card = document.createElement('div');
        card.classList.add('car-card');
        card.innerHTML = `
          <img src="${car.image}" alt="${car.brand}" />
          <div>
            <h4>${car.brand} (${car.year})</h4>
            <p>Type: ${car.type}, Transmission: ${car.transmission}</p>
            <p>Color: ${car.color}, Price: ₹${car.price}/hour</p>
            <button class="btn" onclick="rentCar(${index})">Rent</button>
          </div>
        `;
        searchResults.appendChild(card);
      });
    }

    function resetFilters() {
      document.getElementById('searchInput').value = '';
      document.getElementById('typeFilter').value = '';
      document.getElementById('transmissionFilter').value = '';
      document.getElementById('yearFilter').value = '';
      document.getElementById('priceFilter').value = '';
      document.getElementById('sortBy').value = '';
      searchCars();
    }

    function displayBookings() {
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      let bookingTableBody = document.getElementById('bookingTableBody');
      bookingTableBody.innerHTML = '';
      if (bookings.length === 0) {
        bookingTableBody.innerHTML = "<tr><td colspan='5'>No bookings yet.</td></tr>";
        return;
      }
      bookings.forEach(booking => {
        let row = document.createElement('tr');
        row.innerHTML = `
          <td>${booking.carBrand}</td>
          <td>${booking.fromTime || booking.startDate}</td>
          <td>${booking.toTime || booking.endDate}</td>
          <td>₹${booking.totalPrice}</td>
         <td>${booking.status === 'confirmed' ? 'Booked' : booking.status === 'canceled' ? 'Rejected' : 'Pending'}</td>

        `;
        bookingTableBody.appendChild(row);
      });
    }

    window.onload = function () {
      displayCars();
    };
    document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const booking = {
      renterName: document.getElementById("renterName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      startDate: document.getElementById("start-date").value,
      endDate: document.getElementById("end-date").value,
      totalPrice: parseInt(document.getElementById("total-price").textContent),
      carBrand: selectedCar.brand, 
      status: "pending" 
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    localStorage.setItem("booking", JSON.stringify(booking));

    window.location.href = "../stripe-payment/request.html";
  });