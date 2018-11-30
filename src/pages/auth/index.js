import React, { Component } from "react";
import SignIn from "../../components/signIn";
import SignUp from "../../components/signUp";
import { Layout, Row, Col } from "antd";
import "./index.css";

const { Content } = Layout;

class Auth extends Component {
	state = {
		isSignIn: false
	};

	navigate = (isSignIn = !this.state.isSignIn) => {
		this.setState({ isSignIn });
	};

	render() {
		const { isSignIn } = this.state;
		const form = isSignIn ? (
			<SignIn navigate={this.navigate} />
		) : (
			<SignUp navigate={this.navigate} />
		);
		return (
			<Content className="App-content">
				<Row>
					<Col span={24}>{form}</Col>
				</Row>
			</Content>
		);
	}
}

export default Auth;
