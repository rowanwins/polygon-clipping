/* eslint-env jest */

const EventQueue = require('../src/event-queue')

const s = [[[[20, -23.5], [170, 74], [226.5, -113.5], [20, -23.5]]]]
const c = [[[[54.5, -170.5], [140.5, 33.5], [239.5, -198], [54.5, -170.5]]]]
const q = new EventQueue()
q.consume([s, c])

describe('event queue', () => {
  test('point 0', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([20, -23.5]) /* s[0][0] */
    expect(currentPoint.isLeft).toBeTruthy()
    expect(currentPoint.otherSE.point).toEqual([226.5, -113.5]) /* s[0][2] */
    expect(currentPoint.otherSE.isLeft).toBeFalsy()
  })

  test('point 1', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([20, -23.5]) /* s[0][0] */
    expect(currentPoint.isLeft).toBeTruthy()
    expect(currentPoint.otherSE.point).toEqual([170, 74]) /* s[0][1] */
    expect(currentPoint.otherSE.isLeft).toBeFalsy()
  })

  test('point 2', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([54.5, -170.5]) /* c[0][0] */
    expect(currentPoint.isLeft).toBeTruthy()
    expect(currentPoint.otherSE.point).toEqual([239.5, -198]) /* c[0][2] */
    expect(currentPoint.otherSE.isLeft).toBeFalsy()
  })

  test('point 3', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([54.5, -170.5]) /* c[0][0] */
    expect(currentPoint.isLeft).toBeTruthy()
    expect(currentPoint.otherSE.point).toEqual([140.5, 33.5]) /* c[0][1] */
    expect(currentPoint.otherSE.isLeft).toBeFalsy()
  })

  test('point 4', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([140.5, 33.5]) /* c[0][0] */
    expect(currentPoint.isLeft).toBeFalsy()
    expect(currentPoint.otherSE.point).toEqual([54.5, -170.5]) /* c[0][1] */
    expect(currentPoint.otherSE.isLeft).toBeTruthy()
  })

  test('point 5', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([140.5, 33.5]) /* c[0][0] */
    expect(currentPoint.isLeft).toBeTruthy()
    expect(currentPoint.otherSE.point).toEqual([239.5, -198]) /* c[0][1] */
    expect(currentPoint.otherSE.isLeft).toBeFalsy()
  })

  test('point 6', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([170, 74]) /* s[0][1] */
    expect(currentPoint.isLeft).toBeFalsy()
    expect(currentPoint.otherSE.point).toEqual([20, -23.5]) /* s[0][0] */
    expect(currentPoint.otherSE.isLeft).toBeTruthy()
  })

  test('point 7', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([170, 74]) /* s[0][1] */
    expect(currentPoint.isLeft).toBeTruthy()
    expect(currentPoint.otherSE.point).toEqual([226.5, -113.5]) /* s[0][3] */
    expect(currentPoint.otherSE.isLeft).toBeFalsy()
  })

  test('point 8', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([226.5, -113.5]) /* s[0][1] */
    expect(currentPoint.isLeft).toBeFalsy()
    expect(currentPoint.otherSE.point).toEqual([20, -23.5]) /* s[0][0] */
    expect(currentPoint.otherSE.isLeft).toBeTruthy()
  })

  test('point 9', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([226.5, -113.5]) /* s[0][1] */
    expect(currentPoint.isLeft).toBeFalsy()
    expect(currentPoint.otherSE.point).toEqual([170, 74]) /* s[0][0] */
    expect(currentPoint.otherSE.isLeft).toBeTruthy()
  })

  test('point 10', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([239.5, -198]) /* c[0][2] */
    expect(currentPoint.isLeft).toBeFalsy()
    expect(currentPoint.otherSE.point).toEqual([54.5, -170.5]) /* c[0][0] */
    expect(currentPoint.otherSE.isLeft).toBeTruthy()
  })

  test('point 11', () => {
    const currentPoint = q.pop()
    expect(currentPoint.point).toEqual([239.5, -198]) /* c[0][2] */
    expect(currentPoint.isLeft).toBeFalsy()
    expect(currentPoint.otherSE.point).toEqual([140.5, 33.5]) /* s[0][1] */
    expect(currentPoint.otherSE.isLeft).toBeTruthy()
  })
})
