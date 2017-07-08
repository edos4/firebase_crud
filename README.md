### Implement CRUD
___

#### "C" - Сreate

1) Create simple form:

```
  <!-- index.html -->
  <h4>CREATE/UPDATE book</h4>
  <form id='bookForm'>
    <input type="hidden" id='hiddenId' />
    <input type="text" id='title' />
    <br/>
    <br/>
    <textarea id='synopsis'></textarea>
    <br/>
    <br/>
    <button type='submit'>Add/Update rewiew</button>
  </form>
```

2) Add handlers:

```
// main.js
var bookForm = document.getElementById('bookForm');
var title = document.getElementById('title');
var synopsis = document.getElementById('synopsis');
var hiddenId = document.getElementById('hiddenId');

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  var id = hiddenId.value || Date.now()

  db.ref('books/' + id).set({
    title: title.value,
    synopsis: synopsis.value
  });

  title.value = '';
  synopsis.value = '';
  hiddenId.value = '';
})
```

#### "R" - Read

1) Add container to render books.

```
  <h4>READ/DELETE books</h4>
  <ul id='books'></ul>
```

2) Add listener on firebase event 'child_added'.

```
var books = document.getElementById('books');
var booksRef = db.ref('/books');

booksRef.on('child_added', ({val, key}) => {
  var li = document.createElement('li')
  li.id = key;
  li.innerHTML = bookTemplate(val())
  books.appendChild(li);
})

function bookTemplate({title, synopsis}) {
  return `
    <div class='title'>${title}</div>
    <div class='synopsis'>${synopsis}</div>
  `
}
```

#### "U" - Update

1) Add button Edit to template.
```
function bookTemplate({title, synopsis}) {
  return `
    <div class='title'>${title}</div>
    <div class='synopsis'>${synopsis}</div>
    <button class='edit'>Edit</button>
  `
}
```

2) Add handler on button Edit:

```
books.addEventListener('click', (e) => {
  var bookNode = e.target.parentNode

  // UPDATE BOOK
  if (e.target.classList.contains('edit')) {
    title.value = bookNode.querySelector('.title').innerText;
    synopsis.value  = bookNode.querySelector('.synopsis').innerText;
    hiddenId.value = bookNode.id;
  }
})
```

3) Add listener on firebase event 'child_changed'.

```
booksRef.on('child_changed', (data) => {
  var bookNode = document.getElementById(data.key);
  bookNode.innerHTML = bookTemplate(data.val());
});
```

#### "D" - Delete

1) Add button Delete to template.
```
function bookTemplate({title, synopsis}) {
  return `
    <div class='title'>Title: ${title}</div>
    <div class='synopsis'>Synopsis: ${synopsis}</div>
    <button class='edit'>Edit</button>
    <button class='delete'>Delete</button>
  `
}
```

2) Add handler on button Delete:

```
  books.addEventListener('click', (e) => {
    var bookNode = e.target.parentNode

    // UPDATE BOOK
    //...

    // DELETE BOOK
    if (e.target.classList.contains('delete')) {
      var id = bookNode.id;
      db.ref('books/' + id).remove();
    }
  })
```

3) Add listener on firebase event 'child_removed'.

```
  booksRef.on('child_removed', (data) => {
    var bookNode = document.getElementById(data.key);
    bookNode.parentNode.removeChild(bookNode);
  });
```
