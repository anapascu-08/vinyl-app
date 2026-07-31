import { Button, EmptyState } from '../components/ui.jsx'
import { useI18n } from '../i18n/index.js'

export function NotFound({ title, description }) {
  const { t } = useI18n()

  return (
    <EmptyState
      title={title ?? t('notFound.title')}
      description={description ?? t('notFound.body')}
      action={
        <Button as="link" to="/">
          {t('notFound.back')}
        </Button>
      }
    />
  )
}
