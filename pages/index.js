import Layout from '../components/layout'
import ChatRoomList from '../components/chatrooms/list'
import Router from 'next/router'

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <ChatRoomList chatrooms={this.props.data.chatrooms} />
      </Layout>
    )
  }
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chatrooms');
  const data = await response.json();
  return { props: { data } };
}