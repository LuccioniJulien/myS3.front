import React, { Component } from "react";
import { List, Row, Input, Button, Col, message } from "antd";
import Blobs from "../blob";
import fetchAPI from "../../lib";
import CONSTANTE from "../../constants";
import "./index.css";
const { POSTBUCKET, DELETEBUCKET, PUTBUCKET } = CONSTANTE;
class BucketList extends Component {
	state = {
		buckets: [],
		bucket: null,
		user: this.props.user,
		body: null,
		isBucketDetail: false,
		rename: ""
	};

	navigation = () => {
		this.setState({ isBucketDetail: !this.state.isBucketDetail });
	};

	async componentDidMount() {
		const { uuid, token: jwt } = this.state.user;
		try {
			const json = await fetchAPI({
				action: POSTBUCKET(uuid),
				method: "GET",
				jwt
			});
			let buckets = json.data.buckets;
			buckets = buckets.map(x => {
				x.isText = true;
				return x;
			});
			this.setState({ buckets });
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
				const { buckets } = this.state;
				json.isText = true;
				buckets.push(json);
				this.setState({ buckets, body: "" });
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
			let { buckets } = this.state;
			buckets = buckets.filter(x => x.id != id);
			console.log(buckets);
			this.setState({ buckets });
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
		const b = this.state.buckets.filter(x => x.name == name);
		return b.length != 0;
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

	handleClickShow(item) {
		this.setState({ bucket: item });
		this.navigation();
	}

	handelClickWillPut(item, bool = false) {
		let { buckets } = this.state;
		buckets = buckets = buckets.map(x => {
			if (x.id === item.id) {
				x.isText = bool;
				x.name = item.name;
			}
			return x;
		});
		this.setState({ buckets, rename: item.name });
	}

	renderTableUI(item) {
		if (item.isText) {
			return (
				<Row gutter={16}>
					<Button
						style={{ marginRight: 8 }}
						type="primary"
						onClick={() => this.handleClickShow(item)}
					>
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
		if (this.state.isBucketDetail) {
			return <Blobs user={this.state.user} bucket={this.state.bucket} navigate={this.navigation} />;
		}
		return (
			<>
				<Row gutter={16} style={{ marginBottom: 16 }}>
					<Col className="gutter-row" span={21}>
						<Input
							name="body"
							addonBefore="Add a bucket:"
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
					header={<div>List of your buckets:</div>}
					bordered
					dataSource={this.state.buckets}
					renderItem={item => <List.Item>{this.renderTableUI(item)}</List.Item>}
				/>
			</>
		);
	}
}

export default BucketList;
