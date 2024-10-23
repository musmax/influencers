export default {
    static: {
        "5m": {
            ms: 5 * 60 * 1000
        },
        "10m": {
            ms: 10 * 60 * 1000
        },
        "15m": {
            ms: 15 * 60 * 1000
        },
        "20m": {
            ms: 20 * 60 * 1000
        },
        "30m": {
            ms: 30 * 60 * 1000
        },
        "1h": {
            ms: 60 * 60 * 1000
        },
        "2h": {
            ms: 2 * 60 * 60 * 1000
        },
        "4h": {
            ms: 4 * 60 * 60 * 1000
        },
        "8h": {
            ms: 8 * 60 * 60 * 1000
        },
        "24h": {
            ms: 24 * 60 * 60 * 1000
        },
    },
    parse: (value, from, to) => {
        switch(from) {
            case "ms":
                switch(to) {
                    case "min":
                        return Math.floor(value / (60 * 1000));
                }
        }
    }
};