const { cmpPoints } = require('./flp')
const { compareVectorAngles } = require('./vector')

class Ring {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory (allSegments) {
    const ringsOut = []

    for (let i = 0, iMax = allSegments.length; i < iMax; i++) {
      const segment = allSegments[i]
      if (!segment.isInResult || segment.ringOut) continue

      let prevEvent = null
      let event = segment.leftSE
      let nextEvent = segment.rightSE
      const tmpRingOut = {} // temporarily mark a segment as spoken for
      const events = [event]

      /* Walk the chain of linked events to form a closed ring */
      while (true) {
        prevEvent = event
        event = nextEvent

        events.push(event)
        event.segment.registerRingOut(tmpRingOut)

        const linkedEvents = event.getAvailableLinkedEvents()
        if (linkedEvents.length === 0) break
        if (linkedEvents.length === 1) nextEvent = linkedEvents[0].otherSE
        if (linkedEvents.length > 1) {
          const comparator = event.getLeftmostComparator(prevEvent)
          nextEvent = linkedEvents.sort(comparator)[0].otherSE
        }
      }

      const firstPt = events[0].point
      const lastPt = events[events.length - 1].point
      if (cmpPoints(firstPt, lastPt) !== 0) {
        throw new Error(
          `Unable to complete output ring starting at [${firstPt}].` +
            ` Last matching segment found ends at [${lastPt}].`
        )
      }

      ringsOut.push(new Ring(events))
    }
    return ringsOut
  }

  constructor (events) {
    this.events = events
    for (let i = 0, iMax = events.length; i < iMax; i++) {
      events[i].segment.registerRingOut(this)
    }
    this.poly = null
    this._clearCache()
  }

  registerPoly (poly) {
    this.poly = poly
  }

  getGeom () {
    // TODO: not true soon??
    // Remove superfluous points (ie extra points along a straight line),
    // Note that the starting/ending point doesn't need to be considered,
    // as the sweep line trace gaurantees it to be not in the middle
    // of a straight segment.
    const points = [this.events[0].point]
    for (let i = 1, iMax = this.events.length - 1; i < iMax; i++) {
      const prevPt = this.events[i - 1].point
      const pt = this.events[i].point
      const nextPt = this.events[i + 1].point
      if (compareVectorAngles(pt, prevPt, nextPt) === 0) continue
      points.push(pt)
    }
    points.push(this.events[this.events.length - 1].point)
    return this.isExteriorRing ? points : points.reverse()
  }

  get enclosingRing () {
    return this._getCached('enclosingRing')
  }

  get isExteriorRing () {
    return this._getCached('isExteriorRing')
  }

  _clearCache () {
    this._cache = {}
  }

  _getCached (propName, calcMethod) {
    // if this._cache[something] isn't set, fill it with this._something()
    if (this._cache[propName] === undefined) {
      this._cache[propName] = this[`_${propName}`].bind(this)()
    }
    return this._cache[propName]
  }

  _isExteriorRing () {
    if (!this.enclosingRing) return true
    if (!this.enclosingRing.enclosingRing) return false
    // an island in hole is a whole new polygon
    return this.enclosingRing.enclosingRing.isExteriorRing
  }

  /* Returns the ring that encloses this one, if any */
  _enclosingRing () {
    let prevSeg = this.events[0].segment.prevInResult
    let prevPrevSeg = prevSeg ? prevSeg.prevInResult : null

    while (true) {
      // no segment found, thus no ring can enclose us
      if (!prevSeg) return null

      // no segments below prev segment found, thus the ring of the prev
      // segment must loop back around and enclose us
      if (!prevPrevSeg) return prevSeg.ringOut

      // if the two segments are of different rings, the ring of the prev
      // segment must either loop around us or the ring of the prev prev
      // seg, which would make us and the ring of the prev peers
      if (prevPrevSeg.ringOut !== prevSeg.ringOut) {
        if (prevPrevSeg.ringOut.enclosingRing !== prevSeg.ringOut) {
          return prevSeg.ringOut
        } else return prevSeg.ringOut.enclosingRing
      }

      // two segments are from the same ring, so this was a penisula
      // of that ring. iterate downward, keep searching
      prevSeg = prevPrevSeg.prevInResult
      prevPrevSeg = prevSeg ? prevSeg.prevInResult : null
    }
  }
}

class Poly {
  constructor (exteriorRing) {
    this.exteriorRing = exteriorRing
    exteriorRing.registerPoly(this)
    this.interiorRings = []
  }

  addInterior (ring) {
    this.interiorRings.push(ring)
    ring.registerPoly(this)
  }

  getGeom () {
    const geom = [this.exteriorRing.getGeom()]
    for (let i = 0, iMax = this.interiorRings.length; i < iMax; i++) {
      geom.push(this.interiorRings[i].getGeom())
    }
    return geom
  }
}

class MultiPoly {
  constructor (rings) {
    this.rings = rings
    this.polys = this._composePolys(rings)
  }

  getGeom () {
    const geom = []
    for (let i = 0, iMax = this.polys.length; i < iMax; i++) {
      geom.push(this.polys[i].getGeom())
    }
    return geom
  }

  _composePolys (rings) {
    const polys = []
    for (let i = 0, iMax = rings.length; i < iMax; i++) {
      const ring = rings[i]
      if (ring.poly) return
      if (ring.isExteriorRing) polys.push(new Poly(ring))
      else {
        if (!ring.enclosingRing.poly) polys.push(new Poly(ring.enclosingRing))
        ring.enclosingRing.poly.addInterior(ring)
      }
    }
    return polys
  }
}

module.exports = { Ring, Poly, MultiPoly }
