import React, { Component } from "react";
import { List, Row, Input, Button, Col, message, Modal } from "antd";
import fetchAPI from "../../lib";
import CONSTANTE from "../../constants";
import download from "downloadjs";
import "./index.css";
const { GETBLOBS, GETBLOB, POSTBLOB, DELETEBLOB, PUTBLOB } = CONSTANTE;
class BlobList extends Component {
	state = {
		blobs: [],
		bucket: this.props.bucket,
		user: this.props.user,
		rename: "",
		file_to_upload: null,
		visible: false,
		meta: { path: "", size: "" }
	};

	async componentDidMount() {
		const { uuid, token: jwt } = this.state.user;
		const { id } = this.state.bucket;
		try {
			const json = await fetchAPI({
				action: GETBLOBS(uuid, id),
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
		if (!this.state.file_to_upload) {
			message.error("Select a file to upload");
			return;
		}
		const { id } = this.state.bucket;
		const { uuid, token: jwt } = this.state.user;
		const { file_to_upload } = this.state;
		var formData = new FormData();
		formData.append("file_to_upload", file_to_upload);
		formData.append("name", file_to_upload.name);
		try {
			const json = await fetchAPI({
				action: POSTBLOB(uuid, id),
				method: "POST",
				body: formData,
				jwt,
				file: true
			});
			console.log(json);
			if (this.handleResponse(json)) {
				const { blobs } = this.state;
				json.data.isText = true;
				blobs.push(json.data);
				this.setState({ blobs });
			}
		} catch (error) {
			const json = { err: { fields: error } };
			this.handleResponse(json);
		}
	};

	fileChangedHandler = event => {
		const file_to_upload = event.target.files[0];
		this.setState({ file_to_upload });
	};

	handleClickDelete = async id => {
		const { uuid, token: jwt } = this.state.user;
		const { id: bucket_id } = this.state.bucket;
		try {
			const statut = await fetchAPI({
				action: DELETEBLOB(uuid, bucket_id, id),
				method: "DELETE",
				jwt
			});
			if (statut != 204) {
				throw new Error("Error");
			}
			let { blobs } = this.state;
			blobs = blobs.filter(x => x.id != id);
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
		return b.length != 0;
	}
	handleClickPut = async item => {
		const { rename: name } = this.state;
		const { id: bucket_id } = this.state.bucket;
		if (this.isNameAlreadyExist(name)) {
			message.error("Blobs with this name already exist");
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
				action: PUTBLOB(uuid, bucket_id, item.id),
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
			} else {
				x.isText = true;
			}
			return x;
		});
		this.setState({ blobs, rename: item.name });
	}

	handelDownload = async item => {
		const id = item.id;
		const { uuid, token: jwt } = this.state.user;
		const { id: bucket_id } = this.state.bucket;
		try {
			const blob = await fetchAPI({
				action: GETBLOB(uuid, bucket_id, id),
				method: "GET",
				jwt,
				file: true,
				download: true
			});
			download(blob, item.name, blob.type);
		} catch (error) {}
	};

	handleMeta = async item => {
		const id = item.id;
		const { uuid, token: jwt } = this.state.user;
		const { id: bucket_id } = this.state.bucket;
		try {
			const json = await fetchAPI({
				action: GETBLOB(uuid, bucket_id, id + "/meta"),
				method: "GET",
				jwt
			});
			const meta = json.data.blob;
			this.setState({ meta });
			this.showModal();
			console.log(json);
		} catch (error) {}
	};

	handelClickCopy = async item => {
		const id = item.id;
		const { id: bucket_id } = this.state.bucket;
		const { uuid, token: jwt } = this.state.user;
		try {
			const json = await fetchAPI({
				action: POSTBLOB(uuid, bucket_id, id + "/copy"),
				method: "POST",
				body: {},
				jwt
			});
			if (this.handleResponse(json)) {
				const { blobs } = this.state;
				json.data.isText = true;
				blobs.push(json.data);
				this.setState({ blobs });
			}
		} catch (error) {
			const json = { err: { fields: error } };
			this.handleResponse(json);
		}
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = e => {
		this.setState({
			visible: false
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false
		});
	};

	renderTableUI(item) {
		if (item.isText) {
			return (
				<Row gutter={16}>
					<Button
						style={{ marginRight: 8 }}
						type="primary"
						onClick={() => this.handleMeta(item)}
					>
						Info
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
					<Button
						style={{ marginRight: 8 }}
						type="dashed"
						onClick={() => this.handelClickCopy(item)}
					>
						copy
					</Button>
					<a
						onClick={() => {
							this.handelDownload(item);
						}}
					>
						{item.name}
					</a>
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
		const { path, size } = this.state.meta;
		return (
			<>
				<Button
					onClick={this.props.navigate}
					style={{ width: "100%", minWidth: 50, marginBottom: 16 }}
					type="primary"
				>
					return to bucket list
				</Button>
				<Row gutter={16} style={{ marginBottom: 16 }}>
					<Col className="gutter-row" span={21}>
						<input type="file" onChange={this.fileChangedHandler} />
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
					header={
						<div>List of your blobs in {this.props.bucket.name} bucket:</div>
					}
					bordered
					dataSource={this.state.blobs}
					renderItem={item => <List.Item>{this.renderTableUI(item)}</List.Item>}
				/>
				<Modal
					title="Meta"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					<p>Path: {path}</p>
					<p>Size: {size}</p>
				</Modal>
			</>
		);
	}
}

export default BlobList;
