const data = { 
    "customers": [
        { "id": 1, "name": "Ahmed Ali" },
        { "id": 2, "name": "Aya Elsayed" },
        { "id": 3, "name": "Mina Adel" },
        { "id": 4, "name": "Sarah Reda" },
        { "id": 5, "name": "Mohamed Sayed" }
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
        { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
    ]
};

let tbody = document.querySelector("tbody"),
    notFound = document.querySelector(".not-found");

// Function to display customers and their transactions
function displayCustomers() {
    let content = '';
    for (let i = 0; i < data.transactions.length; i++) {
        let transaction = data.transactions[i];
        let customer = data.customers.find(c => c.id === transaction.customer_id);

        content += `
        <tr>
            <th scope="row">${transaction.id}</th>
            <td>${customer ? customer.name : 'Unknown'}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>        
        </tr>
        `;
    }
    tbody.innerHTML = content;
    addRowClickListeners();
}

displayCustomers();

// Search by customer name 
let search = document.querySelector(".search");

search.addEventListener("input", function() {
    let term = search.value.toLowerCase();
    let found = false;
    let content = "";

    for (let i = 0; i < data.transactions.length; i++) {
        let transaction = data.transactions[i];
        let customer = data.customers.find(c => c.id === transaction.customer_id);

        if (customer && customer.name.toLowerCase().includes(term)) {
            notFound.classList.remove("show");
            found = true;
            content += `
            <tr>
                <th scope="row">${transaction.id}</th>
                <td>${customer.name}</td>
                <td>${transaction.date}</td>
                <td>${transaction.amount}</td>        
            </tr>
            `;
        }
    }

    if (!found) {
        notFound.classList.add("show");
    }

    tbody.innerHTML = content;
    addRowClickListeners();
});

// Search by transaction amount 
let searchAmount = document.querySelector(".searchId");

searchAmount.addEventListener("input", function() {
    let term = searchAmount.value;
    let found = false;
    let content = "";

    for (let i = 0; i < data.transactions.length; i++) {
        notFound.classList.remove("show");
        let transaction = data.transactions[i];
        let customer = data.customers.find(c => c.id === transaction.customer_id);

        if (transaction.amount.toString().includes(term)) {
            found = true;
            content += `
            <tr>
                <th scope="row">${transaction.id}</th>
                <td>${customer ? customer.name : 'Unknown'}</td>
                <td>${transaction.date}</td>
                <td>${transaction.amount}</td>        
            </tr>
            `;
        }
    }

    if (!found) {
        notFound.classList.add("show");
    }

    tbody.innerHTML = content;
    addRowClickListeners();
});

// Add click listeners to table rows
function addRowClickListeners() {
    let rows = document.querySelectorAll("tbody tr");
    rows.forEach(row => {
        row.addEventListener("click", function(e) {
            let transactionId = this.querySelector("th").innerText;
            let transaction = data.transactions.find(t => t.id == transactionId);
            updateChart(transaction);
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
function updateChart(transaction) {
    let labels = [transaction.date];
    let amounts = [transaction.amount];
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = amounts;
    myChart.update();
}