import { ArgumentsCamelCase } from "yargs"
import { logger } from "../logger"
import { handler, QuerySearchArgv } from "./query-search"

jest.mock("../logger", () => ({
    logger: {
        prompt: jest.fn(),
        log: jest.fn(),
        error: jest.fn()
    }
}))

describe("QuerySearch CLI", () => {
    let loggerSpy: jest.SpyInstance

    const textContent =
        "Happy life: love, laughter, and simple moments.\nHappiness is found in the little things.\nA happy life is one filled with smiles.\nSavor the simple joys for a joyful life.\nIn simplicity, we discover true happiness."

    beforeEach(() => {
        jest.clearAllMocks()

        loggerSpy = jest.spyOn(logger, "log")
    })

    afterEach(() => {
        loggerSpy.mockRestore()
    })

    it("should print single line when matched with single", async () => {
        await handler({
            query: "joyful life",
            content: textContent
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                "4: Savor the simple joys for a joyful life."
            )
        )
    })

    it("should print multiple lines when matched with multiple", async () => {
        await handler({
            query: "happiness",
            content: textContent
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                "2: Happiness is found in the little things.\n5: In simplicity, we discover true happiness."
            )
        )
    })

    it("should print no matches when matched with none", async () => {
        await handler({
            query: "pizza",
            content: textContent
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining("No matches")
        )
    })
})
