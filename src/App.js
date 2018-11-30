import React, { Component } from "react";
import Auth from "./pages/auth";
import "./App.css";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
	render() {
		return (
			<Layout>
				<Header className="App-header">myS3.front</Header>
				<Auth />
			</Layout>
		);
	}
}

export default App;
