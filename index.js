const googleTrends = require('google-trends-api')

const QUERY_WIKIPEDIA = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&excontinue=0&titles="

const searchWikiItem = (query, callback) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        const data = JSON.parse(this.response)
        const page = Object.keys(data.query.pages)[0]
        callback(data.query.pages[page].extract)
    }
    xhr.open('GET',`QUERY_WIKIPEDIA${query}`, true)
    xhr.send()
}

const saveWikiItem = (query) => {
    searchWikiItem(query, (response) => {
        saveItem(query, response)
    })
}

const saveItem = (query, value) => {
    localStorage.setItem(query, value)
}

const getCachedItem = (query) => localStorage.getItem(query)

export default {
    searchWikiItem,
    saveWikiItem,
    getCachedItem
}