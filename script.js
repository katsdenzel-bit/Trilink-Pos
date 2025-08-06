const form = document.getElementById('userForm');
const tableBody = document.querySelector('#userTable tbody');
const search = document.getElementById('search');

let users = JSON.parse(localStorage.getItem('users')) || [];

function updateTable() {
  tableBody.innerHTML = '';
  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = \`
      <td>\${user.name}</td>
      <td>\${user.mac}</td>
      <td>UGX \${user.plan}</td>
      <td>\${user.points}</td>
      <td>
        <button onclick="deleteUser(\${index})">Delete</button>
      </td>
    \`;
    tableBody.appendChild(row);
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const mac = document.getElementById('mac').value.trim();
  const plan = parseInt(document.getElementById('plan').value);

  if (users.some(u => u.mac === mac)) {
    alert('MAC address already exists.');
    return;
  }

  const points = Math.floor(plan / 1000);
  users.push({ name, mac, plan, points });
  localStorage.setItem('users', JSON.stringify(users));
  updateTable();
  form.reset();
});

function deleteUser(index) {
  users.splice(index, 1);
  localStorage.setItem('users', JSON.stringify(users));
  updateTable();
}

search.addEventListener('input', function() {
  const query = search.value.toLowerCase();
  const filtered = users.filter(u => u.name.toLowerCase().includes(query) || u.mac.toLowerCase().includes(query));
  tableBody.innerHTML = '';
  filtered.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = \`
      <td>\${user.name}</td>
      <td>\${user.mac}</td>
      <td>UGX \${user.plan}</td>
      <td>\${user.points}</td>
      <td>
        <button onclick="deleteUser(\${index})">Delete</button>
      </td>
    \`;
    tableBody.appendChild(row);
  });
});

updateTable();