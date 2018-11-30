import React, { Component, Fragment } from "react";
import { Layout, Row, Col } from "antd";
import "./index.css";

const { Content } = Layout;

class signIn extends Component {
	render() {
		return (
			<Fragment>
				<div style={{ marginBottom: 16 }}>
					<Input
						addonBefore="Login"
					/>
				</div>
				<div style={{ marginBottom: 16 }}>
					<Input
						addonBefore="Password:"
					/>
				</div>
			</Fragment>
		);
	}
}

export default Auth;
