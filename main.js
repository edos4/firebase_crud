var config = {
  apiKey: "AIzaSyAaFrw0wz5KgOxd41o65t3cWlJ9u1FiopA",
  authDomain: "fir-crud-455d3.firebaseapp.com",
  databaseURL: "https://fir-crud-455d3.firebaseio.com",
  projectId: "fir-crud-455d3",
  storageBucket: "",
  messagingSenderId: "180683668626"
};

firebase.initializeApp(config);
var db = firebase.database();

// CREATE BOOK

var bookForm = document.getElementById('bookForm');
var title   = document.getElementById('title');
var synopsis    = document.getElementById('synopsis');
var hiddenId   = document.getElementById('hiddenId');

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!title.value || !synopsis.value) return null

  var id = hiddenId.value || Date.now()

  db.ref('books/' + id).set({
    title: title.value,
    synopsis: synopsis.value
  });

  title.value = '';
  synopsis.value  = '';
  hiddenId.value = '';
});

// READ BOOKS

var books = document.getElementById('books');
var booksRef = db.ref('/books');

booksRef.on('child_added', (data) => {
  var li = document.createElement('li')
  li.id = data.key;
  li.innerHTML = bookTemplate(data.val())
  books.appendChild(li);
});

booksRef.on('child_changed', (data) => {
  var bookNode = document.getElementById(data.key);
  bookNode.innerHTML = bookTemplate(data.val());
});

booksRef.on('child_removed', (data) => {
  var bookNode = document.getElementById(data.key);
  bookNode.parentNode.removeChild(bookNode);
});

books.addEventListener('click', (e) => {
  var bookNode = e.target.parentNode

  // UPDATE book
  if (e.target.classList.contains('edit')) {
    title.value = bookNode.querySelector('.title').innerText;
    synopsis.value  = bookNode.querySelector('.synopsis').innerText;
    hiddenId.value = bookNode.id;
  }

  // DELETE book
  if (e.target.classList.contains('delete')) {
    var id = bookNode.id;
    db.ref('books/' + id).remove();
  }
});

function bookTemplate({title, synopsis}) {
  return `
    <strong>Title:</strong> <div class='title'>${title}</div>
    <strong>Synopsis:</strong> <div class='synopsis'>${synopsis}</div>
    <button class='edit'>Edit</button>
    <button class='delete'>Delete</button>
  `
};
