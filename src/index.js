document.addEventListener("DOMContentLoaded",() => {
    function ce(element){
        return document.createElement(element)
    }

    function qs(selector){
        return document.querySelector(selector)
    }

    const ul = qs("ul#quote-list")
    const form = qs("#new-quote-form")

    function fetchQuotes(){
        ul.innerHTML = ""

        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then(quotes => quotes.forEach(quote => displayQuote(quote)))
    }

    function displayQuote(quote){
        // console.log(quote)
    //     <li class='quote-card'>
    //     <blockquote class="blockquote">
    //       <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    //       <footer class="blockquote-footer">Someone famous</footer>
    //       <br>
    //       <button class='btn-success'>Likes: <span>0</span></button>
    //       <button class='btn-danger'>Delete</button>
    //     </blockquote>
    //   </li>

        let quoteCard = ce("li")
        quoteCard.className = "quote-card"

        let blockquote = ce("blockquote")
        blockquote.className = "blockquote"

        let content = ce("p")
        content.className = "mb-0"
        content.innerText = quote.quote

        let author = ce("footer")
        author.className = "blockquote-footer"
        author.innerText = quote.author

        let br = ce("br")

        let likebtn = ce("button")
        likebtn.className = "btn-success"
        // likebtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`

        likebtn.innerText = "Likes:"

        let span = ce("span")
        if(quote.likes){
            span.innerText = quote.likes.length
        }else{
            span.innerText = 0
        }
       

        likebtn.append(span)

        likebtn.addEventListener("click", async () => {
            fetch("http://localhost:3000/likes", {
                method: "POST",
                headers:{
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    quoteId: quote.id
                })
            })
            // .then(res => res.json())
            
            // .then(console.log)
            .then(() => {
                let likes = parseInt(span.innerText)
                span.innerText = ++likes
                // span.innerText = ++quote.likes.length
            })

            // let res = await likeIncrement(quote)
            // let likeObj = await res.json()

            // console.log(likeObj)

        })

        let delbtn = ce("button")
        delbtn.className = "btn-danger"
        delbtn.innerText = "Delete"

        delbtn.addEventListener("click", async () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`,{
                method: "DELETE"
            })
            .then(() => quoteCard.remove())

            // deleteQuote(quote,quoteCard)

            // deleteQuote(quote)
            // .then(() => quoteCard.remove())

            // await deleteQuote(quote)
            // quoteCard.remove()

        })

        blockquote.append(content,author,br,likebtn,delbtn)

        quoteCard.append(blockquote)

        ul.append(quoteCard)
    }

    fetchQuotes()

    async function likeIncrement(quote){
         let response = await fetch("http://localhost:3000/likes", {
                method: "POST",
                headers:{
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    quoteId: quote.id
                })
            })
        return response
            // .then(res => res.json())
    }
    // async function deleteQuote(quote){
    //     let response = await fetch(`http://localhost:3000/quotes/${quote.id}`,{
    //         method: "DELETE"
    //     })

    //     return response
    //     // return fetch(`http://localhost:3000/quotes/${quote.id}`,{
    //     //     method: "DELETE"
    //     // })
    // }

    form.addEventListener("submit", () => {
        event.preventDefault()
        // console.log(form)
        debugger

        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                // "content-type": "application/json"
                "Content-Type": "application/json"

            },
            body: JSON.stringify({
                quote: event.target[0].value,
                author: event.target[1].value
            })
        })
        .then(res => res.json())
        // .then(console.log)
        .then(newQuote => {
            // newQuote.likes = []
            displayQuote(newQuote) //Pessimistic rendering
            form.reset()
        })
        // .then(newQuote => fetchQuotes())
        // fetchQuotes() //optimistic rendering
        // event.target.reset()

    })

})