import App from "next/app";
import '../styles/index.css'
import AuthContainer from '../containers/AuthContainer'

export default function MyApp({Component, pageProps}) {
  return (
    <AuthContainer.Provider>
      <Component {...pageProps} />
    </AuthContainer.Provider>
  )
}
