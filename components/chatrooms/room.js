import Link from 'next/link'
import AuthContainer from '../../containers/AuthContainer'

export default function Room(props) {

  const auth = AuthContainer.useContainer();
  return (
    <>
      <Link href={`chatrooms/${props.data.id}`}>
        <div className="w-full bg-gray-800 px-8 pb-2 pt-1 mb-2 border border-black hover:bg-gray-600 text-white cursor-pointer">
          {props.data.name} --

          {props.data.participants.map((element, key) => {
            return key == 0 ? ' ' + element.email : ', ' + element.email
          })}
        </div>
      </Link>
    </>
  )
}
  