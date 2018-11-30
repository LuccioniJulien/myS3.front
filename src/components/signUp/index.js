import React, { Component } from "react";
import { Layout, Input, Card, Button, message, Alert } from "antd";
import "./index.css";

const { Content } = Layout;

class signUp extends Component {
	state = {
		body: { nickname: "", email: "", password_confirmation: "", password: "" },
		message: ""
	};

	handleClickNavigate = () => {
		this.props.navigate();
	};

	handleChangeInput = event => {
		const { value, name: key } = event.target;
		const body = Object.assign({}, this.state.body);
		body[key] = value;
		this.setState({ body });
		console.log(this.state);
	};

	subscribe = () => {
		if (!this.checkForm()) {
			return;
		}
		let body = JSON.stringify(this.state.body);
		const headers = {
			"Content-type": "application/json"
		};
		const method = "POST";
		const options = { headers, method, body };
		fetch("http://localhost:5000/api/auth/register", options)
			.then(res => res.json())
			.then(json => this.handleResponse(json));
	};

	handleResponse(json) {
		console.log(json);
		if (json.data) {
			message.success("Account created");
			return;
		}
		if (json.err) {
			message.error("Error");
			this.setState({ message: json.err.fields });
			return;
		}
	}

	cleanForm() {
		const body = Object.assign({}, this.state.body);
		for (const key in body) {
			body[key] = "";
		}
		this.setState({ body });
	}
	
	checkForm() {
		for (const key in this.state.body) {
			if (!this.state.body[key]) {
				message.error("Please fill up all the entries");
				return false;
			}
		}
		return true;
	}

	render() {
		const { message } = this.state;
		const alert =
			message === "" || !message ? (
				<></>
			) : (
				<Alert message={message} type="error" style={{ marginTop: 10 }} />
			);
		return (
			<div>
				{alert}
				<Card
					title="Subscribe"
					extra={
						<Button
							type="dashed"
							size={"small"}
							onClick={this.handleClickNavigate}
						>
							Log in
						</Button>
					}
					style={{ width: 300, marginTop: 10 }}
				>
					<div style={{ marginBottom: 16 }}>
						<Input
							name="nickname"
							addonBefore="Login"
							onChange={this.handleChangeInput}
							value={this.state.body.nickname}
						/>
					</div>
					<div style={{ marginBottom: 16 }}>
						<Input
							name="email"
							addonBefore="Email"
							onChange={this.handleChangeInput}
							value={this.state.body.email}
						/>
					</div>
					<div style={{ marginBottom: 16 }}>
						<Input
							name="password"
							addonBefore="Password"
							onChange={this.handleChangeInput}
							type="password"
							value={this.state.body.password}
						/>
					</div>
					<div style={{ marginBottom: 16 }}>
						<Input
							name="password_confirmation"
							addonBefore="Confirmation"
							onChange={this.handleChangeInput}
							type="password"
							value={this.state.body.password_confirmation}
						/>
					</div>
					<Button type="primary" size={"large"} onClick={this.subscribe}>
						Subscribe
					</Button>
				</Card>
			</div>
		);
	}
}

export default signUp;
