// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateRoute(key) {
  const hasKey = this.$te('route.' + key)
  const translatedTitle = this.$t('route.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}

//get Store Monitor page language
export function generatePatrolLang(key){
  const hasKey = this.$te('remotePatrol.' + key)
  const translatedTitle = this.$t('remotePatrol.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}

//get Store Monitor page language
export function generateStoreMonitorLang(key){
  const hasKey = this.$te('storeMonitor.' + key)
  const translatedTitle = this.$t('storeMonitor.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}

//get Report Management page language
export function generateReportLang(key){
  const hasKey = this.$te('reportView.' + key)
  const translatedTitle = this.$t('reportView.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}

//get Event Management page language
export function generateEventLang(key){
  const hasKey = this.$te('eventView.' + key)
  const translatedTitle = this.$t('eventView.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}
//get Inspection setting page language
export function generateInsSettingLang(key){
  const hasKey = this.$te('insSettingView.' + key)
  const translatedTitle = this.$t('insSettingView.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}
//get Device Management page language
export function generateDeviceLang(key) {
  const hasKey = this.$te('deviceView.' + key)
  const translatedTitle = this.$t('deviceView.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}

//get Store Management page language
export function generateStoreLang(key) {
  const hasKey = this.$te('storeView.' + key)
  const translatedTitle = this.$t('storeView.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}

//get Schdedule Management page language
export function generateScheduleLang(key) {
  const hasKey = this.$te('scheduleView.' + key)
  const translatedTitle = this.$t('scheduleView.' + key) // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return key
}
