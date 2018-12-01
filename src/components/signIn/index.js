import React, { Component } from "react";
import { Layout, Input, Card, Button, message, Alert } from "antd";
import "./index.css";
import fetchAPI from "../../lib";
import CONSTANTE from "../../constants";
import { context as userContext } from "../../App";
const { LOGIN } = CONSTANTE;

class signIn extends Component {
	state = {
		nickname: "",
		password: "",
		message: "",
		type: ""
	};

	handleClickNavigate = () => {
		this.props.navigate();
	};

	handleClickConnect = async context => {
		try {
			const body = this.state;
			const json = await fetchAPI({ action: LOGIN, method: "POST", body });
			this.handleResponse(json, context);
		} catch (error) {
			const json = { err: { fields: "Unknow error" } };
			this.handleResponse(json, context);
		}
	};

	handleResponse(json, context) {
		if (json.err) {
			message.error("Error");
			this.setState({ message: json.err.fields, type: "error" });
			return;
		}
		context.connexion(json);
	}

	handleChangeInput = event => {
		const { value, name: key } = event.target;
		this.setState({ [key]: value });
	};

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
					title="Login"
					extra={
						<Button
							type="dashed"
							size={"small"}
							onClick={this.handleClickNavigate}
						>
							Subscribe
						</Button>
					}
					style={{ width: 400, marginTop: 10 }}
				>
					<div style={{ marginBottom: 16 }}>
						<Input
							name="nickname"
							addonBefore="Login"
							onChange={this.handleChangeInput}
						/>
					</div>
					<div style={{ marginBottom: 16 }}>
						<Input
							name="password"
							addonBefore="Password"
							onChange={this.handleChangeInput}
							type="password"
						/>
					</div>
					<userContext.Consumer>
						{context => (
							<Button
								type="primary"
								size={"large"}
								onClick={() => this.handleClickConnect(context)}
							>
								Log in
							</Button>
						)}
					</userContext.Consumer>
				</Card>
			</div>
		);
	}
}

export default signIn;
