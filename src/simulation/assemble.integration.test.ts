import { describe, it, expect } from "vitest";
import { assembleProgram } from "./Assemble";

describe("assembleProgram", () => {

    describe("arithmetic instructions", () => {
        it("assembles a floating point addition instruction", () => {
            const input = `
                fadd f0, f1, f2
            `

            expect(assembleProgram(input)).toEqual({
                ok: true,
                value: [
                    {
                        type: "arithmetic",
                        opcode: "add",
                        destination: 0,
                        source1: 1,
                        source2: 2
                    }
                ]
            })
        })

        it("assembles a floating point subtraction instruction", () => {
            const input = `
                fsub f0, f1, f2
            `

            expect(assembleProgram(input)).toEqual({
                ok: true,
                value: [
                    {
                        type: "arithmetic",
                        opcode: "sub",
                        destination: 0,
                        source1: 1,
                        source2: 2
                    }
                ]
            })
        })

        it("assembles a floating point multiplication instruction", () => {
            const input = `
                fmul f0, f1, f2
            `

            expect(assembleProgram(input)).toEqual({
                ok: true,
                value: [
                    {
                        type: "arithmetic",
                        opcode: "mul",
                        destination: 0,
                        source1: 1,
                        source2: 2
                    }
                ]
            })
        })

        it("assembles a floating point division instruction", () => {
            const input = `
                fdiv f0, f1, f2
            `

            expect(assembleProgram(input)).toEqual({
                ok: true,
                value: [
                    {
                        type: "arithmetic",
                        opcode: "div",
                        destination: 0,
                        source1: 1,
                        source2: 2
                    }
                ]
            })
        })
    })
})