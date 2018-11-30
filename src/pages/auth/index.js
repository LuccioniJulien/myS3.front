import React, { Component } from "react";
import { Layout, Row, Col } from "antd";
import "./index.css";

const { Content } = Layout;

class Auth extends Component {
	state = {
		isSignIn: true
	};

	render() {
		return (
			<Content className="App-content">
				<Row>
					<Col span={24}>salut</Col>
				</Row>
			</Content>
		);
	}
}

export default Auth;
