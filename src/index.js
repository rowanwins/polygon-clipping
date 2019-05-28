import {operation} from './operation'

export default {
  union: (geom, ...moreGeoms) =>
    operation.run('union', geom, moreGeoms),
  intersection: (geom, ...moreGeoms) =>
    operation.run('intersection', geom, moreGeoms),
  xor: (geom, ...moreGeoms) =>
    operation.run('xor', geom, moreGeoms),
  difference: (subjectGeom, ...clippingGeoms) =>
    operation.run('difference', subjectGeom, clippingGeoms),
}
