class Search {
    search(query, callback) {
        return null;
    }

    getCachedItem(query) {
        return localStorage.getItem(query)
    }

    saveItem(query, value) {
        localStorage.setItem(query, value)
    }

    saveDatabase() {
        return null;
    }
}

export class Wiki extends Search {
    static QUERY_WIKIPEDIA_DE = "https://de.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&excontinue=0&format=json&titles="
    static QUERY_TRENDING_WIKIPEDIA_DE = "https://wikimedia.org/api/rest_v1/metrics/pageviews/top/de.wikipedia/all-access/YEAR/MONTH/all-days"

    search(query, callback) {
        const cachedItem = super.getCachedItem(query)
        if (cachedItem == null) {

            const xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                const data = JSON.parse(this.response)
                const page = Object.keys(data.query.pages)[0]
                const extractedData = data.query.pages[page].extract
                super.saveItem(query, extractedData)
                callback(extractedData)
            }
            xhr.open('GET', `${self.QUERY_WIKIPEDIA_DE}${query}`, true)
            xhr.send()
        } else {
            callback(cachedItem)
        }
    }

    saveDatabase() {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            const data = JSON.parse(this.response)
            if ('articles' in data.items[0]) {
                const articles = data.items[0].articles
                const articlesLen = articles.length
                for (let i = 0; i < articlesLen; i++) {
                    console.log(articles[i].article)
                    self.prototype.search(articles[i].article, () => {
                    })
                }
            }
        }

        const YEAR = new Date().getFullYear().toString()
        const MONTH = ('0' + (new Date().getMonth() + 1)).slice(-2) /* https://stackoverflow.com/a/3605248 */

        xhr.open('GET', `${self.QUERY_TRENDING_WIKIPEDIA_DE.replace('YEAR', YEAR.toString()).replace('MONTH', MONTH)}`, true)
        xhr.send()
        return super.saveDatabase();
    }
}