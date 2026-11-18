import fs from 'fs/promises'
import path from 'path'
import { expect } from 'chai'
import { MonashWebpage } from "../lib/MonashWebpage.mjs"

const procedureName = 'Supporting documents for special circumstances'

describe("The Webpage comparison library", () => {
    it("Extracts text from a webpage", async () => {
        const data = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCircs-SuppDocs-Aug25.html'))
        const parser = new MonashWebpage({ data })
        const text = await parser.getText()

        expect(text).to.include(`Supporting documents for special circumstances
Fee reversal and/or Withdrawn grade
When you apply for a fee reversal and/or a Withdrawn (WDN) grade, make sure you provide the correct supporting documents as evidence of your special circumstances. These documents are different from those required for a special consideration application.

Requirements`, 'Text did not include the spec circs webpage text')
    })
})
