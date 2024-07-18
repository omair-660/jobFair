//Load Functionn
window.addEventListener("load", function() {
    const loadingElement = document.querySelector(".load");

    function hideLoading() {
        loadingElement.classList.add("hidden");
        setTimeout(() => {
            loadingElement.style.display = "none";
        }, 500); 
    }

    hideLoading();
});

        const data = {
            "customers": [
                { "id": 1, "name": "Ahmed Ali" },
                { "id": 2, "name": "Aya Elsayed" },
                { "id": 3, "name": "Mina Adel" },
                { "id": 4, "name": "Sarah Reda" },
                { "id": 5, "name": "Mohamed Sayed" },
                { "id": 6, "name": "Omair Mohamed" }
            ],
            "transactions": [
                { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
                { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
                { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
                { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
                { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
                { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
                { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
                { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
                { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 },
                { "id": 10, "customer_id": 6, "date": "2024-06-06", "amount": 8475 },
                { "id": 11, "customer_id": 6, "date": "2022-01-02", "amount": 1475 },
            ]
        };

        let tbody = document.querySelector("tbody"),
            notFound = document.querySelector(".not-found");

        // Function to display customers and their transactions
        function displayCustomers() {
            let content = '';
            let customersMap = new Map();

            data.transactions.forEach(transaction => {
                if (!customersMap.has(transaction.customer_id)) {
                    customersMap.set(transaction.customer_id, []);
                }
                customersMap.get(transaction.customer_id).push(transaction);
            });

            customersMap.forEach((transactions, customerId) => {
                let customer = data.customers.find(c => c.id === customerId);
                transactions.forEach((transaction, index) => {
                    content += `
                    <tr data-customer-id="${customerId}">
                        <th scope="row">${transaction.id}</th>
                        <td>${index === 0 ? customer.name : ''}</td>
                        <td>${transaction.date}</td>
                        <td>${transaction.amount}</td>
                    </tr>
                    `;
                });
            });

            tbody.innerHTML = content;
            addRowClickListeners();
        }

        displayCustomers();

        // Search by customer name
        let search = document.querySelector(".search");

        search.addEventListener("input", function() {
            let term = search.value.toLowerCase();
            let found = false;
            let content = '';
            let customersMap = new Map();

            data.transactions.forEach(transaction => {
                if (!customersMap.has(transaction.customer_id)) {
                    customersMap.set(transaction.customer_id, []);
                }
                customersMap.get(transaction.customer_id).push(transaction);
            });

            customersMap.forEach((transactions, customerId) => {
                let customer = data.customers.find(c => c.id === customerId);
                if (customer && customer.name.toLowerCase().includes(term)) {
                    found = true;
                    transactions.forEach((transaction, index) => {
                        content += `
                        <tr data-customer-id="${customerId}">
                            <th scope="row">${transaction.id}</th>
                            <td>${index === 0 ? customer.name : ''}</td>
                            <td>${transaction.date}</td>
                            <td>${transaction.amount}</td>
                        </tr>
                        `;
                    });
                }
            });

            if (!found) {
                notFound.classList.add("show");
            } else {
                notFound.classList.remove("show");
            }

            tbody.innerHTML = content;
            addRowClickListeners();
        });

        // Search by transaction amount
        let searchAmount = document.querySelector(".searchId");

        searchAmount.addEventListener("input", function() {
            let term = searchAmount.value;
            let found = false;
            let content = '';
            let customersMap = new Map();

            data.transactions.forEach(transaction => {
                if (!customersMap.has(transaction.customer_id)) {
                    customersMap.set(transaction.customer_id, []);
                }
                customersMap.get(transaction.customer_id).push(transaction);
            });

            customersMap.forEach((transactions, customerId) => {
                let customer = data.customers.find(c => c.id === customerId);
                transactions.forEach((transaction, index) => {
                    if (transaction.amount.toString().includes(term)) {
                        found = true;
                        content += `
                        <tr data-customer-id="${customerId}">
                            <th scope="row">${transaction.id}</th>
                            <td>${index === 0 ? customer.name : ''}</td>
                            <td>${transaction.date}</td>
                            <td>${transaction.amount}</td>
                        </tr>
                        `;
                    }
                });
            });

            if (!found) {
                notFound.classList.add("show");
            } else {
                notFound.classList.remove("show");
            }

            tbody.innerHTML = content;
            addRowClickListeners();
        });

        // Add click listeners to table rows
        function addRowClickListeners() {
            let rows = document.querySelectorAll("tbody tr");
            rows.forEach(row => {
                row.addEventListener("click", function(e) {
                    let customerId = this.getAttribute('data-customer-id');
                    let transactions = data.transactions.filter(t => t.customer_id == customerId);
                    updateChart(transactions);
                });
            });
        }

        // Function to display chart using Chart.js
        function displayChart(labels, amounts) {
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Transaction Amounts',
                        data: amounts,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            return myChart;
        }

        // Initialize the chart with empty data
        let myChart = displayChart([], []);

        // Function to update the chart
        function updateChart(transactions) {
            let labels = transactions.map(t => t.date);
            let amounts = transactions.map(t => t.amount);
            myChart.data.labels = labels;
            myChart.data.datasets[0].data = amounts;
            myChart.update();
        }