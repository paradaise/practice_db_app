// Global variables
let currentTab = 'clients';
let clients = [];
let accounts = [];
let transactions = [];
let cashiers = [];

// API base URL
const API_BASE = '/api';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadAllData();
    initializeForms();
    initializeModalButtons();
    initializeReceiptButtons();
    initializeReceiptPrintButton();
});

// Tab management
function initializeTabs() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;
}

// Data loading
async function loadAllData() {
    showLoading();
    
    try {
        await Promise.all([
            loadClients(),
            loadAccounts(),
            loadTransactions(),
            loadCashiers()
        ]);
        
        updateAllTables();
        populateSelects();
    } catch (error) {
        showMessage('Ошибка загрузки данных: ' + error.message, 'error');
    }
    
    hideLoading();
}

async function loadClients() {
    const response = await fetch(`${API_BASE}/clients`);
    if (!response.ok) throw new Error('Ошибка загрузки клиентов');
    clients = await response.json();
}

async function loadAccounts() {
    const response = await fetch(`${API_BASE}/accounts`);
    if (!response.ok) throw new Error('Ошибка загрузки счетов');
    accounts = await response.json();
}

async function loadTransactions() {
    const response = await fetch(`${API_BASE}/transactions`);
    if (!response.ok) throw new Error('Ошибка загрузки транзакций');
    transactions = await response.json();
}

async function loadCashiers() {
    const response = await fetch(`${API_BASE}/cashiers`);
    if (!response.ok) throw new Error('Ошибка загрузки кассиров');
    cashiers = await response.json();
}

// Table updates
function updateAllTables() {
    updateClientsTable();
    updateAccountsTable();
    updateTransactionsTable();
    updateCashiersTable();
}

function updateClientsTable() {
    const tbody = document.querySelector('#clientsTable tbody');
    tbody.innerHTML = '';
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client._id}</td>
            <td>${client.firstName}</td>
            <td>${client.lastName}</td>
            <td>${client.passportSeries} ${client.passportNumber}</td>
            <td>${client.tin || '-'}</td>
            <td><span class="status-badge ${client.type === 'individual' ? 'status-active' : 'status-frozen'}">${client.type === 'individual' ? 'Физ. лицо' : 'Юр. лицо'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editClient('${client._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteClient('${client._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateAccountsTable() {
    const tbody = document.querySelector('#accountsTable tbody');
    tbody.innerHTML = '';
    accounts.forEach(account => {
        const client = account.clientId && typeof account.clientId === 'object' ? account.clientId : null;
        const clientName = client ? `${client.firstName} ${client.lastName}` : '-';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${account.accountNumber}</td>
            <td>${clientName}</td>
            <td>${account.currency}</td>
            <td class="currency ${account.balance >= 0 ? 'positive' : 'negative'}">${formatCurrency(account.balance, account.currency)}</td>
            <td><span class="status-badge status-${account.status}">${getStatusText(account.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editAccount('${account._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteAccount('${account._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTransactionsTable() {
    const tbody = document.querySelector('#transactionsTable tbody');
    tbody.innerHTML = '';
    transactions.forEach(transaction => {
        const fromAccount = transaction.fromAccount;
        const toAccount = transaction.toAccount;
        const cashier = transaction.cashierId;
        const fromClient = fromAccount && fromAccount.clientId && typeof fromAccount.clientId === 'object'
            ? `${fromAccount.clientId.firstName} ${fromAccount.clientId.lastName}` : '-';
        const toClient = toAccount && toAccount.clientId && typeof toAccount.clientId === 'object'
            ? `${toAccount.clientId.firstName} ${toAccount.clientId.lastName}` : '-';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="type-badge type-${transaction.type}">${getTransactionTypeText(transaction.type)}</span></td>
            <td class="currency">${formatCurrency(transaction.amount, transaction.currency)}</td>
            <td>${transaction.currency}</td>
            <td>${fromAccount ? `${fromAccount.accountNumber} <br><small>${fromClient}</small>` : '-'}</td>
            <td>${toAccount ? `${toAccount.accountNumber} <br><small>${toClient}</small>` : '-'}</td>
            <td>${cashier ? `${cashier.firstName} ${cashier.lastName}` : '-'}</td>
            <td>${formatDate(transaction.executedAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-success" data-receipt-id="${transaction._id}">
                        <i class="fas fa-receipt"></i> Чек
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateCashiersTable() {
    const tbody = document.querySelector('#cashiersTable tbody');
    tbody.innerHTML = '';
    cashiers.forEach(cashier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cashier.firstName}</td>
            <td>${cashier.lastName}</td>
            <td>${cashier.position}</td>
            <td>${cashier.branch}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editCashier('${cashier._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteCashier('${cashier._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Form initialization
function initializeForms() {
    // Client form
    document.getElementById('clientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createClient();
    });

    // Account form
    document.getElementById('accountForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createAccount();
    });

    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createTransaction();
    });

    // Cashier form
    document.getElementById('cashierForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createCashier();
    });
}

// Populate select dropdowns
function populateSelects() {
    populateClientSelects();
    populateAccountSelects();
    populateCashierSelects();
}

function populateClientSelects() {
    const selects = document.querySelectorAll('select[name="clientId"]');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Выберите клиента</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client._id;
            option.textContent = `${client.firstName} ${client.lastName}`;
            select.appendChild(option);
        });
    });
}

function populateAccountSelects() {
    const fromSelect = document.querySelector('select[name="fromAccount"]');
    const toSelect = document.querySelector('select[name="toAccount"]');
    [fromSelect, toSelect].forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Выберите счет</option>';
            accounts.filter(acc => acc.status === 'active').forEach(account => {
                let client = account.clientId;
                if (client && typeof client === 'object') {
                    client = client.firstName ? `${client.firstName} ${client.lastName}` : 'Неизвестно';
                } else {
                    client = 'Неизвестно';
                }
                const option = document.createElement('option');
                option.value = account._id;
                option.textContent = `${account.accountNumber} (${client}) - ${account.currency}`;
                select.appendChild(option);
            });
        }
    });
}

function populateCashierSelects() {
    const selects = document.querySelectorAll('select[name="cashierId"]');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Выберите кассира</option>';
        cashiers.forEach(cashier => {
            const option = document.createElement('option');
            option.value = cashier._id;
            option.textContent = `${cashier.firstName} ${cashier.lastName}`;
            select.appendChild(option);
        });
    });
}

// CRUD operations
async function createClient() {
    const form = document.getElementById('clientForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_BASE}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Ошибка создания клиента');
        
        await loadClients();
        updateClientsTable();
        populateClientSelects();
        closeModal('clientModal');
        form.reset();
        showMessage('Клиент успешно создан', 'success');
    } catch (error) {
        showMessage('Ошибка: ' + error.message, 'error');
    }
}

async function createAccount() {
    const form = document.getElementById('accountForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.balance = parseFloat(data.balance);

    try {
        const response = await fetch(`${API_BASE}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Ошибка создания счета');
        
        await loadAccounts();
        updateAccountsTable();
        populateAccountSelects();
        closeModal('accountModal');
        form.reset();
        showMessage('Счет успешно создан', 'success');
    } catch (error) {
        showMessage('Ошибка: ' + error.message, 'error');
    }
}

async function createTransaction() {
    const form = document.getElementById('transactionForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.amount = parseFloat(data.amount);
    if (data.type === 'deposit') {
        data.fromAccount = null;
    } else if (data.type === 'withdrawal') {
        data.toAccount = null;
    }
    try {
        const response = await fetch(`${API_BASE}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка создания транзакции');
        }
        const transaction = await response.json();
        await loadTransactions();
        await loadAccounts();
        updateTransactionsTable();
        updateAccountsTable();
        closeModal('transactionModal');
        form.reset();
        // Show receipt
        showReceipt(transaction._id);
        // Получаем кассира для сообщения
        const cashier = cashiers.find(c => c._id === (transaction.cashierId?._id || transaction.cashierId));
        const typeText = getTransactionTypeText(transaction.type);
        showMessage(
            `Транзакция успешно выполнена: <b>${typeText}</b> — <b>${formatCurrency(transaction.amount, transaction.currency)}</b> (${transaction.currency})<br>Кассир: <b>${cashier ? cashier.firstName + ' ' + cashier.lastName : '-'}</b>`,
            'success'
        );
    } catch (error) {
        showMessage('Ошибка: ' + error.message, 'error');
    }
}

async function createCashier() {
    const form = document.getElementById('cashierForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_BASE}/cashiers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Ошибка создания кассира');
        
        await loadCashiers();
        updateCashiersTable();
        populateCashierSelects();
        closeModal('cashierModal');
        form.reset();
        showMessage('Кассир успешно создан', 'success');
    } catch (error) {
        showMessage('Ошибка: ' + error.message, 'error');
    }
}

// Receipt functionality
async function showReceipt(transactionId) {
    const transaction = transactions.find(t => t._id === transactionId);
    if (!transaction) return;
    const fromAccount = transaction.fromAccount;
    const toAccount = transaction.toAccount;
    const cashier = transaction.cashierId;
    const fromClient = fromAccount && fromAccount.clientId && typeof fromAccount.clientId === 'object'
        ? `${fromAccount.clientId.firstName} ${fromAccount.clientId.lastName}` : '-';
    const toClient = toAccount && toAccount.clientId && typeof toAccount.clientId === 'object'
        ? `${toAccount.clientId.firstName} ${toAccount.clientId.lastName}` : '-';
    const receiptContent = document.getElementById('receiptContent');
    receiptContent.innerHTML = `
        <div class="receipt-title">
            <i class="fas fa-university"></i> Банковская операция
        </div>
        <div class="receipt-datetime">
            ${formatDate(transaction.executedAt)}
        </div>
        <div class="receipt-item">
            <span>Тип операции:</span>
            <span>${getTransactionTypeText(transaction.type)}</span>
        </div>
        <div class="receipt-item">
            <span>Сумма:</span>
            <span class="currency">${formatCurrency(transaction.amount, transaction.currency)}</span>
        </div>
        <div class="receipt-item">
            <span>Валюта:</span>
            <span>${transaction.currency}</span>
        </div>
        ${transaction.type !== 'deposit' ? `
        <div class="receipt-item">
            <span>Счет списания:</span>
            <span>${fromAccount ? fromAccount.accountNumber : '-'}</span>
        </div>
        <div class="receipt-item">
            <span>Клиент списания:</span>
            <span>${fromClient}</span>
        </div>
        ` : ''}
        ${transaction.type !== 'withdrawal' ? `
        <div class="receipt-item">
            <span>Счет зачисления:</span>
            <span>${toAccount ? toAccount.accountNumber : '-'}</span>
        </div>
        <div class="receipt-item">
            <span>Клиент зачисления:</span>
            <span>${toClient}</span>
        </div>
        ` : ''}
        <div class="receipt-item">
            <span>Кассир:</span>
            <span>${cashier ? cashier.firstName + ' ' + cashier.lastName : '-'}</span>
        </div>
        ${transaction.comment ? `
        <div class="receipt-item">
            <span>Комментарий:</span>
            <span>${transaction.comment}</span>
        </div>
        ` : ''}
        <div class="receipt-item">
            <span>Номер операции:</span>
            <span>${transaction._id}</span>
        </div>
    `;
    showModal('receiptModal');
}

function printReceipt() {
    const receiptContent = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Чек операции</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .receipt-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .receipt-title { text-align: center; font-size: 1.5em; font-weight: bold; margin-bottom: 20px; }
                    .receipt-datetime { text-align: center; color: #666; margin-bottom: 20px; }
                    .currency { font-family: monospace; font-weight: bold; }
                </style>
            </head>
            <body>
                ${receiptContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Transaction form helpers
function toggleTransactionFields() {
    const type = document.querySelector('select[name="type"]').value;
    const fromAccountGroup = document.getElementById('fromAccountGroup');
    const fromAccountSelect = document.querySelector('select[name="fromAccount"]');
    const toAccountSelect = document.querySelector('select[name="toAccount"]');

    if (type === 'deposit') {
        fromAccountGroup.style.display = 'none';
        fromAccountSelect.removeAttribute('required');
        toAccountSelect.setAttribute('required', 'required');
    } else if (type === 'withdrawal') {
        fromAccountGroup.style.display = 'block';
        fromAccountSelect.setAttribute('required', 'required');
        toAccountSelect.removeAttribute('required');
        toAccountSelect.style.display = 'none';
    } else if (type === 'transfer') {
        fromAccountGroup.style.display = 'block';
        fromAccountSelect.setAttribute('required', 'required');
        toAccountSelect.setAttribute('required', 'required');
        toAccountSelect.style.display = 'block';
    }
}

// Modal management
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Utility functions
function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString('ru-RU');
}

function getStatusText(status) {
    const statusMap = {
        'active': 'Активен',
        'closed': 'Закрыт',
        'frozen': 'Заморожен'
    };
    return statusMap[status] || status;
}

function getTransactionTypeText(type) {
    const typeMap = {
        'deposit': 'Пополнение',
        'withdrawal': 'Снятие',
        'transfer': 'Перевод'
    };
    return typeMap[type] || type;
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    if (/[<>]/.test(message)) {
        messageDiv.innerHTML = message;
    } else {
        messageDiv.textContent = message;
    }
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<i class="fas fa-spinner"></i> Загрузка данных...';
    loadingDiv.id = 'loading';
    
    const container = document.querySelector('.container');
    container.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}


// Делегирование событий для кнопок открытия модалок
function initializeModalButtons() {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-modal]');
        if (btn) {
            const modalId = btn.getAttribute('data-modal');
            showModal(modalId);
        }
    });
}

// Делегирование событий для кнопок "Чек" в таблице транзакций
function initializeReceiptButtons() {
    document.getElementById('transactionsTable').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-success[data-receipt-id]');
        if (btn) {
            const id = btn.getAttribute('data-receipt-id');
            showReceipt(id);
        }
    });
}

// Делегирование событий для кнопки печати чека
function initializeReceiptPrintButton() {
    document.getElementById('receiptModal').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-primary[data-print-receipt]');
        if (btn) {
            printReceipt();
        }
    });
}

// Экспорт для type=module (если потребуется)
window.showModal = showModal;
window.closeModal = closeModal;
window.toggleTransactionFields = toggleTransactionFields;
window.printReceipt = printReceipt;

function deleteClient(id) {
    showMessage('Функция удаления клиента находится в разработке', 'error');
}
function deleteAccount(id) {
    showMessage('Функция удаления счета находится в разработке', 'error');
}
function deleteCashier(id) {
    showMessage('Функция удаления кассира находится в разработке', 'error');
}
function editClient(id) {
    showMessage('Функция редактирования клиента находится в разработке', 'error');
}
function editAccount(id) {
    showMessage('Функция редактирования счета находится в разработке', 'error');
}
function editCashier(id) {
    showMessage('Функция редактирования кассира находится в разработке', 'error');
} 