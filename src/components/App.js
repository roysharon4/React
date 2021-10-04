import React from "react";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";
import PropTypes from "prop-types";

class App extends React.Component{
    state = {
        fishes: {},
        order: {}
    };

    static propTypes = {
        match: PropTypes.object
    };

    componentDidMount() {
        const { params } = this.props.match;
        const localStorageRef = localStorage.getItem(params.storeId);
        if(localStorageRef){
            this.setState({ order: JSON.parse(localStorageRef)});
        }
        this.ref = base.syncState(`${params.storeId}/fishes`, {
          context: this,
          state: "fishes"
        });
    }

    componentDidUpdate(){
        localStorage.setItem(this.props.match.params.storeId, 
            JSON.stringify(this.state.order));
    }

    componentWillUnmount(){
        base.removeBinding(this.ref);
    }
    
    addFish = fish => {
        const fishes = {...this.state.fishes};
        fishes[`fish${Date.now()}`] = fish;
        this.setState({
            fishes: fishes
        });
    };

    upDateFish = (key, updatedFish) => {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({
            fishes: fishes
        });
    };

    deleteFish = (key) => {
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({
            fishes: fishes
        })
    };

    loadSampleFishes = () => {
        this.setState({ fishes: sampleFishes});
    };

    addToOrder = (key) => {
        const order = {...this.state.order};
        order[key] = order[key] + 1 || 1;
        this.setState({
            order: order
        });
    };

    removeFromOrder = (key) => {
        const order = {...this.state.order};
        delete order[key];
        this.setState({
            order: order
        });
    };

    render(){
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="FRESH SEEFOOD MARKET"></Header>
                    <ul className="fishes">
                        {Object.keys(this.state.fishes).map(key => (
                        <Fish key={key}
                        index={key}
                        details={this.state.fishes[key]}
                        addToOrder={this.addToOrder}
                        ></Fish>))}
                    </ul>
                </div>
                <Order 
                fishes={this.state.fishes} 
                order={this.state.order}
                removeFromOrder={this.removeFromOrder}></Order>
                <Inventory 
                    addFish={this.addFish}
                    upDateFish = {this.upDateFish}
                    deleteFish = {this.deleteFish}
                    loadSampleFishes={this.loadSampleFishes}
                    fishes={this.state.fishes}
                    storeId={this.props.match.params.storeId}
                ></Inventory>
            </div>
        );
    }
}

export default App;