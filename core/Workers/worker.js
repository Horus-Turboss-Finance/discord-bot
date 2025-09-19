class Worker {
    constructor() {
        let eventM = new Map();
        for(let event in this.eventsList){
            eventM.set(this.eventsList[event], [])
        }
        /**
         * @private
         */
        this.eventMap = eventM;
    }

    eventsList = {
        WorkerFundPageChange : "PageChange",
        WorkerHasPageError: "PageError",
        WorkerUpdatePagePing: "UpdatePing"
    }

    on(event, callback) {
        if (!this.eventMap.has(event)) {
            throw new Error("This event not exist.")
        }
        this.eventMap.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventMap.has(event)) {
            const callbacks = this.eventMap.get(event).filter(cb => cb !== callback);
            this.eventMap.set(event, callbacks);
        }
    }

    emit(event, ...data) {
        if (this.eventMap.has(event)) {
            this.eventMap.get(event).forEach(callback => {
                setTimeout(() => callback(...data), 0);
            });
        }
    }
}

module.exports = new Worker();