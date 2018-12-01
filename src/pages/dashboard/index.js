import React, { Component } from "react";
import { Layout } from "antd";
import Sidebar from "../../components/sidebar";
import BucketList from "../../components/bucket";
import "./index.css";

const { Content } = Layout;
class Dashboard extends Component {
	state = {
		isSignIn: true
	};

	render() {
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Sidebar user={this.props.user} />
				<Content style={{ background: "#fff", padding: 24, margin: 0 }}>
					<BucketList user={this.props.user} />
				</Content>
			</Layout>
		);
	}
}

export default Dashboard;
