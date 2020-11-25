import Header from '../components/header'

export default function Layout({children}) {
    return (
      <div className="container w-10/12 mx-auto">
        <Header />
        <div className="body mt-2">
          {children}
        </div>
      </div>
    )
  }