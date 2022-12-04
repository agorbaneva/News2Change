function loadNews(){
    const newsContainer = document.querySelector(".NewsContainer")

    var url = 'https://newsapi.org/v2/top-headlines?' +
            'sources=bbc-news&' +
            'apiKey=ca314d5c82eb44728d24e5c044118a51';
    var req = new Request(url);

    fetch(req)
        .then(function(response) {
            return response.json()
        }).then((data)=>{
            console.log(data);
            let articles = data.articles;
            for(let index=0; index<8; index++){
                    let div = document.createElement("div")
                    let title = articles[index].title;
                    let author = articles[index].author;
                    let url = articles[index].url;
                    let image = articles[index].urlToImage;
                    let date = parseDate(articles[index].publishedAt);
                    div.innerHTML = `<div class="NewsRow w3-col l3 m6 w3-margin-bottom">
                                        <div class="w3-display-container">
                                            <a href="${url}"><div class="title w3-black w3-padding">${title}</div></a>
                                            <p> ${date}, <i>${author}</i></p>
                                            <img src="${image}" style="width:100%">
                                        </div>
                                    </div>`;
                    newsContainer.appendChild(div);
            }    
        })
    }

function parseDate(dateString) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var d = new Date(dateString);
    return days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate();
}
loadNews();