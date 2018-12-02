import React, { Component } from "react";
import { Layout, Card, Button, Input, message } from "antd";
import "./index.css";
import fetchAPI from "../../lib";
import CONSTANTE from "../../constants";
const { PUTUSER } = CONSTANTE;
const { Sider, Content } = Layout;

class SideBar extends Component {
	constructor(props) {
		super(props);
		const user = this.props.user;
		user.password = "";
		user.password_confirmation = "";
		this.state = {
			isProfilEdit: false,
			user
		};
	}

	handleClickLogOut() {
		window.localStorage.clear();
		window.location.href = "http://localhost:3000/";
	}

	thisRenderEditUI() {
		const {
			nickname,
			email,
			password,
			password_confirmation
		} = this.state.user;
		return (
			<Sider width={200} style={{ background: "#282c34", color: "white" }}>
				<Content style={{ padding: 24, margin: 0 }}>
					<Card
						title="Profil"
						style={{ width: 150 }}
						extra={
							<Button
								type="dashed"
								size={"small"}
								onClick={this.handleClickEditNav}
							>
								Cancel
							</Button>
						}
					>
						<Input
							onChange={this.handleChangeInput}
							name="nickname"
							placeholder={nickname}
							value={nickname}
						/>
						<Input
							onChange={this.handleChangeInput}
							name="email"
							placeholder={email}
							value={email}
						/>
						<Input
							onChange={this.handleChangeInput}
							name="password"
							placeholder={"password"}
						/>
						<Input
							onChange={this.handleChangeInput}
							name="password_confirmation"
							placeholder={"password"}
						/>
						<p>{email}</p>
						<Button type="primary" size={"small"} onClick={this.handleClickPut}>
							Save
						</Button>
					</Card>
				</Content>
			</Sider>
		);
	}

	handleChangeInput = event => {
		const { value, name: key } = event.target;
		const user = Object.assign({}, this.state.user);
		user[key] = value;
		this.setState({ user });
	};

	handleClickPut = async item => {
		const { uuid, token: jwt } = this.state.user;
		const body = Object.assign({}, this.state.user);

		if (body.password == "" && body.password_confirmation == "") {
			delete body.password;
			delete body.password_confirmation;
		}
		console.log(body);
		try {
			const statut = await fetchAPI({
				action: PUTUSER(uuid),
				method: "PUT",
				body,
				jwt
			});
			console.log(statut)
			this.handleResponseStatut(statut);
		} catch (error) {
			const json = { err: { fields: error } };
			this.handleResponseStatut(json);
		}
		this.handleClickEditNav();
		body.password = "";
		body.password_confirmation = "";
		this.setState({ user: body });
	};

	cleanForm() {
		const body = Object.assign({}, this.state.body);
		for (const key in body) {
			body[key] = "";
		}
		this.setState({ body });
	}

	handleClickEditNav = () => {
		this.setState({ isProfilEdit: !this.state.isProfilEdit });
	};

	handleResponseStatut(statut) {
		if (statut == 204) {
			message.success("Success");
			return true;
		}
		if (statut.err) {
			message.error(`${statut.err.fields}`);
			return false;
		}
		message.error(`${statut}`);
		return false;
	}

	render() {
		if (this.state.isProfilEdit) {
			return this.thisRenderEditUI();
		}
		const { nickname, email } = this.state.user;
		return (
			<Sider width={200} style={{ background: "#282c34", color: "white" }}>
				<Content style={{ padding: 24, margin: 0 }}>
					<Card
						title="Profil"
						style={{ width: 150 }}
						extra={
							<Button
								type="dashed"
								size={"small"}
								onClick={this.handleClickEditNav}
							>
								Edit
							</Button>
						}
					>
						<p>{nickname}</p>
						<p>{email}</p>
						<Button
							type="danger"
							size={"small"}
							onClick={this.handleClickLogOut}
						>
							Log out
						</Button>
					</Card>
				</Content>
			</Sider>
		);
	}
}

export default SideBar;
