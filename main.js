// Function to handle file upload
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var fileInput = document.querySelector('input[type="file"]');
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var sheetName = workbook.SheetNames[0];
            var sheet = workbook.Sheets[sheetName];
            var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            displayExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("Please select an Excel file.");
    }
});

// Function to display data in a table
function displayExcelData(data) {
    var table = document.getElementById('excelTable');
    table.innerHTML = '';

    var headers = data[0];
    var headerRow = table.insertRow();
    headers.forEach(header => {
        var th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    for (var i = 1; i < data.length; i++) {
        var rowData = data[i];
        var row = table.insertRow();
        rowData.forEach(cellData => {
            var cell = row.insertCell();
            cell.textContent = cellData;
        });
    }

    document.getElementById('tableContainer').style.display = 'block';
    document.getElementById('rollOutBtn').style.display = 'inline'; // Show the "Roll Out Emails" button
}

// Function to handle Roll Out Emails button click
document.getElementById('rollOutBtn').addEventListener('click', function() {
    var table = document.getElementById('excelTable');
    var rows = table.rows;
    var payload = [];

    // Start from 1 to skip header row
    for (var i = 1; i < rows.length; i++) {
        var name = rows[i].cells[0].textContent;
        var email = rows[i].cells[1].textContent;
        var selected = rows[i].cells[2].textContent.trim().toLowerCase() === 'yes' ? 1 : 0;
        payload.push({ name: name, email: email, status: selected });
    }
    debugger;
    // Call the API with the payload
    fetch('https://abcdefgh.com/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data);
        alert('Emails rolled out successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while rolling out emails.');
    });
});
