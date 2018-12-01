import React, { Component } from "react";
import { List, Row, Input, Button, Col, message } from "antd";
import fetchAPI from "../../lib";
import CONSTANTE from "../../constants";
import "./index.css";
const { GETBUCKETS,POSTBUCKET, DELETEBUCKET, PUTBUCKET } = CONSTANTE;
class BlobList extends Component {
	state = {
		blobs: [],
		user: this.props.user,
		body: null,
		rename: ""
	};

	async componentDidMount() {
		const { uuid, token: jwt } = this.state.user;
		try {
			const json = await fetchAPI({
				action: GETBUCKETS(uuid),
				method: "GET",
				jwt
			});
			let blobs = json.data.blobs;
			blobs = blobs.map(x => {
				x.isText = true;
				return x;
			});
			this.setState({ blobs });
		} catch (error) {}
	}

	handlerClickAdd = async () => {
		if (!this.state.body) {
			message.error("No blank name");
			return;
		}
		const { uuid, token: jwt } = this.state.user;
		const { body } = this.state;
		try {
			const json = await fetchAPI({
				action: POSTBUCKET(uuid),
				method: "POST",
				body: { name: body },
				jwt
			});
			console.log(json);
			if (this.handleResponse(json)) {
				const { blobs } = this.state;
				json.isText = true;
				blobs.push(json);
				this.setState({ blobs, body: "" });
			}
		} catch (error) {
			const json = { err: { fields: error } };
			this.handleResponse(json);
		}
	};

	handleClickDelete = async id => {
		const { uuid, token: jwt } = this.state.user;
		try {
			const statut = await fetchAPI({
				action: DELETEBUCKET(uuid, id),
				method: "DELETE",
				jwt
			});
			console.log(statut);
			if (statut != 204) {
				throw new Error("Error");
			}
			let { blobs } = this.state;
			blobs = blobs.filter(x => x.id != id);
			console.log(blobs);
			this.setState({ blobs });
			this.handleResponseStatut(statut);
		} catch (error) {
			const json = { err: { fields: error } };
			this.handleResponseStatut(json);
		}
	};

	handleResponse(json) {
		if (json.err) {
			message.error(`${json.err.fields}`);
			return false;
		}
		if (json) {
			message.success("Success");
			return true;
		}
	}

	handleResponseStatut(statut) {
		if (statut == 204) {
			message.success("Success");
			return true;
		}
		if (statut.err) {
			message.error(`${statut.err.fields}`);
			return false;
		}
	}

	handleChangeInput = event => {
		const { value, name: key } = event.target;
		this.setState({ [key]: value });
	};

	isNameAlreadyExist(name) {
		const b = this.state.blobs.filter(x => x.name == name);
		return b;
	}
	handleClickPut = async item => {
		const { rename: name } = this.state;
		if (this.isNameAlreadyExist(name)) {
			message.error("Bucket with this name already exist");
			return;
		}
		if (name == "") {
			message.error("Field must not be blank");
			return;
		}
		const { uuid, token: jwt } = this.state.user;
		const bucket = Object.assign({}, item);
		try {
			const statut = await fetchAPI({
				action: PUTBUCKET(uuid, item.id),
				method: "PUT",
				body: { name },
				jwt
			});
			if (this.handleResponseStatut(statut)) {
				bucket.name = name;
				this.handelClickWillPut(bucket, true, "");
			}
		} catch (error) {
			const json = { err: { fields: error } };
			this.handleResponseStatut(json);
		}
	};

	handelClickWillPut(item, bool = false) {
		let { blobs } = this.state;
		blobs = blobs = blobs.map(x => {
			if (x.id === item.id) {
				x.isText = bool;
				x.name = item.name;
			}
			return x;
		});
		this.setState({ blobs, rename: item.name });
	}

	renderTableUI(item) {
		if (item.isText) {
			return (
				<Row gutter={16}>
					<Button style={{ marginRight: 8 }} type="primary">
						Show
					</Button>
					<Button
						style={{ marginRight: 8 }}
						type="danger"
						onClick={() => this.handleClickDelete(item.id)}
					>
						Delete
					</Button>
					<Button
						style={{ marginRight: 8 }}
						type="dashed"
						onClick={() => this.handelClickWillPut(item)}
					>
						Rename
					</Button>
					{item.name}
				</Row>
			);
		}
		return (
			<Row gutter={16}>
				<Button
					style={{ marginRight: 8 }}
					type="primary"
					onClick={() => this.handleClickPut(item, true)}
				>
					Save
				</Button>
				<Button
					style={{ marginRight: 8 }}
					type="primary"
					onClick={() => this.handelClickWillPut(item, true)}
				>
					Cancel
				</Button>
				<Input
					style={{ width: 150 }}
					name="rename"
					onChange={this.handleChangeInput}
					value={this.state.rename}
				/>
			</Row>
		);
	}

	render() {
		return (
			<>
				<Row gutter={16} style={{ marginBottom: 16 }}>
					<Col className="gutter-row" span={21}>
						<Input
							name="body"
							addonBefore="Add a blob:"
							onChange={this.handleChangeInput}
							value={this.state.body}
						/>
					</Col>
					<Col className="gutter-row" span={3}>
						<Button
							onClick={this.handlerClickAdd}
							style={{ width: "100%", minWidth: 50 }}
							type="primary"
						>
							Add
						</Button>
					</Col>
				</Row>
				<List
					header={<div>List of your blobs:</div>}
					bordered
					dataSource={this.state.blobs}
					renderItem={item => <List.Item>{this.renderTableUI(item)}</List.Item>}
				/>
			</>
		);
	}
}

export default BlobList;
