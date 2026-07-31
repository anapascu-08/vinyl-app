import { useNavigate } from 'react-router-dom'
import { useCollection, selectWishlist } from '../store/collectionStore.js'
import { useUI } from '../store/uiStore.js'
import { CollectionView } from '../components/CollectionView.jsx'
import { Button, EmptyState } from '../components/ui.jsx'
import { useI18n } from '../i18n/index.js'

export function Wishlist() {
  const { t } = useI18n()
  const wishlist = useCollection(selectWishlist)
  const moveToCollection = useCollection((s) => s.moveToCollection)
  const toast = useUI((s) => s.toast)
  const navigate = useNavigate()

  function buy(album) {
    moveToCollection(album.id)
    toast(t('wishlist.boughtToast', { title: album.title }))
    navigate(`/album/${album.id}/edit#purchase`)
  }

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold">{t('wishlist.title')}</h1>
      <p className="mb-6 text-sm text-ink-700">{t('wishlist.subtitle')}</p>
      <CollectionView
        albums={wishlist}
        cardAction={(album) => (
          <Button variant="ghost" className="mt-2 w-full" onClick={() => buy(album)}>
            {t('wishlist.bought')}
          </Button>
        )}
        emptyState={
          <EmptyState
            title={t('wishlist.empty.title')}
            description={t('wishlist.empty.body')}
            action={
              <Button as="link" to="/add">
                {t('wishlist.empty.add')}
              </Button>
            }
          />
        }
      />
    </>
  )
}
