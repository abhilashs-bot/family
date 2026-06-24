// API Base URL
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const tableBody = document.getElementById('tableBody');
const grandTotalEl = document.getElementById('grandTotal');
const filterRoomInput = document.getElementById('filterRoom');
const exportBtn = document.getElementById('exportBtn');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.querySelector('.close');
const summaryContainer = document.getElementById('summaryContainer');

let expenses = [];
let filteredExpenses = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  setDefaultDate();
  loadExpenses();
  setupEventListeners();
});

// Set today's date as default
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  document.getElementById('editDate').value = today;
}

// Setup event listeners
function setupEventListeners() {
  expenseForm.addEventListener('submit', addExpense);
  editForm.addEventListener('submit', updateExpense);
  filterRoomInput.addEventListener('input', filterExpenses);
  exportBtn.addEventListener('click', exportToCSV);
  closeModal.addEventListener('click', () => {
    editModal.style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.style.display = 'none';
    }
  });
}

// Load all expenses
async function loadExpenses() {
  try {
    const response = await fetch(`${API_URL}/expenses`);
    if (response.ok) {
      expenses = await response.json();
      filteredExpenses = expenses;
      displayExpenses();
      displaySummary();
    }
  } catch (error) {
    console.error('Error loading expenses:', error);
    showNotification('Error loading expenses', 'error');
  }
}

// Add new expense
async function addExpense(e) {
  e.preventDefault();

  const expense = {
    room: document.getElementById('room').value,
    category: document.getElementById('category').value,
    item: document.getElementById('item').value,
    qty: parseInt(document.getElementById('qty').value),
    cost: parseFloat(document.getElementById('cost').value),
    mode_of_payment: document.getElementById('payment').value,
    date: document.getElementById('date').value
  };

  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });

    if (response.ok) {
      expenseForm.reset();
      setDefaultDate();
      loadExpenses();
      showNotification('Expense added successfully!', 'success');
    } else {
      showNotification('Error adding expense', 'error');
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    showNotification('Error adding expense', 'error');
  }
}

// Update expense
async function updateExpense(e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const expense = {
    room: document.getElementById('editRoom').value,
    category: document.getElementById('editCategory').value,
    item: document.getElementById('editItem').value,
    qty: parseInt(document.getElementById('editQty').value),
    cost: parseFloat(document.getElementById('editCost').value),
    mode_of_payment: document.getElementById('editPayment').value,
    date: document.getElementById('editDate').value
  };

  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });

    if (response.ok) {
      editModal.style.display = 'none';
      loadExpenses();
      showNotification('Expense updated successfully!', 'success');
    } else {
      showNotification('Error updating expense', 'error');
    }
  } catch (error) {
    console.error('Error updating expense:', error);
    showNotification('Error updating expense', 'error');
  }
}

// Delete expense
async function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadExpenses();
        showNotification('Expense deleted successfully!', 'success');
      } else {
        showNotification('Error deleting expense', 'error');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      showNotification('Error deleting expense', 'error');
    }
  }
}

// Edit expense - populate modal
function editExpense(id) {
  const expense = expenses.find(e => e.id === id);
  if (expense) {
    document.getElementById('editId').value = expense.id;
    document.getElementById('editRoom').value = expense.room;
    document.getElementById('editCategory').value = expense.category;
    document.getElementById('editItem').value = expense.item;
    document.getElementById('editQty').value = expense.qty;
    document.getElementById('editCost').value = expense.cost;
    document.getElementById('editPayment').value = expense.mode_of_payment;
    document.getElementById('editDate').value = expense.date;
    editModal.style.display = 'block';
  }
}

// Display expenses in table
function displayExpenses() {
  tableBody.innerHTML = '';
  let grandTotal = 0;

  if (filteredExpenses.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #999;">No expenses found</td></tr>';
    grandTotalEl.textContent = '₹0.00';
    return;
  }

  filteredExpenses.forEach(expense => {
    const total = expense.cost * expense.qty;
    grandTotal += total;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(expense.date)}</td>
      <td><strong>${escape(expense.room)}</strong></td>
      <td>${escape(expense.category)}</td>
      <td>${escape(expense.item)}</td>
      <td>${expense.qty}</td>
      <td>₹${expense.cost.toFixed(2)}</td>
      <td><strong>₹${total.toFixed(2)}</strong></td>
      <td>${escape(expense.mode_of_payment)}</td>
      <td>
        <button class="btn-edit" onclick="editExpense(${expense.id})">Edit</button>
        <button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  grandTotalEl.textContent = `₹${grandTotal.toFixed(2)}`;
}

// Display summary cards
function displaySummary() {
  summaryContainer.innerHTML = '';
  const summaryData = {};

  expenses.forEach(expense => {
    if (!summaryData[expense.room]) {
      summaryData[expense.room] = { total: 0, items: 0 };
    }
    summaryData[expense.room].total += expense.cost * expense.qty;
    summaryData[expense.room].items += 1;
  });

  // Sort by total cost descending
  const sorted = Object.entries(summaryData).sort((a, b) => b[1].total - a[1].total);

  sorted.forEach(([room, data]) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `
      <h3>${escape(room)}</h3>
      <div class="total">₹${data.total.toFixed(2)}</div>
      <div class="item-count">${data.items} item${data.items !== 1 ? 's' : ''}</div>
    `;
    summaryContainer.appendChild(card);
  });
}

// Filter expenses by room
function filterExpenses() {
  const searchTerm = filterRoomInput.value.toLowerCase();
  filteredExpenses = expenses.filter(expense =>
    expense.room.toLowerCase().includes(searchTerm)
  );
  displayExpenses();
}

// Export to CSV
function exportToCSV() {
  if (filteredExpenses.length === 0) {
    showNotification('No expenses to export', 'error');
    return;
  }

  let csv = 'Date,Room,Category,Item,Quantity,Cost/Unit (₹),Total (₹),Mode of Payment\n';

  filteredExpenses.forEach(expense => {
    const total = expense.cost * expense.qty;
    csv += `${expense.date},"${escape(expense.room)}","${escape(expense.category)}","${escape(expense.item)}",${expense.qty},${expense.cost.toFixed(2)},${total.toFixed(2)},"${escape(expense.mode_of_payment)}"\n`;
  });

  // Calculate totals
  const grandTotal = filteredExpenses.reduce((sum, e) => sum + (e.cost * e.qty), 0);
  csv += `\nGrand Total,,,,,₹${grandTotal.toFixed(2)}\n`;

  // Download file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();

  showNotification('Expenses exported successfully!', 'success');
}

// Utility: Format date
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

// Utility: Escape HTML
function escape(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Show notification
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 6px;
    background: ${type === 'success' ? '#4caf50' : '#ff5252'};
    color: white;
    font-weight: 600;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideInRight 0.3s;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);