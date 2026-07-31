import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { Collection } from './pages/Collection.jsx'
import { Wishlist } from './pages/Wishlist.jsx'
import { Stats } from './pages/Stats.jsx'
import { AlbumDetail } from './pages/AlbumDetail.jsx'
import { AlbumFormPage } from './pages/AlbumFormPage.jsx'
import { NotFound } from './pages/NotFound.jsx'

// HashRouter: GitHub Pages nu poate servi rute profunde fără configurare de server.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Collection />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/add" element={<AlbumFormPage mode="create" />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/album/:id/edit" element={<AlbumFormPage mode="edit" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
