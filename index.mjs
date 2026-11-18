import { getProcedureChanges } from './check-procedures.mjs'
import { mail } from './mail.mjs'

const procedureChanges = await getProcedureChanges()

if (procedureChanges.length > 0) {
    console.log(changes)
    await mail(`Policy Updates ${new Date().toLocaleString().split(',')[0]}`, changes)
}