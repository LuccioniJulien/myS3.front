import React, { Component } from "react";
import { Input, Card, Button, message, Alert } from "antd";
import fetchAPI from "../../lib";
import CONSTANTE from "../../constants";
import "./index.css";

const { REGISTER } = CONSTANTE;

class signUp extends Component {
	state = {
		body: { nickname: "", email: "", password_confirmation: "", password: "" },
		message: "",
		type: ""
	};

	handleClickNavigate = () => {
		this.props.navigate();
	};

	handleChangeInput = event => {
		const { value, name: key } = event.target;
		const body = Object.assign({}, this.state.body);
		body[key] = value;
		this.setState({ body });
	};

	subscribe = async () => {
		if (!this.checkForm()) {
			return;
		}
		try {
			const { body } = this.state;
			const json = await fetchAPI({ action: REGISTER, method: "POST", body });
			this.handleResponse(json);
		} catch (error) {
			const json = { err: { fields: "Unknow error" } };
			this.handleResponse(json);
		}
	};

	handleResponse(json) {
		if (json.data) {
			this.setState({ message: "Account created", type: "success" });
			this.cleanForm();
			return;
		}
		if (json.err) {
			message.error("Error");
			this.setState({ message: json.err.fields, type: "error" });
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
		const { message, type } = this.state;
		const alert =
			message === "" || !message ? (
				<></>
			) : (
				<Alert
					message={message}
					type={type}
					style={{ marginTop: 10, width: 400 }}
				/>
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
					style={{ width: 400, marginTop: 10 }}
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
