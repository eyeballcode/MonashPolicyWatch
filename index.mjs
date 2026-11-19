import { getProcedureChanges } from './check-procedures.mjs'
import { getWebpageChanges } from './check-webpages.mjs'
import { mail } from './mail.mjs'

const procedureChanges = await getProcedureChanges()
const webpageChanges = ''
// const webpageChanges = await getWebpageChanges()

const changes = (procedureChanges + '\n' + webpageChanges).trim()
if (changes.length > 0) {
    console.log(changes)
    await mail(`Policy Updates ${new Date().toLocaleString().split(',')[0]}`, changes.trim())
}