
const renderLibri = document.getElementById('render')
const submitButton = document.getElementById('submit')
const inputDiv = document.getElementById('inputDiv')
const inputs = inputDiv.querySelectorAll('.input')
const renderDiv = document.querySelector('#render')

let myLibrary = JSON.parse(localStorage.getItem('libri')) || [{"title":"html for dummies","author":"jeff noble","pages":416,"readItYet":false,
 "pictureLink":"http://books.google.com/books/content?id=EGp9DgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
 "link":"http://books.google.it/books?id=EGp9DgAAQBAJ&printsec=frontcover&dq=intitle:html+for+dummies+inauthor:jeff+noble&hl=&cd=1&source=gbs_api",
 "descrizione":"What the book covers: the key features of HTML including getting to know (X)HTML and CSS, creating and viewing a Web page, planning your site, creating (X)HTML document structure, working with text and lists, creating and customizing links, finding and using images, using cascading style sheets (CSS), getting creative with colors and fonts, integrating scripts with (X)HTML, understanding deprecated HTML markup tags, working with content management systems (WordPress, Drupal, and Joomla), designing for mobile devices (iPhone, BlackBerry, and Android), getting started with HTML5 and CSS3, and much more. Updated coverage: the seventh edition will have approximately 50% new content and will be thoroughly revised to cover the latest concepts, tools, and trends in the industry. Series features: Information presented in the straightforward but fun language that has defined the Dummies series for more than nineteen years.",
 "rating":"N/A"}];



function Book(title,author,pages,readItYet,pictureLink,link,descrizione,rating) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readItYet = readItYet;
    this.pictureLink = pictureLink;
    this.link = link;
    this.descrizione = descrizione;
    this.rating = rating;

}



async function addBookToLibrary(event) {    
    event.preventDefault()   
   
    const title = inputs[0].value   
    const author = inputs[1].value    
    const readItYet = inputs[3].checked
    let descrizione = ''
    let pages = parseInt(inputs[2].value)  || ''
    let rating = ''
    let pictureLink = ''
    let link = ''    
        
    await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title.replace(/ /g,'+')}+inauthor:${author.replace(/ /g,'+')}&maxResults=1&orderBy=relevance`)
     .then(res => res.json())
     .then(data => {
         if(!data.totalItems) return;
         
         descrizione = data.items[0].volumeInfo.description         
         if (pages === '') pages = data.items[0].volumeInfo.pageCount;         
         rating = data.items[0].volumeInfo.averageRating        
         pictureLink = data.items[0].volumeInfo.imageLinks.thumbnail         
         link = data.items[0].volumeInfo.previewLink
         
         })

         
    if(descrizione === ''|| !descrizione) descrizione = 'N/A'
    if(pages === ''|| !pages) pages = 'N/A'
    if(rating === ''|| !rating) rating = 'N/A'
    if(pictureLink === ''|| !pictureLink) pictureLink = 'Na.jpg'    

    const libro = new Book(title,author,pages,readItYet,pictureLink,link,descrizione,rating)
    myLibrary.push(libro)
    render(myLibrary)
    this.reset()       

}



function eraseBook(event) {
    if(event.target.id === 'delete') {        
        const idIndex = parseInt(event.target.parentNode.dataset.index) 
        myLibrary.splice(idIndex,1)
        render(myLibrary)  

    }   

    
}

function checkBook(event) {
    
    if(event.target.className === 'check') {
        console.dir(event.target.dataset.index)
        const index = event.target.dataset.index
        myLibrary[index].readItYet = !myLibrary[index].readItYet
        render(myLibrary)

    }
}




function render(myLibrary) {
    let index = 0
    renderLibri.textContent = ''    
    myLibrary.forEach(libro => {        
        const div = document.createElement('div')
        div.classList.add('divEach')
        div.dataset.index = index
        
        div.innerHTML = `
            <div><a href="${libro.link}"><img 
            src="${libro.pictureLink}" alt="${libro.title}" srcset="">
            </a></div>
            <div class='informazioni'>
            <p>Title: ${libro.title}</p>
            <p>Author: ${libro.author}</p>
            <p>Pages: ${libro.pages}</p>
            <p>Rating: ${libro.rating === 'N/A' ? 'N/A' : libro.rating + '/5'}</p>
            <p>Have you read it yet? <span data-index='${index}' class='check'>${libro.readItYet ? '✔' : '✘'}</span></p>
            <p>Description:</p>
            <p class='descrizione'>${libro.descrizione}</p>
            </div>
            <button id='delete' dataset-index=${index}>Delete</button>
            `        
        renderLibri.appendChild(div)        
        index++        
    });
    localStorage.setItem('libri',JSON.stringify(myLibrary))   

}



submitButton.addEventListener('submit',addBookToLibrary)
renderDiv.addEventListener('click',eraseBook)
renderDiv.addEventListener('click',checkBook)



render(myLibrary)



