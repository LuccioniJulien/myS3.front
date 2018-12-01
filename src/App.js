import React, { Component } from "react";
import Auth from "./pages/auth";
import "./App.css";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
const { Header, Content, Footer, Sider } = Layout;
const userContext = React.createContext({});
export const context = userContext;
class App extends Component {
	state = {
		isConnected: false,
		user: null
	};

	handleConnexion(json) {
		console.log(json);
	}

	render() {
		return (
			<Layout>
				<Header className="App-header">myS3.front</Header>
				<userContext.Provider value={{ connexion: this.handleConnexion }}>
					<Auth />
				</userContext.Provider>
			</Layout>
		);
	}
}

export default App;
