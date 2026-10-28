import { PDFParse } from "pdf-parse"
import fs from 'fs/promises'
import path from 'path'
import { expect } from 'chai'
import { PolicyPDF } from "../lib/PolicyPDF.mjs"

describe("The PDF parsing library", () => {
    it("Reads the text from the pdf file", async () => {
        const data = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon.pdf'))
        const parser = new PDFParse({ data })
        const text = await parser.getText()

        expect(text.pages[0].text).to.include(`SPECIAL CONSIDERATION PROCEDURE
SCOPE
This procedure applies to all Monash University staff, students and assessment in coursework units.
For assessment of the research component (e.g. thesis) of a graduate research degree, refer to the Graduate Research Thesis Examination
Procedures.`, 'Text did not include the spec con procedure text')
    })
})

describe("PolicyPDF.mjs", () => {
    it("Merges all pages into one string", async () => {
        const data = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon.pdf'))
        const text = await new PolicyPDF(data).getText()

        expect(text).to.include(`SPECIAL CONSIDERATION PROCEDURE
SCOPE
This procedure applies to all Monash University staff, students and assessment in coursework units.
`, 'Text did not include the spec con procedure text')

        expect(text).to.include(`Applying for special consideration
2.11. Eligible students must submit an application and supporting documentation via the special consideration application form as soon as
possible, but no later than 11.55pm (time zone of the unit location) on the due date of the affected assessment task.
`, 'Text did not include the spec con procedure text')
    })

    it("Removes page numbers from the text", async () => {
        const data = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon.pdf'))
        const text = await new PolicyPDF(data).getText()

        expect(text).not.to.include('Special Consideration Procedure | 6')
        expect(text).not.to.include('Special Consideration Procedure | 10')
    })

    it("Generates a SHA256 hash for files", async () => {
        const data = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon.pdf'))
        const hash = new PolicyPDF(data).getHash()

        expect(hash).equal('1abdd28ff7cb7aae63715e455d6d80118ad2cfac26f51ae549209e31dcb7f76a')
    })

    it("Should match a copy of itself", async () => {
        const data1 = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon.pdf'))
        const data2 = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon.pdf'))

        expect(new PolicyPDF(data1).isEqual(new PolicyPDF(data2))).to.be.true
    })

    it("Should not match a different file version", async () => {
        const data1 = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon.pdf'))
        const data2 = await fs.readFile(path.join(import.meta.dirname, 'res', 'SpecCon-8.1.pdf'))

        expect(new PolicyPDF(data1).isEqual(new PolicyPDF(data2))).to.be.false
    })
})