import React from "react";
import firebase from "firebase";
import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import PropTypes from "prop-types";
import Login from "./Login";
import base, { firebaseApp } from "../base";

class Inventory extends React.Component{
    static propTypes = {
        fishes: PropTypes.object,
        updateFish: PropTypes.func,
        deleteFish: PropTypes.func,
        loadSampleFishes: PropTypes.func,
        addFish: PropTypes.func
    };

    state = {
        uid: null,
        owner: null
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.authHandler({user});
            }
        });
    };

    authHandler = async (authData) => {
        const store = await base.fetch(this.props.storeId, { cotext: this });
        if(!store.owner){
            await base.post(`${this.props.storeId}/owner`, 
            { data: authData.user.uid }
            );
        }
        this.setState({
            uid: authData.user.uid,
            owner: store.owner || authData.user.uid
        })
    };

    authenticate = provider => {
        console.log(provider);
        const authProvider = new firebase.auth[`${provider}AuthProvider`]();
        firebaseApp
        .auth()
        .signInWithPopup(authProvider)
        .then(this.authHandler);
    };

    logOut = async () => {
        console.log('Logging out..');
        await firebase.auth().signOut();
        this.setState({ uid: null });
    };

    render(){
        const logOut = <button onClick={this.logOut}>Log Out!</button>
        if(!this.state.uid){
        return( 
            <Login authenticate={this.authenticate}></Login>
        );
        }

        if(this.state.uid !== this.state.owner){
            return (
                <div>
                    <p>Sorry you are not the owner !</p>
                   {logOut} 
                </div>
            );
        }
        return (
            <div className="inventory">
                <h2>Inventory</h2>
                {logOut}
                {Object.keys(this.props.fishes).map(key => <EditFishForm
                key={key}
                index={key}
                fish={this.props.fishes[key]}
                upDateFish={this.props.upDateFish}
                deleteFish={this.props.deleteFish}
                ></EditFishForm>)}
                <AddFishForm addFish={this.props.addFish}></AddFishForm>
                <button onClick={this.props.loadSampleFishes}>Load Sample Fishes</button>
            </div>
        );
    }
}

export default Inventory;