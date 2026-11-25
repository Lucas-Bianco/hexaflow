import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SmoothScroll from './SmoothScroll.jsx'
import ScrollProgress from './ScrollProgress.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

// Page shell: smooth scroll, progress bar, nav, footer, scroll-to-top on nav.
export default function Layout({ children }) {
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [loc.pathname])
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Nav />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </SmoothScroll>
  )
}