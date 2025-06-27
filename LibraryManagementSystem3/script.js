const user = {
  username: 'User123',
  email: 'user@example.com',
  phone: '+1 234 567 8901',
  borrowedBooks: []
};

let books = [
  { id: 1, name: "The Great Gatsby", issueDate: "2025-01-10", submitDate: "2025-02-10" },
  { id: 2, name: "1984", issueDate: "2025-01-15", submitDate: "2025-02-15" },
  { id: 3, name: "To Kill a Mockingbird", issueDate: "2025-01-20", submitDate: "2025-02-20" },
  { id: 4, name: "Pride and Prejudice", issueDate: "2025-01-25", submitDate: "2025-02-25" },
  // { id: 5, name: "xyz", issueDate: "2025-06-11", submitDate: "2025-07-11" },
  // { id: 6, name: "Java", issueDate: "2025-06-11", submitDate: "2025-07-11" },
  // { id: 7, name: "RanitGhosh", issueDate: "2025-06-11", submitDate: "2025-07-11" }
];

const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const appUI = document.getElementById('appUI');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const navButtons = document.querySelectorAll('nav button[data-tab-target], .tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const logoutBtn = document.getElementById('logoutBtn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');

const borrowModal = document.getElementById('borrowModal');
const borrowModalClose = document.getElementById('borrowModalClose');
const borrowModalTitle = document.getElementById('borrowModalTitle');
const borrowForm = document.getElementById('borrowForm');
const bookNameInput = document.getElementById('bookNameInput');
const issueDateInput = document.getElementById('issueDateInput');
const submitDateInput = document.getElementById('submitDateInput');

const userProfileName = document.getElementById('userProfileName');
const userProfileEmail = document.getElementById('userProfileEmail');
const userProfilePhone = document.getElementById('userProfilePhone');
const userBooksCount = document.getElementById('userBooksCount');

const adminAddBookForm = document.getElementById('adminAddBookForm');
const adminBookNameInput = document.getElementById('adminBookName');
const adminIssueDateInput = document.getElementById('adminIssueDate');
const adminSubmitDateInput = document.getElementById('adminSubmitDate');
const adminBooksList = document.getElementById('adminBooksList');

let currentUser = null;
let editingBookId = null;

function createBookCard(book) {
  const isBorrowed = user.borrowedBooks.some(b => b.id === book.id);
  const card = document.createElement('div');
  card.className = 'card flex flex-col justify-between';
  card.innerHTML = `
    <div>
      <h3 class="text-lg font-semibold text-gray-800">${book.name}</h3>
      <p class="text-gray-600 text-sm mt-1">Issue Date: ${book.issueDate}</p>
      <p class="text-gray-600 text-sm">Submit Date: ${book.submitDate}</p>
    </div>
    <div class="mt-4">
      ${isBorrowed ? 
        '<button disabled class="w-full bg-gray-300 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed">Borrowed</button>' :
        `<button class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 borrow-btn" data-id="${book.id}">Borrow</button>`
      }
    </div>
  `;
  return card;
}

function renderBooks(filter = '') {
  booksContainer.innerHTML = '';
  const filteredBooks = books.filter(book => book.name.toLowerCase().includes(filter.toLowerCase()));
  if (filteredBooks.length === 0) {
    booksContainer.innerHTML = '<p class="text-gray-600 col-span-full">No books found.</p>';
    return;
  }
  filteredBooks.forEach(book => {
    const card = createBookCard(book);
    booksContainer.appendChild(card);
  });
  const borrowButtons = booksContainer.querySelectorAll('.borrow-btn');
  borrowButtons.forEach(btn => btn.addEventListener('click', handleBorrowClick));
}

function handleBorrowClick(e) {
  const bookId = parseInt(e.target.dataset.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  bookNameInput.value = book.name;
  issueDateInput.valueAsDate = new Date();
  submitDateInput.valueAsDate = new Date(new Date().setDate(new Date().getDate() + 14));
  borrowModalTitle.textContent = `Borrow "${book.name}"`;
  borrowModal.classList.remove('opacity-0', 'pointer-events-none');
  borrowModal.classList.add('opacity-100');
  editingBookId = bookId;
}

function closeBorrowModal() {
  borrowModal.classList.add('opacity-0', 'pointer-events-none');
  borrowModal.classList.remove('opacity-100');
  borrowForm.reset();
  editingBookId = null;
}

borrowForm.addEventListener('submit', function(ev) {
  ev.preventDefault();
  if (editingBookId === null) return;
  const book = books.find(b => b.id === editingBookId);
  if (!book) return;
  user.borrowedBooks.push({
    id: book.id,
    name: book.name,
    issueDate: issueDateInput.value,
    submitDate: submitDateInput.value
  });
  updateProfileUI();
  renderBooks(searchInput.value);
  closeBorrowModal();
  alert(`You have borrowed "${book.name}"`);
});

borrowModalClose.addEventListener('click', closeBorrowModal);
borrowModal.addEventListener('click', ev => { if (ev.target === borrowModal) closeBorrowModal(); });

function updateProfileUI() {
  userProfileName.textContent = user.username;
  userProfileEmail.textContent = user.email;
  userProfilePhone.textContent = user.phone;
  userBooksCount.textContent = user.borrowedBooks.length;
}

navButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const target = btn.dataset.tabTarget || btn.dataset.tab;
    if (!target) return;
    showTab(target);
    navButtons.forEach(b => b.classList.remove('nav-link-active'));
    navButtons.forEach(b => {
      if ((b.dataset.tabTarget === target) || (b.dataset.tab === target)) {
        b.classList.add('nav-link-active');
      }
    });
    if (mobileMenu.classList.contains('block')) {
      mobileMenu.classList.remove('block');
      mobileMenu.classList.add('hidden');
    }
  });
});

function showTab(tabName) {
  tabPanels.forEach(panel => {
    if (panel.id === 'tab' + capitalize(tabName)) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  });
}
function capitalize(s) {return s.charAt(0).toUpperCase() + s.slice(1);}

searchInput.addEventListener('input', () => {
  renderBooks(searchInput.value);
});

function renderAdminBooks() {
  adminBooksList.innerHTML = '';
  if (books.length === 0) {
    adminBooksList.innerHTML = '<p class="text-gray-600">No books in catalog.</p>';
    return;
  }
  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between bg-white p-4 rounded-lg shadow-soft';
    div.innerHTML = `
      <div>
        <p class="font-semibold text-gray-800">${book.name}</p>
        <p class="text-sm text-gray-600">Issue Date: ${book.issueDate} | Submit Date: ${book.submitDate}</p>
      </div>
      <button class="text-red-600 font-semibold hover:text-red-800 admin-delete-btn" data-id="${book.id}" aria-label="Delete book ${book.name}">
        &times;
      </button>
    `;
    adminBooksList.appendChild(div);
  });
  const delBtns = adminBooksList.querySelectorAll('.admin-delete-btn');
  delBtns.forEach(btn => btn.addEventListener('click', handleAdminDelete));
}

function handleAdminDelete(ev) {
  const idToDelete = parseInt(ev.target.dataset.id);
  books = books.filter(b => b.id !== idToDelete);
  user.borrowedBooks = user.borrowedBooks.filter(b => b.id !== idToDelete);
  renderAdminBooks();
  renderBooks(searchInput.value);
  updateProfileUI();
}

adminAddBookForm.addEventListener('submit', ev => {
  ev.preventDefault();
  const name = adminBookNameInput.value.trim();
  const issueDate = adminIssueDateInput.value;
  const submitDate = adminSubmitDateInput.value;
  if (!name || !issueDate || !submitDate) {
    alert('Please fill all fields');
    return;
  }
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    name,
    issueDate,
    submitDate
  };
  books.push(newBook);
  renderAdminBooks();
  renderBooks(searchInput.value);
  adminAddBookForm.reset();
  alert(`Book "${name}" added to catalog.`);
});

loginForm.addEventListener('submit', ev => {
  ev.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) {
    alert('Please enter username and password');
    return;
  }
  currentUser = { username, email: username + '@example.com', phone: '+1 234 567 8901' };
  user.username = currentUser.username;
  user.email = currentUser.email;
  user.phone = currentUser.phone;
  showAppUI();
});

registerForm.addEventListener('submit', ev => {
  ev.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  if (!username || !email || !password) {
    alert('Please fill all fields');
    return;
  }
  if (!email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }
  currentUser = { username, email, phone: '+1 234 567 8901' };
  user.username = username;
  user.email = email;
  user.phone = currentUser.phone;
  showAppUI();
});

showRegisterBtn.addEventListener('click', () => {
  loginSection.classList.add('hidden');
  registerSection.classList.remove('hidden');
});
showLoginBtn.addEventListener('click', () => {
  registerSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
});

function showAppUI() {
  loginSection.classList.add('hidden');
  registerSection.classList.add('hidden');
  appUI.classList.remove('hidden');
  showTab('dashboard');
  updateProfileUI();
  renderBooks();
  renderAdminBooks();
}

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  user.borrowedBooks.length = 0;
  registerSection.classList.add('hidden');
  appUI.classList.add('hidden');
  loginSection.classList.remove('hidden');
  loginForm.reset();
  registerForm.reset();
});

mobileMenuToggle.addEventListener('click', () => {
  if (mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('block');
  } else {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('block');
  }
});

window.addEventListener('load', () => {
  document.getElementById('username').focus();
});

renderBooks();
renderAdminBooks();
