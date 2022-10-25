const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    toastFunction("Successfully added a book");
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// function add Book
function addBook() {
  const title = document.getElementById("inputBookTitle").value.trim();
  const author = document.getElementById("inputBookAuthor").value.trim();
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isComplete);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function generate Id with date
function generateId() {
  return +new Date();
}

// function generate book object
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// function make book element
function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.year;

  const switchReadingStatusButton = document.createElement("button");
  switchReadingStatusButton.classList.add("green");

  const deleteBookButton = document.createElement("button");
  deleteBookButton.classList.add("red");
  deleteBookButton.innerText = "Delete Book";

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");
  buttonContainer.append(switchReadingStatusButton, deleteBookButton);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, buttonContainer);

  deleteBookButton.addEventListener("click", function () {
      removeBookFromList(bookObject.id);
      toastFunction("The book has been deleted");
  });

  if (bookObject.isComplete) {
    switchReadingStatusButton.innerText = "Not Finished Reading";
    switchReadingStatusButton.addEventListener("click", function () {
      switchReadingStatusToUnCompleted(bookObject.id);
      toastFunction("Successfully changed read status to unfinished");
    });
  } else {
    switchReadingStatusButton.innerText = "Finished Reading";
    switchReadingStatusButton.addEventListener("click", function () {
      switchReadingStatusToCompleted(bookObject.id);
      toastFunction("Successfully changed read status to finished");
    });
  }

  return container;
}

// function switch reading status to completed
function switchReadingStatusToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function find book
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// function remove book
function removeBookFromList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function switch reading status to uncompleted
function switchReadingStatusToUnCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function to find book index
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const SAVED_EVENT = "seved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
// function save data
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// function cek storage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your current browser doesn't support local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// function load data from storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Toast
function toastFunction(message) {
  // Get the snackbar DIV
  const myToast = document.getElementById("snackbar");

  // Add the "show" class to DIV
  myToast.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    myToast.className = myToast.className.replace("show", "");
  }, 3000);

  myToast.innerText = message;
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});
