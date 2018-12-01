import React from "react";
import { Layout, Card, Button} from "antd";
import "./index.css";

const { Sider } = Layout;
const { Content } = Layout;
const sideBar = props => {
	const { nickname, email } = props.user;
	return (
		<Sider width={200} style={{ background: "#282c34", color: "white" }}>
			<Content style={{ padding: 24, margin: 0 }}>
				<Card
					title="Profil"
					style={{ width: 150 }}
				>
					<p>{nickname}</p>
					<p>{email}</p>
				</Card>
			</Content>
		</Sider>
	);
};

export default sideBar;
