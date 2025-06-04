import { transformPrice, convertToUSD } from '../lib/pricing'

describe('transformPrice', () => {
  it('returns 0 for invalid input', () => {
    expect(transformPrice('abc')).toBe(0)
  })

  it('applies 4.2x for prices below 20', () => {
    expect(transformPrice(10)).toBeCloseTo(42)
  })

  it('applies 3.2x for prices between 20 and 50 inclusive', () => {
    expect(transformPrice(20)).toBeCloseTo(64)
    expect(transformPrice(50)).toBeCloseTo(160)
  })

  it('applies 2.5x for prices above 50 and below 60', () => {
    expect(transformPrice(55)).toBeCloseTo(137.5)
  })

  it('applies 2x for prices >=60 and <106', () => {
    expect(transformPrice(70)).toBeCloseTo(140)
  })

  it('applies 1.5x for prices >=106', () => {
    expect(transformPrice(110)).toBeCloseTo(165)
  })
})

describe('convertToUSD', () => {
  it('returns empty string for invalid input', () => {
    expect(convertToUSD('abc' as any, 0.2)).toBe('')
  })

  it('converts BRL to USD using provided rate and rounds up to one decimal', () => {
    expect(convertToUSD(50, 0.2)).toBe('10.0')
  })
})

