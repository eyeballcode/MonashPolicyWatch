import fs from 'fs/promises'
import path from 'path'
import MonashWebpage from './lib/MonashWebpage.mjs'

const webpages = {
    'SpecCircs': 'https://www.monash.edu/students/admin/fees/refunds-remission-credit/special-circumstances/',
    'SpecCircs-SuppDocs': 'https://www.monash.edu/students/admin/fees/refunds-remission-credit/special-circumstances/documents',
    'SpecCon': 'https://www.monash.edu/students/admin/assessments/extensions-special-consideration',
    'SpecCon-SuppDocs': 'https://www.monash.edu/students/admin/assessments/extensions-special-consideration/documents',
    'DeferExam': 'https://www.monash.edu/students/admin/assessments/extensions-special-consideration/defer'
}

const getWebpagePath = id => path.join(import.meta.dirname, 'webpages', `${id}.html`)

const readWebpage = async id => {
    try {
        return await fs.readFile(getWebpagePath(id))
    } catch (e) { console.log(e); return null }
}

const writeWebpage = async (id, data) => {
    try {
        return await fs.writeFile(getWebpagePath(id), data)
    } catch (e) { console.log(e); return null }
}

export const getWebpageChanges = async () => (await Promise.all(Object.keys(webpages).map(async webpageID => {
    const currentData = await readWebpage(webpageID)
    const latestData = await (await fetch(`${webpages[webpageID]}`)).text()

    if (!currentData) {
        await writeWebpage(webpageID, latestData)
        return null
    }

    const currentWebpage = new MonashWebpage({ data: currentData })
    const newWebpage = new MonashWebpage({ data: latestData })

    if (currentWebpage.isEqual(newWebpage)) return null

    const patch = currentWebpage.diff(newWebpage)
    await writeWebpage(webpageID, latestData)
    console.log('Updating', webpageID, 'to', latestData.toString().slice(0, 100))

    return patch
}))).filter(Boolean).join('\n\n')
