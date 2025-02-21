
let books = [];
let total_records = 0;
let records_per_page = 5;
let pageno = 1;
let total_page = 0;
let records_size = document.getElementById('records_size')

let sortField = 'price';
let sortOrder = 'asc';


async function booksDataFetching() {
    try {
        let res = await fetch("https://raw.githubusercontent.com/chakshuujawa/json-hosting/refs/heads/main/books-v2.json")
        let finalData = await res.json();
        books = finalData
        books.forEach(book => {
            book.coverImage = "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        })
        // console.log(books.length);
        total_records = books.length;
        // console.log(total_records);
        // console.log(books);
        // addBooksData()

        total_page = Math.ceil(total_records / records_per_page)

        generatePage()
        pagination()

        // addBooksData()
    }
    catch (err) {
        console.log("error fetching books data :", err);
    }

}

booksDataFetching()

let table = document.querySelector('#table-all-books tbody');
let similarBooksTable = document.querySelector('#table-similar-books tbody');


document.getElementById('btn-search').addEventListener('click', (event) => {
    event.preventDefault();
    searchBooks();
});


// fuzzy search
function searchBooks() {
    try {
        let bookId = document.getElementById('input-search-id').value.trim();
        let genre = document.getElementById('input-search-genre').value.trim().toLowerCase();
        let priceMin = document.getElementById('input-search-price-min').value.trim();
        let priceMax = document.getElementById('input-search-price-max').value.trim();
        let author = document.getElementById('input-search-author').value.trim().toLowerCase();
        let publicationYear = document.getElementById('input-search-year').value.trim();

        let filteredBooks = books.filter(book => {
            return (
                (bookId === "" || book.bookId.toString().includes(bookId)) &&
                (genre === "" || book.genre.toLowerCase().includes(genre)) &&
                (priceMin === "" || book.price >= parseFloat(priceMin)) &&
                (priceMax === "" || book.price <= parseFloat(priceMax)) &&
                (author === "" || book.author.toLowerCase().includes(author)) &&
                (publicationYear === "" || book.publicationYear.toString() === publicationYear)
            );
        });

        displaySimilarBooks(filteredBooks);
    }
    catch (err) {
        console.log("error in searchBooks function", err);
    }
}

function displaySimilarBooks(books) {
    similarBooksTable.innerHTML = "";
    books.forEach(book => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <th>${book.bookId}</th>
            <th>${book.genre}</th>
            <th>${book.price}</th>
            <th>${book.author}</th>
            <th>${book.publicationYear}</th>
            <th><img data-src="${book.coverImage}" class="lazy-load" style="width:100px;height:100px;object-fit:cover; cursor:pointer;filter:blur(5px); transition: filter 0.5s ease-in-out;"></th>
        `;
        row.style = "cursor:pointer";
        row.addEventListener('click', () => showBookDetails(book));
        similarBooksTable.appendChild(row);
    });
    // setTimeout(lazyLoadImages,200)
    lazyLoadImages()
}



// Dark/Light Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");

    }

    let toggleButton = document.createElement("button");
    toggleButton.innerText = "Toggle Dark Mode";
    toggleButton.classList.add("btn", "btn-secondary");
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "10px";
    toggleButton.onclick = toggleDarkMode;
    document.body.appendChild(toggleButton);

    let sortControls = document.createElement("div");
    sortControls.innerHTML = `<br>
        <label>Sort by Price:</label>
        <button class="btn btn-sm btn-info" onclick="sortBooks('price', 'asc')">Asc⬇️</button>
        <button class="btn btn-sm btn-info" onclick="sortBooks('price', 'desc')">Desc⬆️</button>
        <label>Sort by Year:</label>
        <button class="btn btn-sm btn-info" onclick="sortBooks('publicationYear', 'asc')">Asc⬇️</button>
        <button class="btn btn-sm btn-info" onclick="sortBooks('publicationYear', 'desc')">Desc⬆️</button>
    `;
    document.getElementById("records_size").parentElement.appendChild(sortControls);

});

const style = document.createElement('style');
style.innerHTML = `
    .dark-mode {
        background-color:rgb(18, 18, 18);
        color: white;
    }
    .dark-mode table, .dark-mode th, .dark-mode td {
        border-color: white;
    }
    .dark-mode .btn-secondary {
        background-color: rgb(51, 51, 51);
        color: white;
        border-color: rgb(68, 68, 68);
    }
    .dark-mode input, .dark-mode select, .dark-mode textarea {
        background-color: rgb(51, 51, 51);
        color: white;
        border: 1px solid rgb(68, 68, 68);
    }
    .dark-mode input::placeholder, .dark-mode textarea::placeholder {
        color: rgba(241, 228, 228, 0.6);
    }
    
    .dark-mode .list-group-item {
        background-color: rgb(51, 51, 51);
        color: white;
        border: 1px solid rgb(68, 68, 68);
    }

    .dark-mode input:focus {
        background-color: rgb(51, 51, 51);
        color:white
    }
`;
document.head.appendChild(style);



function showBookDetails(book) {
    // console.log(book);
    document.getElementById('book-id').innerHTML = `<b>${book.bookId}</b>`;
    document.getElementById('book-price').innerHTML = `<b>${book.price}</b>`;
    document.getElementById('book-genre').innerHTML = `<b>${book.genre}</b>`;
    document.getElementById('book-author').innerHTML = `<b>${book.author}</b>`;
    document.getElementById('book-year').innerHTML = `<b>${book.publicationYear}</b>`;
}




function sortBooks(field, order) {
    try {
        sortField = field;
        sortOrder = order;
        books.sort((a, b) => (sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField]));
        pageno = 1;
        // generatePage();
        pagination();
    }
    catch (err) {
        console.log("error sorting books:", err);
    }
}


// pagination()
function pagination() {
    let startInd = (pageno - 1) * records_per_page;
    let endInd = startInd + (records_per_page);

    //    let statement='';
    //    for(let i=startInd;i<+endInd;i++){
    //     statement+=`<tr>${books.innerHTML}</tr>`
    //     console.log(statement);
    //    }

    let paginatedBooks = books.slice(startInd, endInd)
    // console.log(paginatedBooks);
    // addBooksData(paginatedBooks)

    table.innerHTML = "";
    paginatedBooks.forEach((ele) => {
        // console.log(ele);//obj
        let row = document.createElement('tr')
        row.innerHTML =
            `
            <th>${ele.bookId}</th>
            <th>${ele.genre}</th>
            <th>${ele.price}</th>
            <th>${ele.author}</th>
            <th>${ele.publicationYear}</th>
            <th>

                <img data-src="${ele.coverImage}" class="lazy-load" style="width:100px;height:100px;object-fit:cover; cursor:pointer;filter:blur(5px); transition: filter 0.5s ease-in-out;" >
            </th>

        `
        // console.log(row);
        table.appendChild(row)

        row.style = `cursor:pointer`;
        row.addEventListener('click', () => showBookDetails(ele))

        document.querySelectorAll('.dynamic-item').forEach(item => {
            item.classList.remove('active')
        })

        document.getElementById(`page${pageno}`).classList.add('active')


        if (pageno == 1) {
            document.getElementById('prevBtnID').parentElement.classList.add('disabled')
        } else {
            document.getElementById('prevBtnID').parentElement.classList.remove('disabled')
        }

        if (pageno == total_page) {
            document.getElementById('nextBtnID').parentElement.classList.add('disabled')
        } else {
            document.getElementById('nextBtnID').parentElement.classList.remove('disabled')
        }


        document.getElementById('page-details').innerHTML = `showing ${startInd + 1} to ${endInd} of ${total_records}`

    })

    // setTimeout(lazyLoadImages, 500);
    lazyLoadImages()

}

// lazy loading
function lazyLoadImages() {
    try {
        const images = document.querySelectorAll("img.lazy-load");

        if (!images.length) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy-load");
                    img.style.filter = "none";
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: "50px" });

        images.forEach(img => observer.observe(img));
    }
    catch (err) {
        console.log("error in lazyloading function:", err);
    }
}



// dynamic display of below btns for pages and prevbtn and nextbtn
function generatePage() {
    let prevBtn = ` <li class="page-item"><a class="page-link" id="prevBtnID" onclick="prevbtn()" href="javascript:void(0)">Previous</a></li>`

    let nextBtn = `<li class="page-item"><a class="page-link" id="nextBtnID" onclick="nextbtn()" href="javascript:void(0)">Next</a></li>`

    let buttons = '';

    let activeClass = ''
    for (let i = 1; i <= total_page; i++) {

        if (i == 1) {
            activeClass = 'active';
        }
        else {
            activeClass = ''
        }
        buttons += `<li class="page-item dynamic-item ${activeClass}" id="page${i}" ><a class="page-link" onclick="currPage(${i})" href="javascript:void(0)">${i}</a></li>
        
`
    }

    document.getElementById('pagination').innerHTML = `${prevBtn} ${buttons} ${nextBtn}`
}


function nextbtn() {
    pageno++;
    // booksDataFetching();
    pagination()
}

function prevbtn() {
    pageno--;
    // booksDataFetching();
    pagination()
}

function currPage(currPageNo) {
    pageno = parseInt(currPageNo);
    // booksDataFetching();
    pagination()
}

// custom pagination records change
records_size.addEventListener('change', (e) => {
    records_per_page = parseInt(records_size.value)
    total_page = Math.ceil(total_records / records_per_page)
    pageno = 1;
    generatePage()
    pagination()
})


