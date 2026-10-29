import fs from 'fs/promises'
import path from 'path'
import { PolicyPDF } from './lib/PolicyPDF.mjs'
import { mail } from './mail.mjs'

const procedureIDs = {
    1935756: "Assessment Regime Procedure",
    1935759: "Credit Procedure",
    1935752: "Marking & Feedback Procedure",
    1935760: "Scheduled Final Assessments Procedure",
    1935761: "Spec Con Procedure",
    1935762: "AcInt Procedure",
    1935771: "Coursework Enrolment Procedure",
    1935798: "Academic Progress Procedure",
    1935787: "APC Procedure",
    1935799: "Exclusions Appeals Procedure",
    1935789: "Complaints Procedure",
    2734556: "Support for Students Procedure"
}

const baseURL = `https://publicpolicydms.monash.edu/Monash/documents/`

const getProcedurePath = id => path.join(import.meta.dirname, 'procedures', `${id}.pdf`)

const readProcedure = async id => {
    try {
        return await fs.readFile(getProcedurePath(id))
    } catch (e) { return null }
}

const writeProcedure = async (id, data) => {
    try {
        return await fs.writeFile(getProcedurePath(id), data)
    } catch (e) { return null }
}

const changes = (await Promise.all(Object.keys(procedureIDs).map(async procedureID => {
    const currentData = await readProcedure(procedureID)
    const latestData = Buffer.from(await (await fetch(`${baseURL}${procedureID}`)).arrayBuffer())

    if (!currentData) {
        await writeProcedure(procedureID, latestData)
        return null
    }

    const currentProcedure = new PolicyPDF(currentData, procedureIDs[procedureID])
    const newProcedure = new PolicyPDF(latestData, procedureIDs[procedureID])

    if (await currentProcedure.isEqual(newProcedure)) return null

    const patch = await currentProcedure.diff(newProcedure)
    await writeProcedure(procedureID, latestData)

    return patch
}))).filter(Boolean).join('\n\n')

if (changes.length > 0) {
    console.log(changes)
    await mail(`Policy Updates ${new Date().toLocaleString().split(',')[0]}`, changes)
}