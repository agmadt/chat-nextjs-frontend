export default function ChatParticipant(props) {
  return (
    <>
      <div className="mb-1 break-words">
        {props.participant.email}
      </div>
    </>
  )
}