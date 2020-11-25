export default function Bubble(props) {
  return (
    <>
      <div>
        <div className="chat__message-bubble bg-gray-800 inline-block text-white pb-2 pt-1 px-3 mb-2 rounded-md text-white border border-gray-800">
          <div>
            <div className="chat__message-name inline-block"><em><strong>{props.chat.name}</strong></em></div>
          </div>
          <div>
            <div className="chat__message-text bg-gray-800 inline-block">{props.chat.message}</div>
          </div>
        </div>
      </div>
    </>
  )
}