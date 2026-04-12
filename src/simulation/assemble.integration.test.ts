import { describe, it, expect } from "vitest";
import { assembleProgram } from "./Assemble";

describe("assembleProgram", () => {

    describe("arithmetic instructions", () => {
        it("assembles a floating point addition instruction", () => {
            const input = `fadd f0, f1, f2`

            expect(assembleProgram(input, 4)).toEqual({
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
            const input = `fsub f0, f1, f2`

            expect(assembleProgram(input, 4)).toEqual({
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
            const input = `fmul f0, f1, f2`

            expect(assembleProgram(input, 4)).toEqual({
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
            const input = `fdiv f0, f1, f2`

            expect(assembleProgram(input, 4)).toEqual({
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

    describe("memory instructions", () => {
        it("assembles a load instruction", () => {
            const input = `ld f0, 0(f1)`

            expect(assembleProgram(input, 4)).toEqual({
                ok: true,
                value: [
                    {
                        type: "memory",
                        opcode: "ld",
                        register: 0,
                        offset: 0,
                        baseRegister: 1
                    }
                ]
            })
        })

        it("assembles a store instruction", () => {
            const input = `st f0, 0(f1)`

            expect(assembleProgram(input, 4)).toEqual({
                ok: true,
                value: [
                    {
                        type: "memory",
                        opcode: "st",
                        register: 0,
                        offset: 0,
                        baseRegister: 1
                    }
                ]
            })
        })
    })

    describe("Assembling all possible instructions", () => {
        it("assembles a load instruction", () => {
            const input = `
                ld f0, 2(f1)
                ld f2, 5(f3)
                st f2, 3(f3)
                ld f1, -4(f0)

                fadd f0, f1, f2
                fsub f1, f2, f3
                fmul f2, f3, f0
                fdiv f3, f0, f1
            `

            expect(assembleProgram(input, 4)).toEqual({
                ok: true,
                value: [
                    {
                        type: "memory",
                        opcode: "ld",
                        register: 0,
                        offset: 2,
                        baseRegister: 1
                    },
                    {
                        type: "memory",
                        opcode: "ld",
                        register: 2,
                        offset: 5,
                        baseRegister: 3
                    },
                    {
                        type: "memory",
                        opcode: "st",
                        register: 2,
                        offset: 3,
                        baseRegister: 3
                    },
                    {
                        type: "memory",
                        opcode: "ld",
                        register: 1,
                        offset: -4,
                        baseRegister: 0
                    },
                    {
                        type: "arithmetic",
                        opcode: "add",
                        destination: 0,
                        source1: 1,
                        source2: 2
                    },
                    {
                        type: "arithmetic",
                        opcode: "sub",
                        destination: 1,
                        source1: 2,
                        source2: 3
                    },
                    {
                        type: "arithmetic",
                        opcode: "mul",
                        destination: 2,
                        source1: 3,
                        source2: 0
                    },
                    {
                        type: "arithmetic",
                        opcode: "div",
                        destination: 3,
                        source1: 0,
                        source2: 1
                    }
                ]
            })
        })
    })

    describe("errors", () => {
        it("returns an empty program error when the program is empty", () => {
            const input = ``

            expect(assembleProgram(input, 4)).toEqual({
                ok: false,
                error: {
                    code: "EMPTY_PROGRAM"
                }
            })
        })

        it("returns an invalid instruction error for gibberish", () => {
            const input = `beep beep, I'm a sheep`

            expect(assembleProgram(input, 4)).toEqual({
                ok: false,
                error: {
                    code: "INVALID_INSTRUCTION",
                    line: 1,
                    text: "beep beep, I'm a sheep"
                }
            })
        })

        it("returns an invalid instruction error for invalid instruction", () => {
            const input = `str f0, 0(f1)`

            expect(assembleProgram(input, 4)).toEqual({
                ok: false,
                error: {
                    code: "INVALID_INSTRUCTION",
                    line: 1,
                    text: "str f0, 0(f1)"
                }
            })
        })

        it("returns the invalid register when a register exceeds the register file size", () => {
            const input = `fadd f0, f1, f4`

            expect(assembleProgram(input, 4)).toEqual({
                ok: false,
                error: {
                    code: "INVALID_REGISTER",
                    line: 1,
                    register: 4,
                    registerFileSize: 4
                }
            })
        })

        it("returns the invalid register when destination register is invalid", () => {
            const input = `fadd f5, f1, f2`

            expect(assembleProgram(input, 4)).toEqual({
                ok: false,
                error: {
                    code: "INVALID_REGISTER",
                    line: 1,
                    register: 5,
                    registerFileSize: 4
                }
            })
        })

        it("returns the invalid register when base register is invalid in memory instruction", () => {
            const input = `ld f0, 5(f5)`

            expect(assembleProgram(input, 4)).toEqual({
                ok: false,
                error: {
                    code: "INVALID_REGISTER",
                    line: 1,
                    register: 5,
                    registerFileSize: 4
                }
            })
        })

        it("returns the invalid register even when there are valid instructions before it.", () => {
            const input = `
                fadd f0, f1, f2
                fsub f0, f1, f2
                ld f0, 5(f5)
            `

            expect(assembleProgram(input, 4)).toEqual({
                ok: false,
                error: {
                    code: "INVALID_REGISTER",
                    line: 3,
                    register: 5,
                    registerFileSize: 4
                }
            })
        })

        it("accepts registers up to registerFileSize - 1", () => {
            const input = `fadd f3, f2, f1`

            expect(assembleProgram(input, 4)).toEqual({
                ok: true,
                value: [
                    {
                        type: "arithmetic",
                        opcode: "add",
                        destination: 3,
                        source1: 2,
                        source2: 1
                    }
                ]
            })
        })
    })
})

