let URLS = require('../../utils/websites.links');
let workerEvent = require('../Workers/worker');
let fs = require('fs')

class WebsitePerf {
    constructor(){
        let errorSince = fs.existsSync('log/error-data.json') ? 
            JSON.parse(fs.readFileSync('log/error-data.json')) : {}

        let error = new Map();
        for(let typeURL in URLS){
            let url = []
            for(let urlError in errorSince){
                if(URLS[typeURL].indexOf(urlError) > -1) url.push({time: errorSince[urlError], url: urlError})
            }
            error.set(typeURL, url)
        }

        this.averagePing = new Map();
        this.errorPage = new Map();
        this.changePage = new Map();
        this.ErrorData = error;
    }

    PageChanged ({arr, type}) {
        if (!this.changePage.has(type)) {
            this.changePage.set(type, []);
        }
        this.changePage.set(type, arr)
    }

    PageError ({arr, type}) {
        if (!this.errorPage.has(type)) {
            this.errorPage.set(type, []);
        }
        this.errorPage.set(type, arr)
    }

    ChangePing ({ping, type}){
        if (!this.averagePing.has(type)) {
            this.averagePing.set(type, 0);
        }
        this.averagePing.set(type, ping)
    }
}

let Perf = new WebsitePerf();

workerEvent.on(workerEvent.eventsList.WorkerFundPageChange, (args) => {
    let {arr, type} = args
    Perf.PageChanged({arr, type})
})
workerEvent.on(workerEvent.eventsList.WorkerHasPageError, (args) => {
    let {type, arr} = args
    Perf.PageError({arr, type})
})
workerEvent.on(workerEvent.eventsList.WorkerUpdatePagePing, (args) => {
    let {type, cfr} = args
    Perf.ChangePing({ping : cfr, type})
})

module.exports = Perf