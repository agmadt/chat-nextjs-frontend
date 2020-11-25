import Layout from '../../components/layout'
import Chat from '../../components/chats/chat'

export default class ChatroomDetail extends React.Component {
  render() {
    return (
      <Layout>
        <Chat room_id={this.props.id} />
      </Layout>
    )
  }
}

export async function getServerSideProps(context) {
  const { id } = context.query

  return { props: { id: id } };
}