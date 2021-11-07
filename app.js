class Title extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Dashboard"
        };
    }

    render() {
        return (
            <h1 id="title">{ this.state.title }</h1>
        );
    }
}

class Progress extends React.Component {
    render() {
        return (
            <p>Wait...</p>
        );
    }
}

class Dashboard extends React.Component {
    url = "https://paws-api.herokuapp.com/prices";
    currencies = {
        "btc": "Bitcoin",
        "eth": "Ethereum",
        "ltc": "Litecoin"
    };
    requestInterval = 0;

    constructor(props) {
        super(props);
        this.state = {
            prices: {}
        };
        this.requests();
    }

    requests() {
        Object.keys(this.currencies).forEach((ticker, _) => {
            fetch(this.url + "?from=" + ticker + "&to=rub").then(async response => {
                this.setState(async prevState => ({
                    prices: prevState.prices[ticker] = await response.text()
                }))
            });
        });
    }

    componentDidMount() {
        this.requestInterval = setInterval(() => {
            this.requests();
        }, 5000);
    }

    componentDidUnmount() {
        clearInterval(this.requestInterval);
    }

    table() {
        const tableView = Object.keys(this.currencies).map((ticker, index) => {
            return <tr key={ ticker }>
                <td class="cell-img"><img src={ "currencies/" + ticker + ".png" } alt="" width="40"/></td>
                <td class="cell-currency">{ this.currencies[ticker] } ({ ticker })</td>
                <td class="cell-price">{ this.state.prices[ticker] !== undefined ? this.state.prices[ticker] : <Progress/> }</td>
            </tr>
        });
        return (
            <table>{ tableView }</table>
        );
    }

    render() {
        return (
            <div id="container">
                <Title/>
                { this.table() }
            </div>
        );
    }
}


ReactDOM.render(
    <Dashboard/>,
    document.getElementById("content")
);