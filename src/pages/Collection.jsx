import { useCollection, selectOwned } from '../store/collectionStore.js'
import { useUI } from '../store/uiStore.js'
import { seedAlbums } from '../lib/seed.js'
import { CollectionView } from '../components/CollectionView.jsx'
import { Button, EmptyState } from '../components/ui.jsx'
import { useI18n } from '../i18n/index.js'

export function Collection() {
  const { t } = useI18n()
  const owned = useCollection(selectOwned)
  const replaceAll = useCollection((s) => s.replaceAll)
  const toast = useUI((s) => s.toast)

  function loadDemo() {
    const albums = seedAlbums()
    replaceAll(albums)
    toast(t('data.demoToast', { count: albums.length }))
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">{t('collection.title')}</h1>
      <CollectionView
        albums={owned}
        emptyState={
          <EmptyState
            title={t('collection.empty.title')}
            description={t('collection.empty.body')}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button as="link" to="/add">
                  {t('collection.empty.add')}
                </Button>
                <Button variant="ghost" onClick={loadDemo}>
                  {t('collection.empty.demo')}
                </Button>
              </div>
            }
          />
        }
      />
    </>
  )
}
