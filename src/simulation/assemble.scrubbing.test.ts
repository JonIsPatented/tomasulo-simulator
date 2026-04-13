import { describe, it, expect } from 'vitest'
import { scrubProgram } from './Assemble'

describe('scrubProgram', () => {
  describe('block comments', () => {
    it('removes a block comment on its own line', () => {
      const input = `
                fadd f0, f1, f2
                /* remove this */
                fmul f3, f4, f5
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fmul f3, f4, f5',
      ])
    })

    it('removes a block comment at the beginning of the program', () => {
      const input = `
                /* header comment */
                fadd f0, f1, f2
                fmul f3, f4, f5
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fmul f3, f4, f5',
      ])
    })

    it('removes a block comment at the end of the program', () => {
      const input = `
                fadd f0, f1, f2
                fmul f3, f4, f5
                /* footer comment */
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fmul f3, f4, f5',
      ])
    })

    it('removes a multi-line block comment', () => {
      const input = `
                fadd f0, f1, f2
                /*
                    Very cool and descriptive
                    block comment
                */
                fmul f3, f4, f5
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fmul f3, f4, f5',
      ])
    })

    it('removes multiple block comments', () => {
      const input = `
                /* first */
                fadd f0, f1, f2
                /* second */
                fmul f3, f4, f5
                /* third */
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fmul f3, f4, f5',
      ])
    })

    it('returns an empty array when the program is only a block comment', () => {
      const input = `
                /*
                    This program is about as useful as my life
                */
            `

      expect(scrubProgram(input)).toEqual([])
    })
  })

  describe('line comments', () => {
    it('removes // comments', () => {
      const input = `
                fadd f0, f1, f2 // add instruction
                fmul f3, f4, f5
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fmul f3, f4, f5',
      ])
    })

    it('removes # comments', () => {
      const input = `
                fsub f0, f1, f2 # subtract
                fdiv f3, f4, f5
            `

      expect(scrubProgram(input)).toEqual([
        'fsub f0, f1, f2',
        'fdiv f3, f4, f5',
      ])
    })

    it('removes ; comments', () => {
      const input = `
                fmul f0, f1, f2 ; multiply
                fadd f3, f4, f5
            `

      expect(scrubProgram(input)).toEqual([
        'fmul f0, f1, f2',
        'fadd f3, f4, f5',
      ])
    })

    it('removes singleline comments', () => {
      const input = `
                // comment
                # comment
                ; comment
                fadd f0, f1, f2
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
      ])
    })

    it('handles mixed comment styles in one program', () => {
      const input = `
                fadd f0, f1, f2 // comment
                fsub f3, f4, f5 # comment
                fmul f6, f7, f8 ; comment
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fsub f3, f4, f5',
        'fmul f6, f7, f8',
      ])
    })

    it('returns empty array when only line comments are present', () => {
      const input = `
                // comment
                # comment
                ; comment
            `

      expect(scrubProgram(input)).toEqual([])
    })
  })

  describe('comma spacing', () => {
    it('adds a space after commas when none are present', () => {
      const input = `
                    fadd f0,f1,f2
                `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
      ])
    })

    it('removes spaces before commas', () => {
      const input = `
                    fadd f0 ,f1 ,f2
                `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
      ])
    })

    it('normalizes uneven spacing around commas', () => {
      const input = `
                    fmul f3  ,   f4,f5
                `

      expect(scrubProgram(input)).toEqual([
        'fmul f3, f4, f5',
      ])
    })

    it('normalizes comma spacing for multiple instructions', () => {
      const input = `
                    fadd f0,f1,f2
                    fsub f3 ,f4,  f5
                    fmul f6  ,  f7 ,f8
                `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fsub f3, f4, f5',
        'fmul f6, f7, f8',
      ])
    })
  })

  describe('parentheses spacing', () => {
    it('removes spaces after opening parenthesis', () => {
      const input = `
                    ld f0, 8( x1)
                `

      expect(scrubProgram(input)).toEqual(['ld f0, 8(x1)'])
    })

    it('removes spaces before closing parenthesis', () => {
      const input = `
                    ld f0, 8(x1 )
                `

      expect(scrubProgram(input)).toEqual(['ld f0, 8(x1)'])
    })

    it('removes spaces on both sides inside parentheses', () => {
      const input = `
                    ld f0, 8( x1 )
                `

      expect(scrubProgram(input)).toEqual(['ld f0, 8(x1)'])
    })

    it('normalizes parentheses spacing for multiple memory instructions', () => {
      const input = `
                    ld f0, 8( x1 )
                    st f2, 16(x3 )
                    ld f4, 24( x5)
                `

      expect(scrubProgram(input)).toEqual([
        'ld f0, 8(x1)',
        'st f2, 16(x3)',
        'ld f4, 24(x5)',
      ])
    })

    it("doesn't modify already-normalized parentheses", () => {
      const input = `
                    ld f0, 8(x1)
                    st f2, 16(x3)
                `

      expect(scrubProgram(input)).toEqual([
        'ld f0, 8(x1)',
        'st f2, 16(x3)',
      ])
    })
  })

  describe('collapsing whitespace', () => {
    it('collapses multiple spaces between opcode and operands', () => {
      const input = `
            fadd    f0, f1, f2
            `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
      ])
    })

    it('collapses multiple spaces between operands', () => {
      const input = `
            fmul f3,    f4,     f5
        `

      expect(scrubProgram(input)).toEqual([
        'fmul f3, f4, f5',
      ])
    })

    it('collapses whitespace in memory instructions', () => {
      const input = `
            ld    f0, 8(x1)
            st     f2, 16(x3)
        `

      expect(scrubProgram(input)).toEqual([
        'ld f0, 8(x1)',
        'st f2, 16(x3)',
      ])
    })

    it('collapses whitespace across multiple instructions', () => {
      const input = `
            fadd    f0, f1, f2
            fsub     f3, f4, f5
            fmul      f6, f7, f8
        `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fsub f3, f4, f5',
        'fmul f6, f7, f8',
      ])
    })

    it('leaves already-normalized whitespace unchanged', () => {
      const input = `
            fadd f0, f1, f2
            fmul f3, f4, f5
        `

      expect(scrubProgram(input)).toEqual([
        'fadd f0, f1, f2',
        'fmul f3, f4, f5',
      ])
    })
  })

  it('Testing an entire program', () => {
    const input = `
        /* program header comment */

        fadd    f0 ,f1  ,   f2      // add values

        fsub f3,f4 ,f5              # subtract values

        /*
            multi-line
            block comment
        */

        ld    f6 ,  8( x1 )         ; load value
        st f7,16( x2 )              // store value

            fmul     f8 ,   f9,f10

        /* inline block comment area */ fdiv   f11 , f12 ,   f13

        ; full line comment
        # another full line comment
        // another one - Drake
    `

    expect(scrubProgram(input)).toEqual([
      'fadd f0, f1, f2',
      'fsub f3, f4, f5',
      'ld f6, 8(x1)',
      'st f7, 16(x2)',
      'fmul f8, f9, f10',
      'fdiv f11, f12, f13',
    ])
  })
})
