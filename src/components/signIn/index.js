import React, { Component } from "react";
import { Layout, Input, Card, Button } from "antd";
import "./index.css";

const { Content } = Layout;

class signIn extends Component {

	handleClickNavigate = () =>{
		console.log("navigate")
		this.props.navigate()
	}

	render() {
		return (
			<div>
				<Card
					title="Login"
					extra={<Button type="dashed" size={'small'} onClick={this.handleClickNavigate}>Subscribe</Button>}
					style={{ width: 300, marginTop:30 }}
				>
					<div style={{ marginBottom: 16 }}>
						<Input addonBefore="Login" />
					</div>
					<div style={{ marginBottom: 16 }}>
						<Input addonBefore="Password" />
					</div>
					<Button type="primary" size={'large'}>log in</Button>
				</Card>
			</div>
		);
	}
}

export default signIn;
