import React, { Component } from "react";
import Auth from "./pages/auth";
import "./App.css";
import { Layout } from "antd";
import Dashboard from "./pages/dashboard";
import jwt from "jsonwebtoken";

const { Header, Content, Footer, Sider } = Layout;
const userContext = React.createContext({});
export const context = userContext;

class App extends Component {
	state = {
		isConnected: false,
		user: null
	};

	componentDidMount() {
		const meta = JSON.parse(localStorage.getItem("myS3"));
		if (meta) {
			const user = jwt.decode(meta.token);
			user.token = meta.token;
			this.setState({ user, isConnected: true });
		}
	}

	handleConnexion = json => {
		const user = jwt.decode(json.meta.token);
		localStorage.setItem("myS3", JSON.stringify(json.meta));
		user.token = json.meta.token;
		this.setState({ user, isConnected: true });
	};

	renderAuthUI() {
		return (
			<Layout>
				<Header className="App-header">myS3.front</Header>
				<userContext.Provider value={{ connexion: this.handleConnexion }}>
					<Auth />
				</userContext.Provider>
			</Layout>
		);
	}

	renderDashbordUI() {
		return <Dashboard user={this.state.user} />;
	}

	render() {
		if (this.state.isConnected) {
			return this.renderDashbordUI();
		}
		return this.renderAuthUI();
	}
}


export default App;
