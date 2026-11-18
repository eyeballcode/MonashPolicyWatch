import fs from 'fs/promises'
import path from 'path'
import { expect } from 'chai'
import MonashWebpage from "../lib/MonashWebpage.mjs"

describe("The Webpage comparison library", () => {
    it("Extracts text from a webpage", async () => {
        const data = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCircs-SuppDocs-Nov26.html'))
        const parser = new MonashWebpage({ data })
        const text = parser.getText()

        expect(text).to.include(`Supporting documents for special circumstances

Fee reversal and/or Withdrawn grade

When you apply for a fee reversal and/or a Withdrawn (WDN) grade, make sure you provide the correct supporting documents as evidence of your special circumstances. These documents are different from those required for a special consideration application.

Requirements`, 'Text did not include the spec circs webpage text')
    })

    it("Create a diff between 2 versinos", async () => {
        const aug25 = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCircs-SuppDocs-Aug25.html'))
        const nov26 = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCircs-SuppDocs-Nov26.html'))

        const diff = await new MonashWebpage({ data: aug25 }).diff(new MonashWebpage({ data: nov26 }))

        expect(diff).to.include('-* state when the change was communicated to you, and')
        expect(diff).to.include('+* state when the change was first communicated to you')
    })
})
