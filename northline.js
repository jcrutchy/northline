/* Northline — vanilla JavaScript CAD. No libraries, no build step, no server.
   Open index.html in a browser. This file is one classic script so it also
   works from a local file (file://), not only from a web server.
*/
(function (root) {
  "use strict";
  var cache = Object.create(null);
  var factories = Object.create(null);
  function req(spec) {
    var id = spec.replace(/^\.\//, "").replace(/\.js$/, ".ts");
    if (!/\.ts$/.test(id)) id += ".ts";
    var hit = cache[id];
    if (hit) return hit.exports;
    var factory = factories[id];
    if (!factory) throw new Error("Missing module " + spec);
    var module = { exports: {} };
    cache[id] = module;
    factory(module.exports, req, module);
    return module.exports;
  }

  factories["math.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EMPTY = exports.TAU = void 0;
    exports.pt = pt;
    exports.add = add;
    exports.sub = sub;
    exports.mul = mul;
    exports.dot = dot;
    exports.cross = cross;
    exports.len = len;
    exports.dist = dist;
    exports.norm = norm;
    exports.lerp = lerp;
    exports.rot = rot;
    exports.angOf = angOf;
    exports.normAng = normAng;
    exports.ccwSweep = ccwSweep;
    exports.angInSweep = angInSweep;
    exports.clamp = clamp;
    exports.fmt = fmt;
    exports.boxEmpty = boxEmpty;
    exports.boxAdd = boxAdd;
    exports.boxUnion = boxUnion;
    exports.boxCenter = boxCenter;
    exports.pointInBox = pointInBox;
    exports.boxInside = boxInside;
    exports.boxIntersects = boxIntersects;
    exports.boxFromCorners = boxFromCorners;
    exports.expandBox = expandBox;
    exports.TAU = Math.PI * 2;
    function pt(x, y) {
        return { x, y };
    }
    function add(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    function sub(a, b) {
        return { x: a.x - b.x, y: a.y - b.y };
    }
    function mul(a, s) {
        return { x: a.x * s, y: a.y * s };
    }
    function dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    function cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    function len(a) {
        return Math.hypot(a.x, a.y);
    }
    function dist(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
    function norm(a) {
        const l = len(a);
        if (l < 1e-15)
            return { x: 0, y: 0 };
        return { x: a.x / l, y: a.y / l };
    }
    function lerp(a, b, t) {
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    function rot(a, ang) {
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
    }
    function angOf(a) {
        return Math.atan2(a.y, a.x);
    }
    function normAng(a) {
        const t = a % exports.TAU;
        return t < 0 ? t + exports.TAU : t;
    }
    /** CCW sweep from a0 to a1, in (0, 2π]. A zero difference is a full turn. */
    function ccwSweep(a0, a1) {
        const s = normAng(a1 - a0);
        return s < 1e-12 ? exports.TAU : s;
    }
    function angInSweep(a, a0, sweep, eps = 1e-6) {
        if (sweep >= exports.TAU - 1e-8)
            return true;
        const d = normAng(a - a0);
        return d <= sweep + eps || d >= exports.TAU - eps;
    }
    function clamp(n, a, b) {
        return Math.max(a, Math.min(b, n));
    }
    function fmt(n, prec = 4) {
        if (!Number.isFinite(n))
            return "—";
        const v = Math.round(n * 10 ** prec) / 10 ** prec;
        return v.toFixed(prec);
    }
    exports.EMPTY = { minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity };
    function boxEmpty(b) {
        return !(b.minx <= b.maxx && b.miny <= b.maxy);
    }
    function boxAdd(b, p, pad = 0) {
        return {
            minx: Math.min(b.minx, p.x - pad),
            miny: Math.min(b.miny, p.y - pad),
            maxx: Math.max(b.maxx, p.x + pad),
            maxy: Math.max(b.maxy, p.y + pad),
        };
    }
    function boxUnion(a, b) {
        if (boxEmpty(a))
            return b;
        if (boxEmpty(b))
            return a;
        return {
            minx: Math.min(a.minx, b.minx),
            miny: Math.min(a.miny, b.miny),
            maxx: Math.max(a.maxx, b.maxx),
            maxy: Math.max(a.maxy, b.maxy),
        };
    }
    function boxCenter(b) {
        return { x: (b.minx + b.maxx) / 2, y: (b.miny + b.maxy) / 2 };
    }
    function pointInBox(p, b, eps = 0) {
        return p.x >= b.minx - eps && p.x <= b.maxx + eps && p.y >= b.miny - eps && p.y <= b.maxy + eps;
    }
    function boxInside(inner, outer) {
        return inner.minx >= outer.minx && inner.miny >= outer.miny && inner.maxx <= outer.maxx && inner.maxy <= outer.maxy;
    }
    function boxIntersects(a, b) {
        return a.minx <= b.maxx && a.maxx >= b.minx && a.miny <= b.maxy && a.maxy >= b.miny;
    }
    function boxFromCorners(a, b) {
        return {
            minx: Math.min(a.x, b.x),
            miny: Math.min(a.y, b.y),
            maxx: Math.max(a.x, b.x),
            maxy: Math.max(a.y, b.y),
        };
    }
    function expandBox(b, m) {
        return { minx: b.minx - m, miny: b.miny - m, maxx: b.maxx + m, maxy: b.maxy + m };
    }

  };

  factories["aci.ts"] = function (exports, require, module) {

    /** AutoCAD Color Index → RGB. 1–255, with 0 and 256 left to the caller (byblock / bylayer). */
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ACI_SWATCHES = void 0;
    exports.aciRgb = aciRgb;
    exports.aciHex = aciHex;
    exports.nearestAci = nearestAci;
    const LEVELS = [255, 204, 153, 127, 76];
    const FIXED = {
        1: [255, 0, 0],
        2: [255, 255, 0],
        3: [0, 255, 0],
        4: [0, 255, 255],
        5: [0, 0, 255],
        6: [255, 0, 255],
        7: [255, 255, 255],
        8: [128, 128, 128],
        9: [192, 192, 192],
        250: [51, 51, 51],
        251: [91, 91, 91],
        252: [132, 132, 132],
        253: [173, 173, 173],
        254: [214, 214, 214],
        255: [255, 255, 255],
    };
    function hueRGB(h) {
        const q = Math.floor(h / 4);
        const m = h % 4;
        const rise = [0, 63, 127, 191][m] ?? 0;
        const fall = [255, 191, 127, 63][m] ?? 255;
        switch (q) {
            case 0:
                return [255, rise, 0];
            case 1:
                return [fall, 255, 0];
            case 2:
                return [0, 255, rise];
            case 3:
                return [0, fall, 255];
            case 4:
                return [rise, 0, 255];
            default:
                return [255, 0, fall];
        }
    }
    const TABLE = [];
    function build() {
        for (let i = 0; i < 256; i++)
            TABLE.push([255, 255, 255]);
        for (let i = 1; i <= 9; i++)
            TABLE[i] = FIXED[i];
        for (let i = 250; i <= 255; i++)
            TABLE[i] = FIXED[i];
        for (let index = 10; index <= 249; index++) {
            const n = index - 10;
            const hue = hueRGB(Math.floor(n / 10));
            const s = n % 10;
            const level = LEVELS[Math.floor(s / 2)] ?? 255;
            const even = [
                Math.round((hue[0] * level) / 255),
                Math.round((hue[1] * level) / 255),
                Math.round((hue[2] * level) / 255),
            ];
            TABLE[index] =
                s % 2 === 0
                    ? even
                    : [
                        Math.floor((level + even[0]) / 2),
                        Math.floor((level + even[1]) / 2),
                        Math.floor((level + even[2]) / 2),
                    ];
        }
    }
    build();
    function aciRgb(index) {
        const i = Math.max(1, Math.min(255, index | 0));
        return TABLE[i] ?? [255, 255, 255];
    }
    function aciHex(index, color7 = "#f4f1ea") {
        if ((index | 0) === 7)
            return color7;
        const [r, g, b] = aciRgb(index);
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
    /** Nearest ACI 1–255 for an arbitrary hex, used when a file carries truecolor. */
    function nearestAci(r, g, b) {
        let best = 7;
        let bestD = Infinity;
        for (let i = 1; i <= 255; i++) {
            const c = TABLE[i];
            const d = (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2;
            if (d < bestD) {
                bestD = d;
                best = i;
            }
        }
        return best;
    }
    exports.ACI_SWATCHES = [
        { aci: 1, name: "Red" },
        { aci: 2, name: "Yellow" },
        { aci: 3, name: "Green" },
        { aci: 4, name: "Cyan" },
        { aci: 5, name: "Blue" },
        { aci: 6, name: "Magenta" },
        { aci: 7, name: "White" },
        { aci: 8, name: "Gray" },
        { aci: 9, name: "Silver" },
        { aci: 30, name: "Orange" },
        { aci: 40, name: "Gold" },
        { aci: 140, name: "Sky" },
        { aci: 150, name: "Navy" },
    ];

  };

  factories["geom.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.angOf = void 0;
    exports.leftNorm = leftNorm;
    exports.bulgeArc = bulgeArc;
    exports.arcPoint = arcPoint;
    exports.circumcircle = circumcircle;
    exports.arcThrough = arcThrough;
    exports.lineIntersect = lineIntersect;
    exports.projParam = projParam;
    exports.closestOnSeg = closestOnSeg;
    exports.lineCircle = lineCircle;
    exports.circleCircle = circleCircle;
    exports.curveHits = curveHits;
    exports.segHitsBox = segHitsBox;
    exports.pointInPoly = pointInPoly;
    exports.tessellate = tessellate;
    exports.polyCurves = polyCurves;
    exports.offsetLine = offsetLine;
    exports.offsetOpenPoly = offsetOpenPoly;
    exports.offsetClosedPoly = offsetClosedPoly;
    exports.sideOfPoly = sideOfPoly;
    exports.filletLines = filletLines;
    exports.chamferLines = chamferLines;
    exports.trimParamLine = trimParamLine;
    exports.extendLineTo = extendLineTo;
    exports.mirrorPoint = mirrorPoint;
    exports.mirrorVector = mirrorVector;
    exports.tangentPoints = tangentPoints;
    exports.arcBox = arcBox;
    exports.closestOnCurve = closestOnCurve;
    exports.rayHits = rayHits;
    exports.angleDiff = angleDiff;
    exports.collinear = collinear;
    const math_ts_1 = require("./math.ts");
    Object.defineProperty(exports, "angOf", { enumerable: true, get: function () { return math_ts_1.angOf; } });
    function leftNorm(a, b) {
        return (0, math_ts_1.norm)({ x: -(b.y - a.y), y: b.x - a.x });
    }
    /** Signed bulge → arc. Sweep is signed (CCW positive). */
    function bulgeArc(p1, p2, bulge) {
        if (!Number.isFinite(bulge) || Math.abs(bulge) < 1e-12)
            return null;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const cLen = Math.hypot(dx, dy);
        if (cLen < 1e-12)
            return null;
        const theta = 4 * Math.atan(bulge);
        const rSigned = cLen / (2 * Math.sin(theta / 2));
        const r = Math.abs(rSigned);
        if (!Number.isFinite(r) || r < 1e-12)
            return null;
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const inv = 1 / cLen;
        const nx = -dy * inv;
        const ny = dx * inv;
        const offset = rSigned * Math.cos(theta / 2);
        const c = { x: mx + nx * offset, y: my + ny * offset };
        const a0 = Math.atan2(p1.y - c.y, p1.x - c.x);
        return { c, r, a0, sweep: theta };
    }
    function arcPoint(c, r, a) {
        return { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
    }
    function circumcircle(a, b, c) {
        const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
        if (Math.abs(d) < 1e-12)
            return null;
        const a2 = a.x * a.x + a.y * a.y;
        const b2 = b.x * b.x + b.y * b.y;
        const c2 = c.x * c.x + c.y * c.y;
        const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
        const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
        const center = { x: ux, y: uy };
        return { c: center, r: (0, math_ts_1.dist)(center, a) };
    }
    /** Arc through a → b → c. */
    function arcThrough(a, b, c) {
        const circ = circumcircle(a, b, c);
        if (!circ || circ.r < 1e-12)
            return null;
        const aA = Math.atan2(a.y - circ.c.y, a.x - circ.c.x);
        const aB = Math.atan2(b.y - circ.c.y, b.x - circ.c.x);
        const aC = Math.atan2(c.y - circ.c.y, c.x - circ.c.x);
        const sweep = (0, math_ts_1.ccwSweep)(aA, aC);
        if ((0, math_ts_1.angInSweep)(aB, aA, sweep))
            return { c: circ.c, r: circ.r, a0: aA, sweep };
        return { c: circ.c, r: circ.r, a0: aC, sweep: (0, math_ts_1.ccwSweep)(aC, aA) };
    }
    function lineIntersect(a, b, c, d, segment) {
        const r = (0, math_ts_1.sub)(b, a);
        const s = (0, math_ts_1.sub)(d, c);
        const den = (0, math_ts_1.cross)(r, s);
        if (Math.abs(den) < 1e-12)
            return null;
        const qp = (0, math_ts_1.sub)(c, a);
        const t = (0, math_ts_1.cross)(qp, s) / den;
        const u = (0, math_ts_1.cross)(qp, r) / den;
        if (segment && (t < -1e-8 || t > 1 + 1e-8 || u < -1e-8 || u > 1 + 1e-8))
            return null;
        return (0, math_ts_1.add)(a, (0, math_ts_1.mul)(r, t));
    }
    function projParam(a, b, p) {
        const ab = (0, math_ts_1.sub)(b, a);
        const l2 = (0, math_ts_1.dot)(ab, ab);
        if (l2 < 1e-18)
            return 0;
        return (0, math_ts_1.dot)((0, math_ts_1.sub)(p, a), ab) / l2;
    }
    function closestOnSeg(p, a, b) {
        const t = (0, math_ts_1.clamp)(projParam(a, b, p), 0, 1);
        const q = lerpClamped(a, b, t);
        return { pt: q, t, d: (0, math_ts_1.dist)(p, q) };
    }
    function lerpClamped(a, b, t) {
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    function lineCircle(a, b, c, r, segment) {
        const d = (0, math_ts_1.sub)(b, a);
        const f = (0, math_ts_1.sub)(a, c);
        const A = (0, math_ts_1.dot)(d, d);
        if (A < 1e-18)
            return [];
        const B = 2 * (0, math_ts_1.dot)(f, d);
        const C = (0, math_ts_1.dot)(f, f) - r * r;
        let disc = B * B - 4 * A * C;
        if (disc < -1e-8)
            return [];
        disc = Math.max(0, disc);
        const s = Math.sqrt(disc);
        const out = [];
        for (const t of [(-B - s) / (2 * A), (-B + s) / (2 * A)]) {
            if (segment && (t < -1e-8 || t > 1 + 1e-8))
                continue;
            out.push((0, math_ts_1.add)(a, (0, math_ts_1.mul)(d, t)));
        }
        return out;
    }
    function circleCircle(c0, r0, c1, r1) {
        const d = (0, math_ts_1.dist)(c0, c1);
        if (d < 1e-12 || d > r0 + r1 + 1e-7 || d < Math.abs(r0 - r1) - 1e-7)
            return [];
        const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
        const h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
        const dir = (0, math_ts_1.mul)((0, math_ts_1.sub)(c1, c0), 1 / d);
        const p = (0, math_ts_1.add)(c0, (0, math_ts_1.mul)(dir, a));
        if (h < 1e-8)
            return [p];
        const rx = -dir.y * h;
        const ry = dir.x * h;
        return [
            { x: p.x + rx, y: p.y + ry },
            { x: p.x - rx, y: p.y - ry },
        ];
    }
    function onCurve(p, c, eps) {
        switch (c.k) {
            case "line": {
                const t = projParam(c.a, c.b, p);
                if (t < -eps || t > 1 + eps)
                    return false;
                return (0, math_ts_1.dist)(p, lerpClamped(c.a, c.b, (0, math_ts_1.clamp)(t, 0, 1))) <= eps;
            }
            case "ray": {
                const v = (0, math_ts_1.sub)(p, c.p);
                if ((0, math_ts_1.dot)(v, c.d) < -eps)
                    return false;
                return Math.abs((0, math_ts_1.cross)(v, c.d)) <= eps;
            }
            case "xline":
                return Math.abs((0, math_ts_1.cross)((0, math_ts_1.sub)(p, c.p), c.d)) <= eps;
            case "circle":
                return Math.abs((0, math_ts_1.dist)(p, c.c) - c.r) <= eps;
            case "arc": {
                if (Math.abs((0, math_ts_1.dist)(p, c.c) - c.r) > eps)
                    return false;
                return (0, math_ts_1.angInSweep)(Math.atan2(p.y - c.c.y, p.x - c.c.x), c.a0, c.sweep, 1e-4);
            }
            default:
                return false;
        }
    }
    function lineOf(c) {
        if (c.k === "line")
            return { a: c.a, b: c.b, segment: true };
        if (c.k === "ray")
            return { a: c.p, b: (0, math_ts_1.add)(c.p, (0, math_ts_1.mul)(c.d, 1e6)), segment: false };
        if (c.k === "xline")
            return { a: (0, math_ts_1.add)(c.p, (0, math_ts_1.mul)(c.d, -1e6)), b: (0, math_ts_1.add)(c.p, (0, math_ts_1.mul)(c.d, 1e6)), segment: false };
        return null;
    }
    function curveHits(a, b, eps = 1e-6) {
        const la = lineOf(a);
        const lb = lineOf(b);
        let raw = [];
        if (la && lb) {
            const hit = lineIntersect(la.a, la.b, lb.a, lb.b, false);
            if (hit)
                raw = [hit];
        }
        else if (la && (b.k === "circle" || b.k === "arc")) {
            raw = lineCircle(la.a, la.b, b.c, b.r, false);
        }
        else if (lb && (a.k === "circle" || a.k === "arc")) {
            raw = lineCircle(lb.a, lb.b, a.c, a.r, false);
        }
        else if ((a.k === "circle" || a.k === "arc") && (b.k === "circle" || b.k === "arc")) {
            raw = circleCircle(a.c, a.r, b.c, b.r);
        }
        return raw.filter((p) => onCurve(p, a, eps) && onCurve(p, b, eps));
    }
    function segHitsBox(a, b, box) {
        if ((0, math_ts_1.pointInBox)(a, box) || (0, math_ts_1.pointInBox)(b, box))
            return true;
        const edges = [
            [
                { x: box.minx, y: box.miny },
                { x: box.maxx, y: box.miny },
            ],
            [
                { x: box.maxx, y: box.miny },
                { x: box.maxx, y: box.maxy },
            ],
            [
                { x: box.maxx, y: box.maxy },
                { x: box.minx, y: box.maxy },
            ],
            [
                { x: box.minx, y: box.maxy },
                { x: box.minx, y: box.miny },
            ],
        ];
        return edges.some(([c, d]) => lineIntersect(a, b, c, d, true) !== null);
    }
    function pointInPoly(p, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const a = poly[i];
            const b = poly[j];
            if (a.y > p.y !== b.y > p.y) {
                const x = ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y || 1e-18) + a.x;
                if (p.x < x)
                    inside = !inside;
            }
        }
        return inside;
    }
    function tessellate(pts, closed, step = Math.PI / 18) {
        const n = pts.length;
        const segCount = closed ? n : n - 1;
        const out = [];
        const push = (p) => {
            const last = out[out.length - 1];
            if (!last || (0, math_ts_1.dist)(last, p) > 1e-9)
                out.push({ x: p.x, y: p.y });
        };
        for (let i = 0; i < segCount; i++) {
            const p = pts[i];
            const q = pts[(i + 1) % n];
            const arc = p.b ? bulgeArc(p, q, p.b) : null;
            if (!arc) {
                push(p);
                if (!closed && i === segCount - 1)
                    push(q);
                continue;
            }
            const steps = Math.max(2, Math.ceil(Math.abs(arc.sweep) / step));
            for (let s = 0; s <= steps; s++) {
                if (closed && i === segCount - 1 && s === steps)
                    break;
                const a = arc.a0 + arc.sweep * (s / steps);
                push(arcPoint(arc.c, arc.r, a));
            }
        }
        return out;
    }
    function polyCurves(pts, closed) {
        const n = pts.length;
        const segCount = closed ? n : Math.max(0, n - 1);
        const curves = [];
        for (let i = 0; i < segCount; i++) {
            const p = pts[i];
            const q = pts[(i + 1) % n];
            const arc = p.b ? bulgeArc(p, q, p.b) : null;
            if (!arc)
                curves.push({ k: "line", a: p, b: q });
            else {
                const sweep = arc.sweep >= 0 ? arc.sweep : (0, math_ts_1.ccwSweep)(arc.a0 + arc.sweep, arc.a0);
                const a0 = arc.sweep >= 0 ? arc.a0 : (0, math_ts_1.normAng)(arc.a0 + arc.sweep);
                curves.push({ k: "arc", c: arc.c, r: arc.r, a0, sweep });
            }
        }
        return curves;
    }
    function offsetLine(a, b, distance, side) {
        const n = leftNorm(a, b);
        if ((0, math_ts_1.len)(n) < 0.5)
            return null;
        const sign = (0, math_ts_1.dot)((0, math_ts_1.sub)(side, a), n) >= 0 ? 1 : -1;
        const o = (0, math_ts_1.mul)(n, distance * sign);
        return [(0, math_ts_1.add)(a, o), (0, math_ts_1.add)(b, o)];
    }
    function offsetOpenPoly(pts, distanceSigned) {
        if (pts.length < 2)
            return null;
        const lines = [];
        for (let i = 0; i < pts.length - 1; i++) {
            const p = pts[i];
            const q = pts[i + 1];
            const nrm = leftNorm(p, q);
            if ((0, math_ts_1.len)(nrm) < 0.5)
                continue;
            const o = (0, math_ts_1.mul)(nrm, distanceSigned);
            lines.push({ a: (0, math_ts_1.add)(p, o), b: (0, math_ts_1.add)(q, o) });
        }
        if (!lines.length)
            return null;
        const out = [lines[0].a];
        for (let i = 1; i < lines.length; i++) {
            const hit = lineIntersect(lines[i - 1].a, lines[i - 1].b, lines[i].a, lines[i].b, false);
            if (!hit)
                out.push(lines[i].a);
            else {
                const span = (0, math_ts_1.dist)(hit, lines[i].a);
                if (span > Math.abs(distanceSigned) * 6)
                    out.push(lines[i - 1].b, lines[i].a);
                else
                    out.push(hit);
            }
        }
        out.push(lines[lines.length - 1].b);
        return out;
    }
    function offsetClosedPoly(pts, distanceSigned) {
        if (pts.length < 3)
            return null;
        const n = pts.length;
        const lines = [];
        for (let i = 0; i < n; i++) {
            const p = pts[i];
            const q = pts[(i + 1) % n];
            const nrm = leftNorm(p, q);
            if ((0, math_ts_1.len)(nrm) < 0.5)
                return null;
            const o = (0, math_ts_1.mul)(nrm, distanceSigned);
            lines.push({ a: (0, math_ts_1.add)(p, o), b: (0, math_ts_1.add)(q, o) });
        }
        const out = [];
        for (let i = 0; i < n; i++) {
            const prev = lines[(i - 1 + n) % n];
            const cur = lines[i];
            const hit = lineIntersect(prev.a, prev.b, cur.a, cur.b, false);
            if (!hit)
                return null;
            if ((0, math_ts_1.dist)(hit, cur.a) > Math.abs(distanceSigned) * 8)
                out.push(prev.b, cur.a);
            else
                out.push(hit);
        }
        return out;
    }
    function sideOfPoly(pts, side) {
        let best = Infinity;
        let sign = 1;
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i];
            const b = pts[i + 1];
            const c = closestOnSeg(side, a, b);
            if (c.d < best) {
                best = c.d;
                const n = leftNorm(a, b);
                sign = (0, math_ts_1.dot)((0, math_ts_1.sub)(side, a), n) >= 0 ? 1 : -1;
            }
        }
        return sign;
    }
    /** Fillet two finite lines. Radius 0 trims them to the intersection. Picks choose the kept side. */
    function filletLines(a1, a2, b1, b2, radius, pickA, pickB) {
        const I = lineIntersect(a1, a2, b1, b2, false);
        if (!I)
            return null;
        const u = (0, math_ts_1.norm)((0, math_ts_1.sub)(closestOnSeg(pickA, a1, a2).pt, I));
        const v = (0, math_ts_1.norm)((0, math_ts_1.sub)(closestOnSeg(pickB, b1, b2).pt, I));
        if ((0, math_ts_1.len)(u) < 0.5 || (0, math_ts_1.len)(v) < 0.5)
            return null;
        const keep = (p1, p2, dir, tangent) => {
            const d1 = (0, math_ts_1.dot)((0, math_ts_1.sub)(p1, I), dir);
            const d2 = (0, math_ts_1.dot)((0, math_ts_1.sub)(p2, I), dir);
            const far = d1 >= d2 ? p1 : p2;
            return [tangent, far];
        };
        if (radius <= 1e-9) {
            return { arc: null, a: keep(a1, a2, u, I), b: keep(b1, b2, v, I) };
        }
        const cos = (0, math_ts_1.clamp)((0, math_ts_1.dot)(u, v), -1, 1);
        const phi = Math.acos(cos) / 2;
        if (phi < 1e-4 || Math.abs(Math.PI / 2 - phi) < 1e-6 && false)
            return null;
        if (phi < 1e-3 || phi > Math.PI / 2 - 1e-4)
            return null;
        const bis = (0, math_ts_1.norm)((0, math_ts_1.add)(u, v));
        if ((0, math_ts_1.len)(bis) < 0.5)
            return null;
        const center = (0, math_ts_1.add)(I, (0, math_ts_1.mul)(bis, radius / Math.sin(phi)));
        const tA = (0, math_ts_1.add)(I, (0, math_ts_1.mul)(u, radius / Math.tan(phi)));
        const tB = (0, math_ts_1.add)(I, (0, math_ts_1.mul)(v, radius / Math.tan(phi)));
        const aA = Math.atan2(tA.y - center.y, tA.x - center.x);
        const aB = Math.atan2(tB.y - center.y, tB.x - center.x);
        const mid = Math.atan2(I.y - center.y, I.x - center.x);
        let a0 = aA;
        let sweep = (0, math_ts_1.ccwSweep)(aA, aB);
        if (!(0, math_ts_1.angInSweep)(mid, a0, sweep)) {
            a0 = aB;
            sweep = (0, math_ts_1.ccwSweep)(aB, aA);
        }
        if (sweep > Math.PI + 1e-3)
            return null;
        return {
            arc: { c: center, r: radius, a0, sweep },
            a: keep(a1, a2, u, tA),
            b: keep(b1, b2, v, tB),
        };
    }
    function chamferLines(a1, a2, b1, b2, da, db, pickA, pickB) {
        const I = lineIntersect(a1, a2, b1, b2, false);
        if (!I)
            return null;
        const u = (0, math_ts_1.norm)((0, math_ts_1.sub)(closestOnSeg(pickA, a1, a2).pt, I));
        const v = (0, math_ts_1.norm)((0, math_ts_1.sub)(closestOnSeg(pickB, b1, b2).pt, I));
        if ((0, math_ts_1.len)(u) < 0.5 || (0, math_ts_1.len)(v) < 0.5)
            return null;
        const tA = (0, math_ts_1.add)(I, (0, math_ts_1.mul)(u, Math.max(0, da)));
        const tB = (0, math_ts_1.add)(I, (0, math_ts_1.mul)(v, Math.max(0, db)));
        const keep = (p1, p2, dir, tangent) => {
            const d1 = (0, math_ts_1.dot)((0, math_ts_1.sub)(p1, I), dir);
            const d2 = (0, math_ts_1.dot)((0, math_ts_1.sub)(p2, I), dir);
            return [tangent, d1 >= d2 ? p1 : p2];
        };
        return { a: keep(a1, a2, u, tA), b: keep(b1, b2, v, tB), chord: [tA, tB] };
    }
    function trimParamLine(a, b, cuts, pick) {
        const ab = (0, math_ts_1.sub)(b, a);
        const ts = [0, 1];
        for (const hit of cuts) {
            const t = projParam(a, b, hit);
            if (t > 1e-5 && t < 1 - 1e-5)
                ts.push(t);
        }
        ts.sort((x, y) => x - y);
        const uniq = [];
        for (const t of ts)
            if (!uniq.length || t - uniq[uniq.length - 1] > 1e-5)
                uniq.push(t);
        if (uniq.length < 3)
            return null;
        const tPick = (0, math_ts_1.clamp)(projParam(a, b, pick), 0, 1);
        let span = 0;
        for (let i = 0; i < uniq.length - 1; i++) {
            if (tPick >= uniq[i] - 1e-6 && tPick <= uniq[i + 1] + 1e-6) {
                span = i;
                break;
            }
        }
        const parts = [];
        for (let i = 0; i < uniq.length - 1; i++) {
            if (i === span)
                continue;
            parts.push([(0, math_ts_1.add)(a, (0, math_ts_1.mul)(ab, uniq[i])), (0, math_ts_1.add)(a, (0, math_ts_1.mul)(ab, uniq[i + 1]))]);
        }
        return parts;
    }
    function extendLineTo(a, b, pick, hits) {
        const endIsA = (0, math_ts_1.dist)(pick, a) <= (0, math_ts_1.dist)(pick, b);
        const origin = endIsA ? a : b;
        const other = endIsA ? b : a;
        const dir = (0, math_ts_1.norm)((0, math_ts_1.sub)(origin, other));
        if ((0, math_ts_1.len)(dir) < 0.5)
            return null;
        let best = null;
        let bestT = Infinity;
        for (const h of hits) {
            const t = (0, math_ts_1.dot)((0, math_ts_1.sub)(h, origin), dir);
            if (t > 1e-5 && t < bestT) {
                bestT = t;
                best = h;
            }
        }
        if (!best)
            return null;
        return endIsA ? [best, b] : [a, best];
    }
    function mirrorPoint(p, a, b) {
        const d = (0, math_ts_1.sub)(b, a);
        const l2 = (0, math_ts_1.dot)(d, d) || 1e-18;
        const t = (0, math_ts_1.dot)((0, math_ts_1.sub)(p, a), d) / l2;
        const proj = (0, math_ts_1.add)(a, (0, math_ts_1.mul)(d, t));
        return { x: 2 * proj.x - p.x, y: 2 * proj.y - p.y };
    }
    function mirrorVector(v, a, b) {
        const d = (0, math_ts_1.norm)((0, math_ts_1.sub)(b, a));
        const proj = (0, math_ts_1.mul)(d, (0, math_ts_1.dot)(v, d));
        return (0, math_ts_1.sub)((0, math_ts_1.mul)(proj, 2), v);
    }
    function tangentPoints(c, r, from) {
        const d = (0, math_ts_1.dist)(from, c);
        if (d <= r + 1e-8)
            return [];
        const alpha = Math.acos((0, math_ts_1.clamp)(r / d, -1, 1));
        const base = Math.atan2(from.y - c.y, from.x - c.x);
        return [arcPoint(c, r, base + alpha), arcPoint(c, r, base - alpha)];
    }
    function arcBox(c, r, a0, sweep) {
        let b = (0, math_ts_1.boxFromCorners)(arcPoint(c, r, a0), arcPoint(c, r, a0 + sweep));
        for (const card of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
            if ((0, math_ts_1.angInSweep)(card, a0, sweep))
                b = { ...boxAddLoose(b, arcPoint(c, r, card)) };
        }
        return b;
    }
    function boxAddLoose(b, p) {
        return {
            minx: Math.min(b.minx, p.x),
            miny: Math.min(b.miny, p.y),
            maxx: Math.max(b.maxx, p.x),
            maxy: Math.max(b.maxy, p.y),
        };
    }
    function closestOnCurve(p, c) {
        switch (c.k) {
            case "line": {
                const q = closestOnSeg(p, c.a, c.b);
                return { pt: q.pt, d: q.d };
            }
            case "ray":
            case "xline": {
                const t = (0, math_ts_1.dot)((0, math_ts_1.sub)(p, c.p), c.d);
                if (c.k === "ray" && t < 0)
                    return { pt: c.p, d: (0, math_ts_1.dist)(p, c.p) };
                const q = (0, math_ts_1.add)(c.p, (0, math_ts_1.mul)(c.d, t));
                return { pt: q, d: (0, math_ts_1.dist)(p, q) };
            }
            case "circle":
            case "arc": {
                const a = Math.atan2(p.y - c.c.y, p.x - c.c.x);
                if (c.k === "arc" && !(0, math_ts_1.angInSweep)(a, c.a0, c.sweep)) {
                    const s = arcPoint(c.c, c.r, c.a0);
                    const e = arcPoint(c.c, c.r, c.a0 + c.sweep);
                    return (0, math_ts_1.dist)(p, s) < (0, math_ts_1.dist)(p, e) ? { pt: s, d: (0, math_ts_1.dist)(p, s) } : { pt: e, d: (0, math_ts_1.dist)(p, e) };
                }
                const q = arcPoint(c.c, c.r, a);
                return { pt: q, d: (0, math_ts_1.dist)(p, q) };
            }
            default:
                return null;
        }
    }
    function rayHits(origin, dir, c) {
        const ray = { k: "ray", p: origin, d: (0, math_ts_1.norm)(dir) };
        return curveHits(ray, c);
    }
    function angleDiff(a, b) {
        let d = (0, math_ts_1.normAng)(a - b);
        if (d > Math.PI)
            d = Math.PI * 2 - d;
        return d;
    }
    function collinear(a, b, c, tol) {
        const ab = (0, math_ts_1.len)((0, math_ts_1.sub)(b, a)) || 1;
        return Math.abs((0, math_ts_1.cross)((0, math_ts_1.sub)(b, a), (0, math_ts_1.sub)(c, a))) / ab <= tol;
    }

  };

  factories["entities.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WEIGHTS = exports.LINETYPES = void 0;
    exports.uid = uid;
    exports.peekId = peekId;
    exports.resetIds = resetIds;
    exports.defaultLayers = defaultLayers;
    exports.layerOf = layerOf;
    exports.cloneEnt = cloneEnt;
    exports.retag = retag;
    exports.insertMap = insertMap;
    exports.placedInsert = placedInsert;
    exports.translateEnt = translateEnt;
    exports.rotateEnt = rotateEnt;
    exports.scaleEnt = scaleEnt;
    exports.mirrorEnt = mirrorEnt;
    exports.entityBBox = entityBBox;
    exports.catmull = catmull;
    exports.splineSamples = splineSamples;
    exports.ellipsePoint = ellipsePoint;
    exports.ellipseSamples = ellipseSamples;
    exports.curvesOf = curvesOf;
    exports.hitDist = hitDist;
    exports.hatchContains = hatchContains;
    exports.hitsRect = hitsRect;
    exports.gripsOf = gripsOf;
    exports.applyGrip = applyGrip;
    exports.stretchEnt = stretchEnt;
    exports.explodeEnt = explodeEnt;
    exports.dimPoints = dimPoints;
    exports.explodeDim = explodeDim;
    exports.linearDimGeom = linearDimGeom;
    exports.resolvedPaint = resolvedPaint;
    exports.visibleEnt = visibleEnt;
    exports.editableEnt = editableEnt;
    exports.snapEligible = snapEligible;
    exports.trimEntity = trimEntity;
    exports.extendEntity = extendEntity;
    exports.breakEntity = breakEntity;
    exports.describeEnt = describeEnt;
    exports.areaOf = areaOf;
    const aci_ts_1 = require("./aci.ts");
    const geom_ts_1 = require("./geom.ts");
    const math_ts_1 = require("./math.ts");
    let seq = 1;
    function uid() {
        return (seq++).toString(36);
    }
    function peekId() {
        return seq;
    }
    function resetIds(n) {
        seq = Math.max(seq, n);
    }
    exports.LINETYPES = [
        "continuous",
        "dashed",
        "hidden",
        "center",
        "phantom",
        "dot",
        "dashdot",
        "divide",
    ];
    exports.WEIGHTS = [0, 0.05, 0.09, 0.13, 0.15, 0.18, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.53, 0.6, 0.7, 0.8, 0.9, 1, 1.06, 1.2, 1.4, 1.58, 2, 2.11];
    function defaultLayers() {
        return [
            { name: "0", color: 7, lt: "continuous", lw: 0.25, on: true, frozen: false, locked: false },
            { name: "Outline", color: 4, lt: "continuous", lw: 0.5, on: true, frozen: false, locked: false },
            { name: "Center", color: 1, lt: "center", lw: 0.18, on: true, frozen: false, locked: false },
            { name: "Hidden", color: 2, lt: "hidden", lw: 0.18, on: true, frozen: false, locked: false },
            { name: "Hatch", color: 8, lt: "continuous", lw: 0.13, on: true, frozen: false, locked: false },
            { name: "Dim", color: 3, lt: "continuous", lw: 0.13, on: true, frozen: false, locked: false },
            { name: "Text", color: 7, lt: "continuous", lw: 0.13, on: true, frozen: false, locked: false },
            { name: "Construction", color: 6, lt: "phantom", lw: 0.13, on: true, frozen: false, locked: false },
        ];
    }
    function layerOf(layers, name) {
        return layers.find((l) => l.name.toLowerCase() === name.toLowerCase()) ?? layers[0] ?? defaultLayers()[0];
    }
    function cloneEnt(e) {
        return structuredClone(e);
    }
    function retag(e) {
        const c = cloneEnt(e);
        c.id = uid();
        return c;
    }
    function childLayer(child, host) {
        const c = cloneEnt(child);
        if (c.layer === "0")
            c.layer = host.layer;
        if (c.color === "byblock")
            c.color = host.color === "byblock" ? "bylayer" : host.color;
        if (c.lt === "byblock")
            c.lt = host.lt === "byblock" ? "bylayer" : host.lt;
        if (c.lw === "byblock")
            c.lw = host.lw === "byblock" ? "bylayer" : host.lw;
        return c;
    }
    function insertMap(ins, block, p) {
        const x = (p.x - block.base.x) * ins.sx;
        const y = (p.y - block.base.y) * ins.sy;
        const co = Math.cos(ins.rot);
        const si = Math.sin(ins.rot);
        return { x: ins.p.x + x * co - y * si, y: ins.p.y + x * si + y * co };
    }
    function placedInsert(ins, block) {
        const uniform = Math.abs(Math.abs(ins.sx) - Math.abs(ins.sy)) < 1e-9;
        const scale = Math.abs(ins.sx) || 1;
        const mirror = ins.sx * ins.sy < 0;
        return block.ents.map((raw) => {
            const e = childLayer(raw, ins);
            return mapEnt(e, (p) => insertMap(ins, block, p), {
                scale,
                mirror,
                uniform,
                rot: ins.rot * (mirror ? -1 : 1),
            });
        });
    }
    function mapEnt(e, fn, opt) {
        const c = cloneEnt(e);
        const sc = opt.scale;
        switch (c.type) {
            case "line":
                c.a = fn(c.a);
                c.b = fn(c.b);
                return c;
            case "point":
            case "text":
                if (c.type === "point")
                    c.p = fn(c.p);
                else {
                    c.p = fn(c.p);
                    c.h *= sc;
                    c.rot += opt.rot;
                    if (opt.mirror)
                        c.rot = -c.rot;
                }
                return c;
            case "circle":
            case "donut":
                if (c.type === "circle") {
                    c.c = fn(c.c);
                    c.r *= sc;
                }
                else {
                    c.c = fn(c.c);
                    c.ir *= sc;
                    c.or *= sc;
                }
                return c;
            case "arc": {
                const s = fn((0, geom_ts_1.arcPoint)(c.c, c.r, c.a0));
                const m = fn((0, geom_ts_1.arcPoint)(c.c, c.r, c.a0 + c.sweep / 2));
                const end = fn((0, geom_ts_1.arcPoint)(c.c, c.r, c.a0 + c.sweep));
                const built = (0, geom_ts_1.arcThrough)(s, m, end);
                if (!built) {
                    c.c = fn(c.c);
                    c.r *= sc;
                    return c;
                }
                c.c = built.c;
                c.r = built.r;
                c.a0 = built.a0;
                c.sweep = built.sweep;
                return c;
            }
            case "polyline":
                c.pts = c.pts.map((p) => {
                    const q = fn(p);
                    const b = p.b ? (opt.mirror ? -p.b : p.b) : undefined;
                    return b ? { ...q, b } : q;
                });
                c.width *= sc;
                return c;
            case "spline":
                c.pts = c.pts.map(fn);
                return c;
            case "ellipse": {
                const C = fn(c.c);
                const major = fn((0, math_ts_1.add)(c.c, { x: c.mx, y: c.my }));
                const v = (0, math_ts_1.sub)(major, C);
                c.c = C;
                c.mx = v.x;
                c.my = v.y;
                return c;
            }
            case "xline":
            case "ray":
                c.a = fn(c.a);
                c.b = fn(c.b);
                return c;
            case "hatch":
                c.loops = c.loops.map((loop) => {
                    if ("circle" in loop)
                        return { circle: { c: fn(loop.circle.c), r: loop.circle.r * sc } };
                    return {
                        closed: loop.closed,
                        pts: loop.pts.map((p) => {
                            const q = fn(p);
                            return p.b ? { ...q, b: opt.mirror ? -p.b : p.b } : q;
                        }),
                    };
                });
                return c;
            case "insert": {
                c.p = fn(c.p);
                c.sx *= opt.mirror ? -sc : sc;
                c.sy *= sc;
                c.rot += opt.rot;
                return c;
            }
            case "dim":
                c.dim = mapDim(c.dim, fn, sc);
                return c;
            default:
                return c;
        }
    }
    function mapDim(d, fn, sc) {
        const th = d.th !== undefined ? d.th * sc : undefined;
        const keep = th !== undefined ? { th } : {};
        const turn = (c, ang) => {
            const a = fn(c);
            const b = fn({ x: c.x + Math.cos(ang), y: c.y + Math.sin(ang) });
            return Math.atan2(b.y - a.y, b.x - a.x);
        };
        if (d.kind === "linear") {
            const p1 = fn(d.p1);
            const p2 = fn(d.p2);
            const loc = fn(d.loc);
            let axis = d.axis;
            if (axis === "h" || axis === "v") {
                // Which way does the original measuring axis point after the transform?
                const o = fn({ x: 0, y: 0 });
                const t = fn(axis === "h" ? { x: 1, y: 0 } : { x: 0, y: 1 });
                const ang = Math.atan2(t.y - o.y, t.x - o.x);
                const q = ((ang % Math.PI) + Math.PI) % Math.PI;
                if (Math.abs(q) < 1e-6 || Math.abs(q - Math.PI) < 1e-6)
                    axis = "h";
                else if (Math.abs(q - Math.PI / 2) < 1e-6)
                    axis = "v";
                else
                    axis = "aligned";
            }
            return { ...d, ...keep, axis, p1, p2, loc };
        }
        if (d.kind === "radial")
            return { ...d, ...keep, c: fn(d.c), r: d.r * sc, ang: turn(d.c, d.ang) };
        const a0 = turn(d.c, d.a0);
        const a1 = turn(d.c, d.a1);
        const o = fn({ x: 0, y: 0 });
        const ex = fn({ x: 1, y: 0 });
        const ey = fn({ x: 0, y: 1 });
        const flipped = (ex.x - o.x) * (ey.y - o.y) - (ex.y - o.y) * (ey.x - o.x) < 0;
        return { ...d, ...keep, c: fn(d.c), r: d.r * sc, a0: flipped ? a1 : a0, a1: flipped ? a0 : a1 };
    }
    function translateEnt(e, d) {
        if ((0, math_ts_1.len)(d) < 1e-15)
            return cloneEnt(e);
        return mapEnt(e, (p) => (0, math_ts_1.add)(p, d), { scale: 1, mirror: false, uniform: true, rot: 0 });
    }
    function rotateEnt(e, base, ang) {
        return mapEnt(e, (p) => (0, math_ts_1.add)(base, (0, math_ts_1.rot)((0, math_ts_1.sub)(p, base), ang)), {
            scale: 1,
            mirror: false,
            uniform: true,
            rot: ang,
        });
    }
    function scaleEnt(e, base, f) {
        const af = Math.abs(f);
        let out = mapEnt(e, (p) => (0, math_ts_1.add)(base, (0, math_ts_1.mul)((0, math_ts_1.sub)(p, base), af)), {
            scale: af,
            mirror: false,
            uniform: true,
            rot: 0,
        });
        if (f < 0)
            out = rotateEnt(out, base, Math.PI);
        return out;
    }
    function mirrorEnt(e, a, b) {
        const out = mapEnt(e, (p) => (0, geom_ts_1.mirrorPoint)(p, a, b), {
            scale: 1,
            mirror: true,
            uniform: true,
            rot: 0,
        });
        if (out.type === "text" || out.type === "insert") {
            const dir = (0, geom_ts_1.mirrorVector)({ x: Math.cos(e.type === "text" ? e.rot : e.rot), y: Math.sin(e.type === "text" ? e.rot : e.type === "insert" ? e.rot : 0) }, a, b);
            const ang = Math.atan2(dir.y, dir.x);
            if (out.type === "text")
                out.rot = ang;
            if (out.type === "insert")
                out.rot = ang;
        }
        return out;
    }
    function entityBBox(e, ctx) {
        switch (e.type) {
            case "line":
                return (0, math_ts_1.boxFromCorners)(e.a, e.b);
            case "point":
                return (0, math_ts_1.expandBox)((0, math_ts_1.boxFromCorners)(e.p, e.p), 0.5);
            case "circle":
                return { minx: e.c.x - e.r, miny: e.c.y - e.r, maxx: e.c.x + e.r, maxy: e.c.y + e.r };
            case "donut":
                return { minx: e.c.x - e.or, miny: e.c.y - e.or, maxx: e.c.x + e.or, maxy: e.c.y + e.or };
            case "arc":
                return (0, geom_ts_1.arcBox)(e.c, e.r, e.a0, e.sweep);
            case "polyline": {
                const pts = (0, geom_ts_1.tessellate)(e.pts, e.closed);
                let b = math_ts_1.EMPTY;
                for (const p of pts)
                    b = unionPt(b, p, (e.width || 0) / 2);
                return b;
            }
            case "spline": {
                const pts = splineSamples(e.pts);
                let b = math_ts_1.EMPTY;
                for (const p of pts)
                    b = unionPt(b, p, 0);
                return b;
            }
            case "ellipse": {
                let b = math_ts_1.EMPTY;
                for (const p of ellipseSamples(e, 32))
                    b = unionPt(b, p, 0);
                return b;
            }
            case "text": {
                const tl = e.text.split("\n");
                const w = Math.max(e.h, Math.max(...tl.map((l) => l.length)) * e.h * 0.62);
                const corners = [];
                const x0 = e.align === "center" ? -w / 2 : e.align === "right" ? -w : 0;
                const yLow = -(tl.length - 1) * e.h * 1.25 - e.h * 0.25;
                const local = [
                    { x: x0, y: yLow },
                    { x: x0 + w, y: yLow },
                    { x: x0 + w, y: e.h },
                    { x: x0, y: e.h },
                ];
                let b = math_ts_1.EMPTY;
                for (const p of local) {
                    const r = (0, math_ts_1.rot)(p, e.rot);
                    b = unionPt(b, (0, math_ts_1.add)(e.p, r), 0);
                }
                void corners;
                return b;
            }
            case "xline":
            case "ray":
                return { minx: -1e9, miny: -1e9, maxx: 1e9, maxy: 1e9 };
            case "hatch": {
                let b = math_ts_1.EMPTY;
                for (const loop of e.loops) {
                    if ("circle" in loop) {
                        const c = loop.circle;
                        b = (0, math_ts_1.boxUnion)(b, { minx: c.c.x - c.r, miny: c.c.y - c.r, maxx: c.c.x + c.r, maxy: c.c.y + c.r });
                    }
                    else {
                        for (const p of (0, geom_ts_1.tessellate)(loop.pts, loop.closed))
                            b = unionPt(b, p, 0);
                    }
                }
                return b;
            }
            case "insert": {
                const block = ctx.blocks.get(e.name.toLowerCase());
                if (!block)
                    return (0, math_ts_1.expandBox)((0, math_ts_1.boxFromCorners)(e.p, e.p), 1);
                let b = math_ts_1.EMPTY;
                for (const child of placedInsert(e, block))
                    b = (0, math_ts_1.boxUnion)(b, entityBBox(child, ctx));
                return b;
            }
            case "dim": {
                let b = math_ts_1.EMPTY;
                for (const p of dimPoints(e.dim))
                    b = unionPt(b, p, 0);
                return b;
            }
            default:
                return math_ts_1.EMPTY;
        }
    }
    function unionPt(b, p, pad) {
        if ((0, math_ts_1.boxEmpty)(b))
            return { minx: p.x - pad, miny: p.y - pad, maxx: p.x + pad, maxy: p.y + pad };
        return {
            minx: Math.min(b.minx, p.x - pad),
            miny: Math.min(b.miny, p.y - pad),
            maxx: Math.max(b.maxx, p.x + pad),
            maxy: Math.max(b.maxy, p.y + pad),
        };
    }
    function catmull(pts, samplesPer = 12) {
        if (pts.length < 2)
            return pts.map((p) => ({ x: p.x, y: p.y }));
        if (pts.length === 2)
            return [pts[0], pts[1]];
        const out = [];
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(0, i - 1)];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[Math.min(pts.length - 1, i + 2)];
            const n = i === pts.length - 2 ? samplesPer : samplesPer - 0;
            for (let s = 0; s < (i === pts.length - 2 ? samplesPer + 1 : samplesPer); s++) {
                const t = s / samplesPer;
                out.push(catmullPoint(p0, p1, p2, p3, t));
                void n;
            }
        }
        return out;
    }
    function catmullPoint(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        return {
            x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
            y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        };
    }
    function splineSamples(pts) {
        return catmull(pts, 10);
    }
    function ellipsePoint(e, t) {
        const maj = { x: e.mx, y: e.my };
        const L = (0, math_ts_1.len)(maj) || 1;
        const ux = maj.x / L;
        const uy = maj.y / L;
        const minor = L * e.ratio;
        const a = e.a0 + e.sweep * t;
        return {
            x: e.c.x + Math.cos(a) * maj.x - Math.sin(a) * uy * minor,
            y: e.c.y + Math.cos(a) * maj.y + Math.sin(a) * ux * minor,
        };
    }
    function ellipseSamples(e, n = 48) {
        const steps = Math.max(8, Math.ceil((n * e.sweep) / math_ts_1.TAU));
        const out = [];
        for (let i = 0; i <= steps; i++)
            out.push(ellipsePoint(e, i / steps));
        return out;
    }
    function curvesOf(e, ctx) {
        switch (e.type) {
            case "line":
                return [{ k: "line", a: e.a, b: e.b }];
            case "xline": {
                const d = (0, math_ts_1.norm)((0, math_ts_1.sub)(e.b, e.a));
                return (0, math_ts_1.len)(d) < 0.5 ? [] : [{ k: "xline", p: e.a, d }];
            }
            case "ray": {
                const d = (0, math_ts_1.norm)((0, math_ts_1.sub)(e.b, e.a));
                return (0, math_ts_1.len)(d) < 0.5 ? [] : [{ k: "ray", p: e.a, d }];
            }
            case "circle":
                return [{ k: "circle", c: e.c, r: e.r }];
            case "donut":
                return [
                    { k: "circle", c: e.c, r: e.or },
                    { k: "circle", c: e.c, r: e.ir },
                ];
            case "arc":
                return [{ k: "arc", c: e.c, r: e.r, a0: e.a0, sweep: e.sweep }];
            case "polyline":
                return (0, geom_ts_1.polyCurves)(e.pts, e.closed);
            case "spline": {
                const s = splineSamples(e.pts);
                const curves = [];
                for (let i = 0; i < s.length - 1; i++)
                    curves.push({ k: "line", a: s[i], b: s[i + 1] });
                return curves;
            }
            case "ellipse": {
                const s = ellipseSamples(e, 36);
                const curves = [];
                for (let i = 0; i < s.length - 1; i++)
                    curves.push({ k: "line", a: s[i], b: s[i + 1] });
                return curves;
            }
            case "insert": {
                const block = ctx.blocks.get(e.name.toLowerCase());
                if (!block)
                    return [];
                return placedInsert(e, block).flatMap((c) => curvesOf(c, ctx));
            }
            case "dim":
                return explodeDim(e).flatMap((c) => (c.type === "line" ? curvesOf(c, ctx) : []));
            case "hatch": {
                const curves = [];
                for (const loop of e.loops) {
                    if ("circle" in loop)
                        curves.push({ k: "circle", c: loop.circle.c, r: loop.circle.r });
                    else
                        curves.push(...(0, geom_ts_1.polyCurves)(loop.pts, loop.closed));
                }
                return curves;
            }
            default:
                return [];
        }
    }
    function hitDist(e, p, ctx) {
        if (e.type === "text") {
            const b = entityBBox(e, ctx);
            if ((0, math_ts_1.pointInBox)(p, b))
                return 0;
            return Math.min((0, math_ts_1.dist)(p, { x: b.minx, y: b.miny }), (0, math_ts_1.dist)(p, { x: b.maxx, y: b.maxy }));
        }
        if (e.type === "point")
            return (0, math_ts_1.dist)(p, e.p);
        if (e.type === "hatch") {
            if (hatchContains(e, p))
                return 0;
        }
        let best = Infinity;
        for (const c of curvesOf(e, ctx)) {
            const q = (0, geom_ts_1.closestOnCurve)(p, c);
            if (q && q.d < best)
                best = q.d;
        }
        return best;
    }
    function hatchContains(e, p) {
        let inside = false;
        for (const loop of e.loops) {
            if ("circle" in loop) {
                if ((0, math_ts_1.dist)(p, loop.circle.c) <= loop.circle.r)
                    inside = !inside;
            }
            else if (pointInLoop(p, loop.pts, loop.closed))
                inside = !inside;
        }
        return inside;
    }
    function pointInLoop(p, pts, closed) {
        if (!closed || pts.length < 3)
            return false;
        return pointInPolyFast(p, (0, geom_ts_1.tessellate)(pts, true, Math.PI / 12));
    }
    function pointInPolyFast(p, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const a = poly[i];
            const b = poly[j];
            if (a.y > p.y !== b.y > p.y) {
                const x = ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y || 1e-18) + a.x;
                if (p.x < x)
                    inside = !inside;
            }
        }
        return inside;
    }
    function hitsRect(e, box, ctx, mode) {
        if (e.type === "xline" || e.type === "ray") {
            if (mode === "window")
                return false;
            return curvesOf(e, ctx).some((c) => {
                if (c.k !== "xline" && c.k !== "ray")
                    return false;
                const far = (0, math_ts_1.add)(c.p, (0, math_ts_1.mul)(c.d, 1e6));
                const back = c.k === "xline" ? (0, math_ts_1.add)(c.p, (0, math_ts_1.mul)(c.d, -1e6)) : c.p;
                return (0, geom_ts_1.segHitsBox)(back, far, box);
            });
        }
        const b = entityBBox(e, ctx);
        if ((0, math_ts_1.boxEmpty)(b) || !(0, math_ts_1.boxIntersects)(b, box))
            return false;
        if (mode === "window")
            return (0, math_ts_1.boxInside)(b, box);
        if ((0, math_ts_1.boxInside)(b, box))
            return true;
        if (e.type === "text" || e.type === "point")
            return true;
        return curvesOf(e, ctx).some((c) => {
            if (c.k === "line")
                return (0, geom_ts_1.segHitsBox)(c.a, c.b, box);
            if (c.k === "circle" || c.k === "arc") {
                const steps = c.k === "circle" ? 24 : Math.max(4, Math.ceil((16 * c.sweep) / math_ts_1.TAU));
                for (let i = 0; i < steps; i++) {
                    const a0 = c.k === "circle" ? (i * math_ts_1.TAU) / steps : c.a0 + (c.sweep * i) / steps;
                    const a1 = c.k === "circle" ? ((i + 1) * math_ts_1.TAU) / steps : c.a0 + (c.sweep * (i + 1)) / steps;
                    if ((0, geom_ts_1.segHitsBox)((0, geom_ts_1.arcPoint)(c.c, c.r, a0), (0, geom_ts_1.arcPoint)(c.c, c.r, a1), box))
                        return true;
                }
                return false;
            }
            return false;
        });
    }
    function gripsOf(e) {
        const g = (p, kind, index) => ({ p, kind, entId: e.id, index });
        switch (e.type) {
            case "line":
                return [g(e.a, "end", 0), g(e.b, "end", 1), g({ x: (e.a.x + e.b.x) / 2, y: (e.a.y + e.b.y) / 2 }, "mid", 2)];
            case "circle":
            case "donut": {
                const r = e.type === "circle" ? e.r : e.or;
                return [
                    g(e.c, "cen", 0),
                    g((0, geom_ts_1.arcPoint)(e.c, r, 0), "quad", 1),
                    g((0, geom_ts_1.arcPoint)(e.c, r, Math.PI / 2), "quad", 2),
                    g((0, geom_ts_1.arcPoint)(e.c, r, Math.PI), "quad", 3),
                    g((0, geom_ts_1.arcPoint)(e.c, r, -Math.PI / 2), "quad", 4),
                ];
            }
            case "arc":
                return [
                    g(e.c, "cen", 0),
                    g((0, geom_ts_1.arcPoint)(e.c, e.r, e.a0), "end", 1),
                    g((0, geom_ts_1.arcPoint)(e.c, e.r, e.a0 + e.sweep), "end", 2),
                    g((0, geom_ts_1.arcPoint)(e.c, e.r, e.a0 + e.sweep / 2), "mid", 3),
                ];
            case "polyline": {
                const gs = e.pts.map((p, i) => g(p, "vertex", i));
                const n = e.pts.length;
                const segs = e.closed ? n : n - 1;
                for (let i = 0; i < segs; i++) {
                    const p = e.pts[i];
                    const q = e.pts[(i + 1) % n];
                    const arc = p.b ? (0, geom_ts_1.bulgeArc)(p, q, p.b) : null;
                    const mid = arc ? (0, geom_ts_1.arcPoint)(arc.c, arc.r, arc.a0 + arc.sweep / 2) : { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
                    gs.push(g(mid, "mid", 1000 + i));
                }
                return gs;
            }
            case "spline":
                return e.pts.map((p, i) => g(p, "vertex", i));
            case "ellipse":
                return [g(e.c, "cen", 0), g((0, math_ts_1.add)(e.c, { x: e.mx, y: e.my }), "quad", 1)];
            case "point":
            case "text":
            case "insert":
                return [g(e.type === "point" ? e.p : e.type === "text" ? e.p : e.p, "ins", 0)];
            case "xline":
            case "ray":
                return [g(e.a, "end", 0), g(e.b, "end", 1)];
            case "dim":
                return dimPoints(e.dim).map((p, i) => g(p, "vertex", i));
            case "hatch": {
                const gs = [];
                e.loops.forEach((loop, li) => {
                    if ("circle" in loop)
                        gs.push(g(loop.circle.c, "cen", li));
                    else
                        loop.pts.forEach((p, i) => gs.push(g(p, "vertex", li * 1000 + i)));
                });
                return gs;
            }
            default:
                return [];
        }
    }
    function applyGrip(e, grip, to) {
        const c = cloneEnt(e);
        const delta = (0, math_ts_1.sub)(to, grip.p);
        switch (c.type) {
            case "line":
                if (grip.index === 0)
                    c.a = to;
                else if (grip.index === 1)
                    c.b = to;
                else
                    return translateEnt(c, delta);
                return c;
            case "circle":
                if (grip.kind === "cen")
                    c.c = to;
                else
                    c.r = Math.max(1e-6, (0, math_ts_1.dist)(c.c, to));
                return c;
            case "donut":
                if (grip.kind === "cen")
                    c.c = to;
                else {
                    const d = (0, math_ts_1.dist)(c.c, to);
                    const thick = Math.max(0, c.or - c.ir);
                    c.or = Math.max(thick + 1e-4, d);
                    c.ir = c.or - thick;
                }
                return c;
            case "arc":
                if (grip.index === 0)
                    return translateEnt(c, delta);
                if (grip.index === 1) {
                    c.a0 = Math.atan2(to.y - c.c.y, to.x - c.c.x);
                    return c;
                }
                if (grip.index === 2) {
                    const a = Math.atan2(to.y - c.c.y, to.x - c.c.x);
                    c.sweep = (0, math_ts_1.ccwSweep)(c.a0, a);
                    return c;
                }
                return translateEnt(c, delta);
            case "polyline":
                if (grip.index >= 1000) {
                    const i = grip.index - 1000;
                    const n = c.pts.length;
                    const j = (i + 1) % n;
                    c.pts[i] = { ...c.pts[i], x: c.pts[i].x + delta.x, y: c.pts[i].y + delta.y };
                    c.pts[j] = { ...c.pts[j], x: c.pts[j].x + delta.x, y: c.pts[j].y + delta.y };
                    return c;
                }
                if (c.pts[grip.index])
                    c.pts[grip.index] = { ...c.pts[grip.index], x: to.x, y: to.y };
                return c;
            case "spline":
                if (c.pts[grip.index])
                    c.pts[grip.index] = { x: to.x, y: to.y };
                return c;
            case "ellipse":
                if (grip.kind === "cen")
                    c.c = to;
                else {
                    c.mx = to.x - c.c.x;
                    c.my = to.y - c.c.y;
                }
                return c;
            case "point":
                c.p = to;
                return c;
            case "text":
            case "insert":
                c.p = to;
                return c;
            case "xline":
            case "ray":
                if (grip.index === 0) {
                    const d = (0, math_ts_1.sub)(c.b, c.a);
                    c.a = to;
                    c.b = (0, math_ts_1.add)(to, d);
                }
                else
                    c.b = to;
                return c;
            default:
                return translateEnt(c, delta);
        }
    }
    function stretchEnt(e, box, delta) {
        const inside = (p) => (0, math_ts_1.pointInBox)(p, box);
        if ((0, math_ts_1.len)(delta) < 1e-15)
            return null;
        switch (e.type) {
            case "line": {
                const a = inside(e.a);
                const b = inside(e.b);
                if (!a && !b)
                    return null;
                const c = cloneEnt(e);
                if (a)
                    c.a = (0, math_ts_1.add)(c.a, delta);
                if (b)
                    c.b = (0, math_ts_1.add)(c.b, delta);
                return c;
            }
            case "polyline":
            case "spline": {
                const c = cloneEnt(e);
                let moved = false;
                c.pts = c.pts.map((p) => {
                    if (!inside(p))
                        return p;
                    moved = true;
                    return { ...p, x: p.x + delta.x, y: p.y + delta.y };
                });
                return moved ? c : null;
            }
            case "circle":
            case "donut":
            case "ellipse":
            case "arc":
                if (!inside(e.c))
                    return null;
                return translateEnt(e, delta);
            case "point":
            case "text":
            case "insert":
                if (!inside(e.p))
                    return null;
                return translateEnt(e, delta);
            case "xline":
            case "ray": {
                const c = cloneEnt(e);
                let moved = false;
                if (inside(c.a)) {
                    c.a = (0, math_ts_1.add)(c.a, delta);
                    c.b = (0, math_ts_1.add)(c.b, delta);
                    moved = true;
                }
                return moved ? c : null;
            }
            case "dim": {
                const d = cloneEnt(e);
                let moved = false;
                const mov = (p) => {
                    if (!inside(p))
                        return p;
                    moved = true;
                    return (0, math_ts_1.add)(p, delta);
                };
                if (d.dim.kind === "linear")
                    d.dim = { ...d.dim, p1: mov(d.dim.p1), p2: mov(d.dim.p2), loc: mov(d.dim.loc) };
                else if (inside(d.dim.c))
                    return translateEnt(e, delta);
                return moved ? d : null;
            }
            case "hatch": {
                const c = cloneEnt(e);
                let moved = false;
                c.loops = c.loops.map((loop) => {
                    if ("circle" in loop) {
                        if (!inside(loop.circle.c))
                            return loop;
                        moved = true;
                        return { circle: { c: (0, math_ts_1.add)(loop.circle.c, delta), r: loop.circle.r } };
                    }
                    return {
                        closed: loop.closed,
                        pts: loop.pts.map((p) => {
                            if (!inside(p))
                                return p;
                            moved = true;
                            return { ...p, x: p.x + delta.x, y: p.y + delta.y };
                        }),
                    };
                });
                return moved ? c : null;
            }
            default:
                return null;
        }
    }
    function styleOf(src) {
        return { layer: src.layer, color: src.color, lt: src.lt, lw: src.lw };
    }
    function explodeEnt(e, ctx) {
        const st = styleOf(e);
        switch (e.type) {
            case "polyline": {
                const curves = (0, geom_ts_1.polyCurves)(e.pts, e.closed);
                if (!curves.length)
                    return null;
                return curves.map((c) => {
                    if (c.k === "line")
                        return { ...st, id: uid(), type: "line", a: c.a, b: c.b };
                    return { ...st, id: uid(), type: "arc", c: c.c, r: c.r, a0: c.a0, sweep: c.sweep };
                });
            }
            case "spline": {
                const s = splineSamples(e.pts);
                return [{ ...st, id: uid(), type: "polyline", pts: s.map((p) => ({ ...p })), closed: false, width: 0 }];
            }
            case "donut": {
                const r = (e.ir + e.or) / 2;
                const w = Math.max(0, e.or - e.ir);
                const p1 = { x: e.c.x - r, y: e.c.y, b: 1 };
                const p2 = { x: e.c.x + r, y: e.c.y, b: 1 };
                return [{ ...st, id: uid(), type: "polyline", pts: [p1, p2], closed: true, width: w }];
            }
            case "insert": {
                const block = ctx.blocks.get(e.name.toLowerCase());
                if (!block)
                    return null;
                return placedInsert(e, block).map(retag);
            }
            case "hatch": {
                const out = [];
                for (const loop of e.loops) {
                    if ("circle" in loop)
                        out.push({ ...st, id: uid(), type: "circle", c: loop.circle.c, r: loop.circle.r });
                    else
                        out.push({ ...st, id: uid(), type: "polyline", pts: loop.pts.map((p) => ({ ...p })), closed: loop.closed, width: 0 });
                }
                return out;
            }
            case "dim":
                return explodeDim(e).map(retag);
            case "ellipse": {
                const s = ellipseSamples(e, 48);
                return [{ ...st, id: uid(), type: "polyline", pts: s, closed: e.sweep >= math_ts_1.TAU - 1e-3, width: 0 }];
            }
            default:
                return null;
        }
    }
    function dimPoints(d) {
        if (d.kind === "linear")
            return [d.p1, d.p2, d.loc];
        if (d.kind === "radial")
            return [d.c, (0, geom_ts_1.arcPoint)(d.c, d.r, d.ang)];
        return [d.c, (0, geom_ts_1.arcPoint)(d.c, d.r, d.a0), (0, geom_ts_1.arcPoint)(d.c, d.r, d.a1)];
    }
    function arrowSolid(st, tip, dir, size) {
        const u = (0, math_ts_1.norm)(dir);
        if (u.x === 0 && u.y === 0)
            return null;
        const n = { x: -u.y, y: u.x };
        const b = { x: tip.x - u.x * size, y: tip.y - u.y * size };
        return {
            ...st,
            id: uid(),
            type: "hatch",
            solid: true,
            pattern: "SOLID",
            scale: 1,
            angle: 0,
            loops: [{ closed: true, pts: [{ x: tip.x, y: tip.y }, { x: b.x + n.x * size * 0.28, y: b.y + n.y * size * 0.28 }, { x: b.x - n.x * size * 0.28, y: b.y - n.y * size * 0.28 }] }],
        };
    }
    function explodeDim(e) {
        const st = { layer: e.layer, color: e.color, lt: "continuous", lw: e.lw };
        const text = (p, str, h, rot = 0) => ({
            ...st,
            id: uid(),
            type: "text",
            p,
            h,
            rot,
            text: str,
            align: "center",
        });
        const line = (a, b) => ({ ...st, id: uid(), type: "line", a, b });
        const h = e.dim.th ?? 2.5;
        const pr = Math.max(0, Math.min(8, e.dim.prec ?? 2));
        const arrows = [];
        const addArrow = (tip, dir, size) => {
            const a = arrowSolid(st, tip, dir, size);
            if (a)
                arrows.push(a);
        };
        if (e.dim.kind === "radial") {
            const tip = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.ang);
            const tail = e.dim.dia ? (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.ang + Math.PI) : e.dim.c;
            const label = `${e.dim.dia ? "Ø" : "R"}${(e.dim.dia ? e.dim.r * 2 : e.dim.r).toFixed(pr)}`;
            addArrow(tip, (0, math_ts_1.sub)(tip, e.dim.c), h * 0.7);
            if (e.dim.dia)
                addArrow(tail, (0, math_ts_1.sub)(tail, e.dim.c), h * 0.7);
            return [line(tail, tip), text((0, math_ts_1.add)(tip, { x: h * 0.4 + h * label.length * 0.3, y: h * 0.4 }), label, h), ...arrows];
        }
        if (e.dim.kind === "angular") {
            const samples = [];
            const steps = 12;
            let prev = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.a0);
            const sweep = (0, math_ts_1.ccwSweep)(e.dim.a0, e.dim.a1);
            for (let i = 1; i <= steps; i++) {
                const q = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.a0 + (sweep * i) / steps);
                samples.push(line(prev, q));
                prev = q;
            }
            const mid = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r + h * 0.4, e.dim.a0 + sweep / 2);
            const deg = (sweep * 180) / Math.PI;
            samples.push(text(mid, `${deg.toFixed(Math.min(pr, 2))}°`, h));
            const sA = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.a0);
            const tA = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.a0 + sweep);
            addArrow(sA, { x: Math.sin(e.dim.a0), y: -Math.cos(e.dim.a0) }, h * 0.65);
            addArrow(tA, { x: -Math.sin(e.dim.a0 + sweep), y: Math.cos(e.dim.a0 + sweep) }, h * 0.65);
            return [...samples, ...arrows];
        }
        const built = linearDimGeom({ ...e.dim, prec: pr }, h);
        const ents = [
            line(built.ext1[0], built.ext1[1]),
            line(built.ext2[0], built.ext2[1]),
            line(built.dim[0], built.dim[1]),
            text(built.textPt, built.label, h, built.textRot),
        ];
        for (const a of built.arrows)
            addArrow(a.tip, a.dir, h * 0.7);
        return [...ents, ...arrows];
    }
    function linearDimGeom(d, textH) {
        const gap = textH * 0.28;
        const over = textH * 0.35;
        let u;
        let n;
        let q1;
        let q2;
        let measure;
        if (d.axis === "h") {
            u = { x: Math.sign(d.p2.x - d.p1.x) || 1, y: 0 };
            n = { x: 0, y: 1 };
            q1 = { x: d.p1.x, y: d.loc.y };
            q2 = { x: d.p2.x, y: d.loc.y };
            measure = Math.abs(d.p2.x - d.p1.x);
        }
        else if (d.axis === "v") {
            u = { x: 0, y: Math.sign(d.p2.y - d.p1.y) || 1 };
            n = { x: 1, y: 0 };
            q1 = { x: d.loc.x, y: d.p1.y };
            q2 = { x: d.loc.x, y: d.p2.y };
            measure = Math.abs(d.p2.y - d.p1.y);
        }
        else {
            const dir = (0, math_ts_1.norm)((0, math_ts_1.sub)(d.p2, d.p1));
            u = (0, math_ts_1.len)(dir) < 0.5 ? { x: 1, y: 0 } : dir;
            n = { x: -u.y, y: u.x };
            const off = (d.loc.x - d.p1.x) * n.x + (d.loc.y - d.p1.y) * n.y;
            q1 = (0, math_ts_1.add)(d.p1, (0, math_ts_1.mul)(n, off));
            q2 = (0, math_ts_1.add)(d.p2, (0, math_ts_1.mul)(n, off));
            measure = (0, math_ts_1.dist)(d.p1, d.p2);
            if (off < 0)
                n = (0, math_ts_1.mul)(n, -1);
        }
        const side = (p, q) => {
            const nd = (0, math_ts_1.norm)((0, math_ts_1.sub)(q, p));
            return (0, math_ts_1.len)(nd) < 0.5 ? n : nd;
        };
        const s1 = side(d.p1, q1);
        const s2 = side(d.p2, q2);
        const ext1 = [(0, math_ts_1.add)(d.p1, (0, math_ts_1.mul)(s1, gap)), (0, math_ts_1.add)(q1, (0, math_ts_1.mul)(s1, over))];
        const ext2 = [(0, math_ts_1.add)(d.p2, (0, math_ts_1.mul)(s2, gap)), (0, math_ts_1.add)(q2, (0, math_ts_1.mul)(s2, over))];
        const mid = { x: (q1.x + q2.x) / 2, y: (q1.y + q2.y) / 2 };
        const textRot = d.axis === "v" ? Math.PI / 2 : d.axis === "h" ? 0 : (0, math_ts_1.angOf)(u);
        const lift = (0, math_ts_1.mul)(n, textH * 0.55);
        return {
            ext1,
            ext2,
            dim: [q1, q2],
            textPt: (0, math_ts_1.add)(mid, lift),
            textRot,
            label: measure.toFixed(Math.max(0, Math.min(8, d.prec ?? 2))),
            arrows: [
                { tip: q1, dir: (0, math_ts_1.norm)((0, math_ts_1.sub)(q1, q2)) },
                { tip: q2, dir: (0, math_ts_1.norm)((0, math_ts_1.sub)(q2, q1)) },
            ],
        };
    }
    function resolvedPaint(e, layers, color7) {
        const layer = layerOf(layers, e.layer);
        const aci = e.color === "bylayer" || e.color === "byblock" ? layer.color : e.color;
        const lt = e.lt === "bylayer" || e.lt === "byblock" ? layer.lt : e.lt;
        const lw = e.lw === "bylayer" || e.lw === "byblock" ? layer.lw : e.lw;
        return { color: (0, aci_ts_1.aciHex)(aci, color7), lt, lw };
    }
    function visibleEnt(e, layers) {
        const layer = layerOf(layers, e.layer);
        return layer.on && !layer.frozen;
    }
    function editableEnt(e, layers) {
        const layer = layerOf(layers, e.layer);
        return layer.on && !layer.frozen && !layer.locked;
    }
    function snapEligible(e, layers) {
        return visibleEnt(e, layers);
    }
    /** Replace a trimmed curve back into an entity, possibly splitting into several. */
    function trimEntity(e, cuts, pick, ctx) {
        const st = styleOf(e);
        if (e.type === "line") {
            const hits = cuts.flatMap((c) => (0, geom_ts_1.curveHits)({ k: "line", a: e.a, b: e.b }, c));
            const parts = (0, geom_ts_1.trimParamLine)(e.a, e.b, hits, pick);
            if (!parts)
                return null;
            return parts
                .filter(([a, b]) => (0, math_ts_1.dist)(a, b) > 1e-8)
                .map(([a, b]) => ({ ...st, id: uid(), type: "line", a, b }));
        }
        if (e.type === "circle" || e.type === "arc") {
            const curve = e.type === "circle"
                ? { k: "circle", c: e.c, r: e.r }
                : { k: "arc", c: e.c, r: e.r, a0: e.a0, sweep: e.sweep };
            const hits = cuts.flatMap((c) => (0, geom_ts_1.curveHits)(curve, c));
            if (hits.length === 0 && e.type === "circle")
                return null;
            const angs = hits.map((h) => Math.atan2(h.y - e.c.y, h.x - e.c.x));
            if (e.type === "arc") {
                const rel = angs
                    .map((a) => ({ a, t: (0, math_ts_1.ccwSweep)(e.a0, a) }))
                    .filter((x) => x.t > 1e-4 && x.t < e.sweep - 1e-4)
                    .sort((p, q) => p.t - q.t);
                if (!rel.length)
                    return null;
                const pickA = Math.atan2(pick.y - e.c.y, pick.x - e.c.x);
                const tp = Math.min(e.sweep, Math.max(0, (0, math_ts_1.ccwSweep)(e.a0, pickA)));
                const bounds = [0, ...rel.map((r) => r.t), e.sweep];
                let span = 0;
                for (let i = 0; i < bounds.length - 1; i++) {
                    if (tp >= bounds[i] - 1e-4 && tp <= bounds[i + 1] + 1e-4)
                        span = i;
                }
                const out = [];
                for (let i = 0; i < bounds.length - 1; i++) {
                    if (i === span)
                        continue;
                    const sweep = bounds[i + 1] - bounds[i];
                    if (sweep < 1e-4)
                        continue;
                    out.push({
                        ...st,
                        id: uid(),
                        type: "arc",
                        c: e.c,
                        r: e.r,
                        a0: e.a0 + bounds[i],
                        sweep,
                    });
                }
                return out;
            }
            if (angs.length < 1)
                return null;
            angs.sort((a, b) => a - b);
            const uniq = [];
            for (const a of angs) {
                if (!uniq.length || Math.abs(normMinus(a, uniq[uniq.length - 1])) > 1e-3)
                    uniq.push(a);
            }
            if (!uniq.length)
                return null;
            const pickA = Math.atan2(pick.y - e.c.y, pick.x - e.c.x);
            // Remove the CCW span from the hit before the pick to the hit after.
            let prev = uniq[uniq.length - 1];
            let next = uniq[0];
            for (let i = 0; i < uniq.length; i++) {
                const a0 = uniq[i];
                const a1 = uniq[(i + 1) % uniq.length];
                if ((0, math_ts_1.angInSweep)(pickA, a0, (0, math_ts_1.ccwSweep)(a0, a1))) {
                    prev = a0;
                    next = a1;
                    break;
                }
            }
            const sweep = (0, math_ts_1.ccwSweep)(next, prev);
            if (sweep < 1e-3 || sweep > math_ts_1.TAU - 1e-3)
                return [];
            return [{ ...st, id: uid(), type: "arc", c: e.c, r: e.r, a0: next, sweep }];
        }
        if (e.type === "polyline") {
            const n = e.pts.length;
            const segs = e.closed ? n : n - 1;
            let bestI = -1;
            let bestD = Infinity;
            for (let i = 0; i < segs; i++) {
                const curves = (0, geom_ts_1.polyCurves)([e.pts[i], e.pts[(i + 1) % n]], false);
                for (const c of curves) {
                    const q = (0, geom_ts_1.closestOnCurve)(pick, c);
                    if (q && q.d < bestD) {
                        bestD = q.d;
                        bestI = i;
                    }
                }
            }
            if (bestI < 0)
                return null;
            if (e.closed) {
                // Re-start the loop just after the trimmed segment so it becomes an open path ending on that segment.
                const rot = [];
                for (let k = 0; k < n; k++)
                    rot.push({ ...e.pts[(bestI + 1 + k) % n] });
                const dup = { ...e.pts[(bestI + 1) % n] };
                delete dup.b;
                rot.push(dup);
                e = { ...e, closed: false, pts: rot, __wasClosed: true };
                bestI = n - 1;
            }
            const p = e.pts[bestI];
            const q = e.pts[(bestI + 1) % e.pts.length];
            const arc = p.b ? (0, geom_ts_1.bulgeArc)(p, q, p.b) : null;
            if (arc) {
                const asEnt = {
                    ...st,
                    id: e.id,
                    type: "arc",
                    c: arc.c,
                    r: arc.r,
                    a0: arc.sweep >= 0 ? arc.a0 : arc.a0 + arc.sweep,
                    sweep: Math.abs(arc.sweep),
                };
                const trimmed = trimEntity(asEnt, cuts, pick, ctx);
                if (!trimmed)
                    return null;
                return splicePoly(e, bestI, trimmed);
            }
            const hits = cuts.flatMap((c) => (0, geom_ts_1.curveHits)({ k: "line", a: p, b: q }, c));
            const parts = (0, geom_ts_1.trimParamLine)(p, q, hits, pick);
            if (!parts)
                return null;
            const lines = parts.map(([a, b]) => ({ ...st, id: uid(), type: "line", a, b }));
            return splicePoly(e, bestI, lines);
        }
        return null;
    }
    function normMinus(a, b) {
        return Math.atan2(Math.sin(a - b), Math.cos(a - b));
    }
    function splicePoly(e, seg, repl) {
        const st = styleOf(e);
        const tol = 1e-7;
        const same = (a, b) => (0, math_ts_1.dist)(a, b) <= tol * Math.max(1, Math.abs(a.x) + Math.abs(a.y));
        const strip = (p) => ({ x: p.x, y: p.y });
        const p0 = e.pts[seg];
        const q0 = e.pts[seg + 1];
        const toPts = (ent) => {
            if (ent.type === "line")
                return [{ x: ent.a.x, y: ent.a.y }, { x: ent.b.x, y: ent.b.y }];
            if (ent.type === "arc") {
                const s0 = (0, geom_ts_1.arcPoint)(ent.c, ent.r, ent.a0);
                const en = (0, geom_ts_1.arcPoint)(ent.c, ent.r, ent.a0 + ent.sweep);
                return [{ ...s0, b: Math.tan(ent.sweep / 4) }, { ...en }];
            }
            return [];
        };
        const before = e.pts.slice(0, seg + 1).map((p, i, arr) => (i === arr.length - 1 ? strip(p) : { ...p }));
        const after = e.pts.slice(seg + 1).map((p) => ({ ...p }));
        const chains = [];
        let cur = before;
        let attachedEnd = false;
        repl.forEach((piece, i) => {
            const bits = toPts(piece);
            if (bits.length < 2)
                return;
            if (i === 0 && same(bits[0], p0)) {
                cur = [...cur.slice(0, -1), ...bits];
            }
            else {
                if (cur.length >= 2)
                    chains.push(cur);
                cur = bits;
            }
            if (i === repl.length - 1 && same(bits[bits.length - 1], q0)) {
                cur = [...cur.slice(0, -1), ...after];
                attachedEnd = true;
            }
        });
        if (cur.length >= 2)
            chains.push(cur);
        if (!attachedEnd && after.length >= 2)
            chains.push(after);
        let out = chains;
        if (e.__wasClosed && chains.length >= 2) {
            const first = chains[0];
            const last = chains[chains.length - 1];
            const rot0 = e.pts[0];
            const rotN = e.pts[e.pts.length - 1];
            if (same(first[0], rot0) && same(last[last.length - 1], rotN)) {
                const merged = [...last.slice(0, -1), ...first];
                out = [merged, ...chains.slice(1, -1)];
            }
        }
        return out
            .filter((pts) => pts.length >= 2)
            .map((pts) => ({ ...st, id: uid(), type: "polyline", pts, closed: false, width: e.width }));
    }
    function extendEntity(e, bounds, pick) {
        if (e.type === "line") {
            const hits = bounds.flatMap((c) => {
                const endIsA = (0, math_ts_1.dist)(pick, e.a) <= (0, math_ts_1.dist)(pick, e.b);
                const origin = endIsA ? e.a : e.b;
                const other = endIsA ? e.b : e.a;
                return (0, geom_ts_1.rayHits)(origin, (0, math_ts_1.sub)(origin, other), c);
            });
            const next = (0, geom_ts_1.extendLineTo)(e.a, e.b, pick, hits);
            if (!next)
                return null;
            return { ...e, a: next[0], b: next[1] };
        }
        if (e.type === "arc") {
            const s = (0, geom_ts_1.arcPoint)(e.c, e.r, e.a0);
            const end = (0, geom_ts_1.arcPoint)(e.c, e.r, e.a0 + e.sweep);
            const extendStart = (0, math_ts_1.dist)(pick, s) <= (0, math_ts_1.dist)(pick, end);
            const dirSign = extendStart ? -1 : 1;
            let best = null;
            const originAng = extendStart ? e.a0 : e.a0 + e.sweep;
            for (const c of bounds) {
                for (const h of (0, geom_ts_1.curveHits)({ k: "circle", c: e.c, r: e.r }, c)) {
                    const a = Math.atan2(h.y - e.c.y, h.x - e.c.x);
                    // Travel outward: decreasing angle if extending start of a CCW arc.
                    let delta = dirSign * ccwLike(originAng, a, dirSign);
                    if (delta > 1e-3 && (best === null || delta < best))
                        best = delta;
                    void a;
                }
            }
            if (best === null)
                return null;
            if (extendStart)
                return { ...e, a0: e.a0 - best, sweep: e.sweep + best };
            return { ...e, sweep: e.sweep + best };
        }
        if (e.type === "polyline" && !e.closed && e.pts.length >= 2) {
            const n = e.pts.length;
            const atStart = (0, math_ts_1.dist)(pick, e.pts[0]) <= (0, math_ts_1.dist)(pick, e.pts[n - 1]);
            const a = atStart ? e.pts[0] : e.pts[n - 2];
            const b = atStart ? e.pts[1] : e.pts[n - 1];
            if (a.b)
                return null;
            const fake = { ...e, type: "line", a: atStart ? b : a, b: atStart ? a : b };
            // extendLine uses the end closer to pick. Put pick near the free end.
            const probe = atStart ? a : b;
            const ext = extendEntity(fake, bounds, probe);
            if (!ext || ext.type !== "line")
                return null;
            const c = cloneEnt(e);
            if (atStart)
                c.pts[0] = { ...c.pts[0], x: ext.a.x === b.x && ext.a.y === b.y ? ext.b.x : ext.a.x, y: ext.a.x === b.x && ext.a.y === b.y ? ext.b.y : ext.a.y };
            else {
                const moved = (0, math_ts_1.dist)(ext.b, b) > (0, math_ts_1.dist)(ext.a, b) ? ext.b : ext.a;
                // The free end is the one that changed.
                const changed = (0, math_ts_1.dist)(ext.a, probe) > 1e-6 ? ext.a : ext.b;
                c.pts[n - 1] = { ...c.pts[n - 1], x: changed.x, y: changed.y };
                void moved;
            }
            return c;
        }
        return null;
    }
    function ccwLike(from, to, dirSign) {
        if (dirSign > 0)
            return (0, math_ts_1.ccwSweep)(from, to);
        return (0, math_ts_1.ccwSweep)(to, from);
    }
    function breakEntity(e, p1, p2) {
        const st = styleOf(e);
        if (e.type === "line") {
            const t1 = Math.max(0, Math.min(1, projSafe(e.a, e.b, p1)));
            const t2 = Math.max(0, Math.min(1, projSafe(e.a, e.b, p2)));
            const lo = Math.min(t1, t2);
            const hi = Math.max(t1, t2);
            if (hi - lo < 1e-8) {
                const q = lerpP(e.a, e.b, lo);
                return [
                    { ...st, id: uid(), type: "line", a: e.a, b: q },
                    { ...st, id: uid(), type: "line", a: q, b: e.b },
                ].filter((ln) => (0, math_ts_1.dist)(ln.a, ln.b) > 1e-8);
            }
            const A = lerpP(e.a, e.b, lo);
            const B = lerpP(e.a, e.b, hi);
            const out = [];
            if (lo > 1e-5)
                out.push({ ...st, id: uid(), type: "line", a: e.a, b: A });
            if (hi < 1 - 1e-5)
                out.push({ ...st, id: uid(), type: "line", a: B, b: e.b });
            return out;
        }
        if (e.type === "circle" || e.type === "arc") {
            const a = Math.atan2(p1.y - e.c.y, p1.x - e.c.x);
            const b = Math.atan2(p2.y - e.c.y, p2.x - e.c.x);
            if (e.type === "circle") {
                const sweep = (0, math_ts_1.ccwSweep)(b, a);
                return [{ ...st, id: uid(), type: "arc", c: e.c, r: e.r, a0: b, sweep }];
            }
            // Remove the portion of the arc between the two angles that lies on the arc.
            const tA = (0, math_ts_1.ccwSweep)(e.a0, a);
            const tB = (0, math_ts_1.ccwSweep)(e.a0, b);
            if (tA > e.sweep + 1e-3 && tB > e.sweep + 1e-3)
                return null;
            const lo = Math.min(tA, tB);
            const hi = Math.max(tA, tB);
            const out = [];
            if (lo > 1e-3)
                out.push({ ...st, id: uid(), type: "arc", c: e.c, r: e.r, a0: e.a0, sweep: lo });
            if (e.sweep - hi > 1e-3)
                out.push({ ...st, id: uid(), type: "arc", c: e.c, r: e.r, a0: e.a0 + hi, sweep: e.sweep - hi });
            return out;
        }
        return null;
    }
    function projSafe(a, b, p) {
        const ab = (0, math_ts_1.sub)(b, a);
        const l2 = ab.x * ab.x + ab.y * ab.y || 1e-18;
        return ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / l2;
    }
    function lerpP(a, b, t) {
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    function describeEnt(e) {
        switch (e.type) {
            case "line":
                return `LINE  ${e.a.x.toFixed(4)},${e.a.y.toFixed(4)} → ${e.b.x.toFixed(4)},${e.b.y.toFixed(4)}  len ${(0, math_ts_1.dist)(e.a, e.b).toFixed(4)}`;
            case "circle":
                return `CIRCLE  c ${e.c.x.toFixed(4)},${e.c.y.toFixed(4)}  r ${e.r.toFixed(4)}`;
            case "arc":
                return `ARC  c ${e.c.x.toFixed(4)},${e.c.y.toFixed(4)}  r ${e.r.toFixed(4)}  sweep ${((e.sweep * 180) / Math.PI).toFixed(2)}°`;
            case "polyline":
                return `LWPOLYLINE  ${e.pts.length} verts  ${e.closed ? "closed" : "open"}`;
            case "text":
                return `TEXT  "${e.text}"  h ${e.h.toFixed(3)}`;
            case "spline":
                return `SPLINE  ${e.pts.length} fit points`;
            case "ellipse":
                return `ELLIPSE  c ${e.c.x.toFixed(4)},${e.c.y.toFixed(4)}`;
            case "point":
                return `POINT  ${e.p.x.toFixed(4)},${e.p.y.toFixed(4)}`;
            case "insert":
                return `INSERT  ${e.name}  @ ${e.p.x.toFixed(4)},${e.p.y.toFixed(4)}`;
            case "hatch":
                return `HATCH  ${e.solid ? "SOLID" : e.pattern}  scale ${e.scale}`;
            case "dim":
                return `DIMENSION  ${e.dim.kind}`;
            case "donut":
                return `DONUT  ir ${e.ir.toFixed(4)}  or ${e.or.toFixed(4)}`;
            case "xline":
                return `XLINE`;
            case "ray":
                return `RAY`;
            default:
                return e.type;
        }
    }
    function areaOf(e) {
        if (e.type === "circle")
            return Math.PI * e.r * e.r;
        if (e.type === "donut")
            return Math.PI * (e.or * e.or - e.ir * e.ir);
        if (e.type === "polyline" && e.closed) {
            const p = (0, geom_ts_1.tessellate)(e.pts, true);
            let a = 0;
            for (let i = 0; i < p.length; i++) {
                const q = p[(i + 1) % p.length];
                a += p[i].x * q.y - q.x * p[i].y;
            }
            return Math.abs(a) / 2;
        }
        if (e.type === "ellipse" && e.sweep >= math_ts_1.TAU - 1e-3) {
            const major = Math.hypot(e.mx, e.my);
            return Math.PI * major * major * e.ratio;
        }
        return null;
    }
    void geom_ts_1.mirrorVector;
    void math_ts_1.add;
    void math_ts_1.norm;

  };

  factories["doc.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Spatial = exports.Doc = void 0;
    exports.queryHitsBox = queryHitsBox;
    exports.freshDoc = freshDoc;
    exports.stamp = stamp;
    const entities_ts_1 = require("./entities.ts");
    const math_ts_1 = require("./math.ts");
    class Doc {
        ents = new Map();
        order = [];
        layers = (0, entities_ts_1.defaultLayers)();
        blocks = new Map();
        currentLayer = "0";
        ltscale = 1;
        color = "bylayer";
        lt = "bylayer";
        lw = "bylayer";
        dimtxt = 2.5;
        dimprec = 2;
        texth = 2.5;
        prec = 4;
        /** DXF $INSUNITS. 0 unitless, 1 inches, 4 mm, 5 cm, 6 m. */
        units = 4;
        fillet = 0;
        chamferA = 0;
        chamferB = 0;
        offsetDist = 1;
        rev = 0;
        past = [];
        future = [];
        layer(name) {
            return (0, entities_ts_1.layerOf)(this.layers, name);
        }
        ctx() {
            return { blocks: this.blocks, layers: this.layers };
        }
        has(id) {
            return this.ents.has(id);
        }
        get(id) {
            return this.ents.get(id);
        }
        all() {
            const out = [];
            for (const id of this.order) {
                const e = this.ents.get(id);
                if (e)
                    out.push(e);
            }
            return out;
        }
        add(e) {
            this.ents.set(e.id, e);
            this.order.push(e.id);
        }
        remove(id) {
            this.ents.delete(id);
            this.order = this.order.filter((x) => x !== id);
        }
        replace(e) {
            if (!this.ents.has(e.id))
                this.order.push(e.id);
            this.ents.set(e.id, e);
        }
        bump() {
            this.rev++;
        }
        snapshot() {
            return {
                ents: this.all().map((e) => (0, entities_ts_1.cloneEnt)(e)),
                layers: structuredClone(this.layers),
                blocks: [...this.blocks.values()].map((b) => structuredClone(b)),
                currentLayer: this.currentLayer,
                ltscale: this.ltscale,
                color: this.color,
                lt: this.lt,
                lw: this.lw,
                dimtxt: this.dimtxt,
                dimprec: this.dimprec,
                texth: this.texth,
                prec: this.prec,
                units: this.units,
                fillet: this.fillet,
                chamferA: this.chamferA,
                chamferB: this.chamferB,
                offsetDist: this.offsetDist,
            };
        }
        restore(s) {
            this.ents.clear();
            this.order = [];
            let maxId = 1;
            for (const e of s.ents) {
                if (e.type === "dim" && e.dim.th === undefined) {
                    // Older drawings drew every dimension with the document-wide height.
                    e.dim.th = s.dimtxt ?? 2.5;
                    e.dim.prec = e.dim.prec ?? 2;
                }
                this.ents.set(e.id, (0, entities_ts_1.cloneEnt)(e));
                this.order.push(e.id);
                const n = parseInt(e.id, 36);
                if (Number.isFinite(n))
                    maxId = Math.max(maxId, n + 1);
            }
            (0, entities_ts_1.resetIds)(maxId);
            this.layers = structuredClone(s.layers);
            this.blocks.clear();
            for (const b of s.blocks)
                this.blocks.set(b.name.toLowerCase(), structuredClone(b));
            this.currentLayer = s.currentLayer;
            this.ltscale = s.ltscale;
            this.color = s.color;
            this.lt = s.lt;
            this.lw = s.lw;
            this.dimtxt = s.dimtxt;
            this.dimprec = s.dimprec ?? 2;
            this.texth = s.texth ?? 2.5;
            this.prec = s.prec;
            this.units = s.units;
            this.fillet = s.fillet;
            this.chamferA = s.chamferA;
            this.chamferB = s.chamferB;
            this.offsetDist = s.offsetDist;
            this.bump();
        }
        transact(fn) {
            const before = this.snapshot();
            try {
                fn();
            }
            catch (err) {
                // Do not leave a half-applied edit behind.
                this.restore(before);
                throw err;
            }
            const after = JSON.stringify(this.snapshot());
            if (JSON.stringify(before) === after)
                return false;
            this.past.push(before);
            if (this.past.length > 50)
                this.past.shift();
            this.future.length = 0;
            this.bump();
            return true;
        }
        undo() {
            const s = this.past.pop();
            if (!s)
                return false;
            this.future.push(this.snapshot());
            this.restore(s);
            return true;
        }
        redo() {
            const s = this.future.pop();
            if (!s)
                return false;
            this.past.push(this.snapshot());
            this.restore(s);
            return true;
        }
        clearGeometry() {
            this.ents.clear();
            this.order = [];
            this.blocks.clear();
            this.bump();
        }
        extents() {
            let b = null;
            for (const e of this.all()) {
                if (e.type === "xline" || e.type === "ray")
                    continue;
                const eb = (0, entities_ts_1.entityBBox)(e, this.ctx());
                if ((0, math_ts_1.boxEmpty)(eb))
                    continue;
                b = b ? {
                    minx: Math.min(b.minx, eb.minx),
                    miny: Math.min(b.miny, eb.miny),
                    maxx: Math.max(b.maxx, eb.maxx),
                    maxy: Math.max(b.maxy, eb.maxy),
                } : eb;
            }
            return b;
        }
    }
    exports.Doc = Doc;
    class Spatial {
        rev = -1;
        cell = 40;
        buckets = new Map();
        infinite = [];
        ensure(doc) {
            if (this.rev === doc.rev)
                return;
            this.rev = doc.rev;
            this.buckets.clear();
            this.infinite = [];
            const ents = doc.all();
            if (!ents.length)
                return;
            let size = 0;
            let n = 0;
            for (const e of ents) {
                if (e.type === "xline" || e.type === "ray") {
                    this.infinite.push(e.id);
                    continue;
                }
                const b = (0, entities_ts_1.entityBBox)(e, doc.ctx());
                if ((0, math_ts_1.boxEmpty)(b))
                    continue;
                const w = b.maxx - b.minx;
                const h = b.maxy - b.miny;
                if (Number.isFinite(w) && Number.isFinite(h) && w < 1e8 && h < 1e8) {
                    size += Math.max(w, h);
                    n++;
                }
            }
            this.cell = n ? Math.max(1, (size / n) * 2) : 40;
            for (const e of ents) {
                if (e.type === "xline" || e.type === "ray")
                    continue;
                const b = (0, entities_ts_1.entityBBox)(e, doc.ctx());
                if ((0, math_ts_1.boxEmpty)(b))
                    continue;
                this.drop(e.id, b);
            }
        }
        drop(id, b) {
            const c = this.cell;
            const x0 = Math.floor(b.minx / c);
            const x1 = Math.floor(b.maxx / c);
            const y0 = Math.floor(b.miny / c);
            const y1 = Math.floor(b.maxy / c);
            const span = (x1 - x0 + 1) * (y1 - y0 + 1);
            if (span > 400) {
                this.infinite.push(id);
                return;
            }
            for (let x = x0; x <= x1; x++) {
                for (let y = y0; y <= y1; y++) {
                    const k = `${x}:${y}`;
                    let arr = this.buckets.get(k);
                    if (!arr)
                        this.buckets.set(k, (arr = []));
                    arr.push(id);
                }
            }
        }
        query(doc, box) {
            this.ensure(doc);
            const c = this.cell;
            const seen = new Set(this.infinite);
            const x0 = Math.floor(box.minx / c);
            const x1 = Math.floor(box.maxx / c);
            const y0 = Math.floor(box.miny / c);
            const y1 = Math.floor(box.maxy / c);
            for (let x = x0; x <= x1; x++) {
                for (let y = y0; y <= y1; y++) {
                    const arr = this.buckets.get(`${x}:${y}`);
                    if (!arr)
                        continue;
                    for (const id of arr)
                        seen.add(id);
                }
            }
            const out = [];
            for (const id of seen) {
                const e = doc.get(id);
                if (e)
                    out.push(e);
            }
            return out;
        }
        near(doc, p, rad) {
            return this.query(doc, (0, math_ts_1.expandBox)({ minx: p.x, miny: p.y, maxx: p.x, maxy: p.y }, rad));
        }
    }
    exports.Spatial = Spatial;
    function queryHitsBox(doc, index, box) {
        return index.query(doc, box).filter((e) => {
            const b = (0, entities_ts_1.entityBBox)(e, doc.ctx());
            return e.type === "xline" || e.type === "ray" || (0, math_ts_1.boxIntersects)(b, box);
        });
    }
    function freshDoc() {
        const d = new Doc();
        d.bump();
        return d;
    }
    function stamp(doc, partial) {
        const p = partial;
        const layer = p.layer ?? doc.currentLayer;
        const color = p.color ?? doc.color;
        const lt = p.lt ?? doc.lt;
        const lw = p.lw ?? doc.lw;
        return { ...p, id: (0, entities_ts_1.uid)(), layer, color, lt, lw };
    }

  };

  factories["dxf.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.writeDxf = writeDxf;
    exports.readDxf = readDxf;
    exports.downloadDxf = downloadDxf;
    const aci_ts_1 = require("./aci.ts");
    const doc_ts_1 = require("./doc.ts");
    const entities_ts_1 = require("./entities.ts");
    const math_ts_1 = require("./math.ts");
    const LT_PAT = {
        continuous: [],
        dashed: [0.5, -0.25],
        hidden: [0.25, -0.125],
        center: [1.25, -0.25, 0.25, -0.25],
        phantom: [1.25, -0.25, 0.25, -0.25, 0.25, -0.25],
        dot: [0, -0.25],
        dashdot: [0.5, -0.25, 0, -0.25],
        divide: [0.5, -0.25, 0, -0.25, 0, -0.25],
    };
    function num(n) {
        if (!Number.isFinite(n))
            return "0";
        if (Math.abs(n) < 1e-12)
            return "0";
        const r = Math.round(n * 1e8) / 1e8;
        return String(r);
    }
    let handleN = 0x40;
    function hx() {
        return (handleN++).toString(16).toUpperCase();
    }
    function colorCode(c) {
        if (c === "bylayer")
            return null;
        if (c === "byblock")
            return 0;
        return c;
    }
    function pushEntHead(out, type, e) {
        out.push("0", type, "5", hx(), "100", "AcDbEntity", "8", e.layer);
        if (e.lt !== "bylayer" && e.lt !== "byblock")
            out.push("6", e.lt.toUpperCase());
        const col = colorCode(e.color);
        if (col !== null)
            out.push("62", String(col));
        if (typeof e.lw === "number")
            out.push("370", String(Math.round(e.lw * 100)));
    }
    function writeDxf(doc) {
        handleN = 0x40;
        const out = [];
        const push = (...a) => {
            for (const v of a)
                out.push(String(v));
        };
        push("0", "SECTION", "2", "HEADER");
        push("9", "$ACADVER", "1", "AC1015");
        push("9", "$HANDSEED", "5", "FFFF");
        push("9", "$INSUNITS", "70", String(doc.units));
        push("9", "$LTSCALE", "40", num(doc.ltscale));
        push("9", "$CLAYER", "8", doc.currentLayer);
        push("9", "$LIMMIN", "10", "0", "20", "0");
        push("9", "$LIMMAX", "10", "420", "20", "297");
        push("0", "ENDSEC");
        push("0", "SECTION", "2", "TABLES");
        push("0", "TABLE", "2", "LTYPE", "5", hx(), "100", "AcDbSymbolTable", "70", String(entities_ts_1.LINETYPES.length));
        for (const name of entities_ts_1.LINETYPES) {
            const pat = LT_PAT[name] ?? [];
            push("0", "LTYPE", "5", hx(), "100", "AcDbSymbolTableRecord", "100", "AcDbLinetypeTableRecord");
            push("2", name.toUpperCase(), "70", "0", "3", name, "72", "65", "73", String(pat.length), "40", num(pat.reduce((s, x) => s + Math.abs(x), 0)));
            for (const p of pat)
                push("49", num(p));
        }
        push("0", "ENDTAB");
        push("0", "TABLE", "2", "LAYER", "5", hx(), "100", "AcDbSymbolTable", "70", String(doc.layers.length));
        for (const layer of doc.layers) {
            let flags = 0;
            if (layer.frozen)
                flags |= 1;
            if (layer.locked)
                flags |= 4;
            const col = layer.on ? layer.color : -Math.abs(layer.color || 7);
            push("0", "LAYER", "5", hx(), "100", "AcDbSymbolTableRecord", "100", "AcDbLayerTableRecord");
            push("2", layer.name, "70", String(flags), "62", String(col), "6", layer.lt.toUpperCase(), "370", String(Math.round(layer.lw * 100)));
        }
        push("0", "ENDTAB");
        push("0", "TABLE", "2", "APPID", "5", hx(), "100", "AcDbSymbolTable", "70", "1");
        push("0", "APPID", "5", hx(), "100", "AcDbSymbolTableRecord", "100", "AcDbRegAppTableRecord", "2", "ACAD", "70", "0");
        push("0", "ENDTAB");
        const recNames = ["*Model_Space", "*Paper_Space", ...[...doc.blocks.values()].map((bl) => bl.name)];
        push("0", "TABLE", "2", "BLOCK_RECORD", "5", hx(), "100", "AcDbSymbolTable", "70", String(recNames.length));
        for (const rn of recNames)
            push("0", "BLOCK_RECORD", "5", hx(), "100", "AcDbSymbolTableRecord", "100", "AcDbBlockTableRecord", "2", rn);
        push("0", "ENDTAB");
        push("0", "TABLE", "2", "STYLE", "5", hx(), "100", "AcDbSymbolTable", "70", "1");
        push("0", "STYLE", "5", hx(), "100", "AcDbSymbolTableRecord", "100", "AcDbTextStyleTableRecord");
        push("2", "STANDARD", "70", "0", "40", "0", "41", "1", "50", "0", "71", "0", "42", "2.5", "3", "txt", "4", "");
        push("0", "ENDTAB");
        push("0", "ENDSEC");
        push("0", "SECTION", "2", "BLOCKS");
        for (const sp of ["*Model_Space", "*Paper_Space"]) {
            push("0", "BLOCK", "5", hx(), "100", "AcDbEntity", "8", "0", "100", "AcDbBlockBegin", "2", sp, "70", "0", "10", "0", "20", "0", "30", "0", "3", sp, "1", "");
            push("0", "ENDBLK", "5", hx(), "100", "AcDbEntity", "8", "0", "100", "AcDbBlockEnd");
        }
        for (const block of doc.blocks.values()) {
            push("0", "BLOCK", "5", hx(), "100", "AcDbEntity", "8", "0", "100", "AcDbBlockBegin");
            push("2", block.name, "70", "0", "10", num(block.base.x), "20", num(block.base.y), "30", "0", "3", block.name, "1", "");
            for (const e of block.ents)
                writeEntity(out, e);
            push("0", "ENDBLK", "5", hx(), "100", "AcDbEntity", "8", "0", "100", "AcDbBlockEnd");
        }
        push("0", "ENDSEC");
        push("0", "SECTION", "2", "ENTITIES");
        for (const e of doc.all())
            writeEntity(out, e);
        push("0", "ENDSEC");
        push("0", "EOF");
        return out.join("\r\n") + "\r\n";
    }
    function writeEntity(out, e) {
        const push = (...a) => {
            for (const v of a)
                out.push(String(v));
        };
        switch (e.type) {
            case "line":
                pushEntHead(out, "LINE", e);
                push("100", "AcDbLine", "10", num(e.a.x), "20", num(e.a.y), "30", "0", "11", num(e.b.x), "21", num(e.b.y), "31", "0");
                return;
            case "circle":
                pushEntHead(out, "CIRCLE", e);
                push("100", "AcDbCircle", "10", num(e.c.x), "20", num(e.c.y), "30", "0", "40", num(e.r));
                return;
            case "arc": {
                pushEntHead(out, "ARC", e);
                const a0 = (e.a0 * 180) / Math.PI;
                const a1 = ((e.a0 + e.sweep) * 180) / Math.PI;
                push("100", "AcDbCircle", "10", num(e.c.x), "20", num(e.c.y), "30", "0", "40", num(e.r));
                push("100", "AcDbArc", "50", num(a0), "51", num(a1));
                return;
            }
            case "polyline":
                writePolyline(out, e);
                return;
            case "point":
                pushEntHead(out, "POINT", e);
                push("100", "AcDbPoint", "10", num(e.p.x), "20", num(e.p.y), "30", "0");
                return;
            case "text": {
                if (e.text.includes("\n")) {
                    writeMtext(out, e);
                    return;
                }
                pushEntHead(out, "TEXT", e);
                const halign = e.align === "center" ? 1 : e.align === "right" ? 2 : 0;
                push("100", "AcDbText", "10", num(e.p.x), "20", num(e.p.y), "30", "0");
                push("40", num(e.h), "1", e.text.replace(/[\r\n]/g, " "), "50", num((e.rot * 180) / Math.PI), "7", "STANDARD");
                if (halign)
                    push("72", String(halign), "11", num(e.p.x), "21", num(e.p.y), "31", "0");
                push("100", "AcDbText", "73", "0");
                return;
            }
            case "ellipse": {
                pushEntHead(out, "ELLIPSE", e);
                push("100", "AcDbEllipse", "10", num(e.c.x), "20", num(e.c.y), "30", "0");
                push("11", num(e.mx), "21", num(e.my), "31", "0", "40", num(e.ratio));
                push("41", num(e.a0), "42", num(e.a0 + e.sweep));
                return;
            }
            case "spline": {
                pushEntHead(out, "SPLINE", e);
                push("100", "AcDbSpline", "210", "0", "220", "0", "230", "1", "70", "1064", "71", "3", "72", "0", "73", "0", "74", String(e.pts.length));
                push("42", "1e-07", "43", "1e-07", "44", "1e-10");
                for (const p of e.pts)
                    push("11", num(p.x), "21", num(p.y), "31", "0");
                return;
            }
            case "xline":
            case "ray": {
                const dx = e.b.x - e.a.x;
                const dy = e.b.y - e.a.y;
                pushEntHead(out, e.type === "xline" ? "XLINE" : "RAY", e);
                push("100", e.type === "xline" ? "AcDbXline" : "AcDbRay");
                push("10", num(e.a.x), "20", num(e.a.y), "30", "0", "11", num(dx), "21", num(dy), "31", "0");
                return;
            }
            case "donut": {
                const r = (e.ir + e.or) / 2;
                const w = Math.max(0, e.or - e.ir);
                writePolyline(out, {
                    ...e,
                    type: "polyline",
                    pts: [
                        { x: e.c.x - r, y: e.c.y, b: 1 },
                        { x: e.c.x + r, y: e.c.y, b: 1 },
                    ],
                    closed: true,
                    width: w,
                });
                return;
            }
            case "insert":
                pushEntHead(out, "INSERT", e);
                push("100", "AcDbBlockReference", "2", e.name);
                push("10", num(e.p.x), "20", num(e.p.y), "30", "0");
                push("41", num(e.sx), "42", num(e.sy), "50", num((e.rot * 180) / Math.PI));
                return;
            case "hatch":
                writeHatch(out, e);
                return;
            case "dim":
                for (const part of (0, entities_ts_1.explodeDim)(e))
                    writeEntity(out, part);
                return;
            default:
                return;
        }
    }
    function writePolyline(out, e) {
        const push = (...a) => {
            for (const v of a)
                out.push(String(v));
        };
        pushEntHead(out, "LWPOLYLINE", e);
        push("100", "AcDbPolyline", "90", String(e.pts.length), "70", e.closed ? "1" : "0");
        if (e.width > 1e-9)
            push("43", num(e.width));
        for (const p of e.pts) {
            push("10", num(p.x), "20", num(p.y));
            if (p.b)
                push("42", num(p.b));
        }
    }
    function writeMtext(out, e) {
        const push = (...a) => {
            for (const v of a)
                out.push(String(v));
        };
        const body = e.text.replace(/\n/g, "\\P");
        pushEntHead(out, "MTEXT", e);
        push("100", "AcDbMText", "10", num(e.p.x - Math.sin(e.rot) * e.h), "20", num(e.p.y + Math.cos(e.rot) * e.h), "30", "0");
        push("40", num(e.h), "41", num(Math.max(e.h, e.text.length * e.h * 0.6)));
        const chunks = body.match(/[\s\S]{1,250}/g) ?? [""];
        for (let i = 0; i < chunks.length - 1; i++)
            push("3", chunks[i]);
        push("1", chunks[chunks.length - 1] ?? "");
        push("50", num((e.rot * 180) / Math.PI), "71", e.align === "center" ? "2" : e.align === "right" ? "3" : "1");
    }
    function writeHatch(out, e) {
        const push = (...a) => {
            for (const v of a)
                out.push(String(v));
        };
        pushEntHead(out, "HATCH", e);
        push("100", "AcDbHatch");
        push("10", "0", "20", "0", "30", "0", "210", "0", "220", "0", "230", "1");
        push("2", e.solid ? "SOLID" : e.pattern);
        push("70", e.solid ? "1" : "0", "71", "0");
        push("91", String(e.loops.length));
        for (const loop of e.loops) {
            if ("circle" in loop) {
                // Non-polyline edge: one circular edge.
                push("92", "1", "93", "1", "72", "2");
                push("10", num(loop.circle.c.x), "20", num(loop.circle.c.y), "40", num(loop.circle.r));
                push("50", "0", "51", "360");
                push("73", "1");
                push("97", "0");
            }
            else {
                push("92", "7", "72", "1", "73", loop.closed ? "1" : "0", "93", String(loop.pts.length));
                for (const p of loop.pts) {
                    push("10", num(p.x), "20", num(p.y));
                    push("42", num(p.b ?? 0));
                }
                push("97", "0");
            }
        }
        push("75", "0", "76", "1");
        if (!e.solid) {
            push("52", num(e.angle), "41", num(e.scale));
            const def = patternDef(e.pattern);
            push("77", "0", "78", String(def.length));
            for (const line of def) {
                push("53", num(line.ang + e.angle), "43", "0", "44", "0");
                push("45", num(line.ox * e.scale), "46", num(line.oy * e.scale), "79", "0");
            }
        }
        push("98", "1", "10", "0", "20", "0");
    }
    function patternDef(name) {
        const n = name.toUpperCase();
        if (n === "ANSI37")
            return [
                { ang: 45, ox: 0, oy: 3.175 },
                { ang: 135, ox: 0, oy: 3.175 },
            ];
        if (n === "ANSI32")
            return [
                { ang: 45, ox: 0, oy: 3.175 },
                { ang: 45, ox: 1.5875, oy: 3.175 },
            ];
        if (n === "DOTS")
            return [{ ang: 0, ox: 0, oy: 3.175 }];
        return [{ ang: 45, ox: 0, oy: 3.175 }];
    }
    function lex(text) {
        const lines = text.replace(/^\uFEFF/, "").split(/\r\n|\n|\r/);
        const out = [];
        for (let i = 0; i + 1 < lines.length; i += 2) {
            const c = Number(lines[i].trim());
            if (!Number.isFinite(c))
                break;
            out.push({ c, v: lines[i + 1] ?? "" });
        }
        return out;
    }
    function f(v) {
        const n = Number(v.trim());
        return Number.isFinite(n) ? n : 0;
    }
    function bagGet(bag, code, all = false) {
        const xs = bag.filter((p) => p.c === code).map((p) => p.v);
        return all ? xs : xs.slice(-1);
    }
    function readDxf(text) {
        const pairs = lex(text);
        const warnings = [];
        const doc = new doc_ts_1.Doc();
        doc.layers = [];
        doc.clearGeometry();
        let maxId = 1;
        const takeId = () => {
            const id = maxId.toString(36);
            maxId++;
            return id;
        };
        let i = 0;
        let section = "";
        const entities = [];
        const blocks = new Map();
        const readBag = () => {
            if (i >= pairs.length || pairs[i].c !== 0)
                return null;
            const type = pairs[i].v.trim();
            i++;
            const bag = [];
            while (i < pairs.length && pairs[i].c !== 0)
                bag.push(pairs[i++]);
            return { type, bag };
        };
        const readLegacyPolyline = (rec) => {
            const verts = [];
            const closed = (f(bagGet(rec.bag, 70)[0] ?? "0") & 1) !== 0;
            const common = commonStyle(rec.bag);
            while (i < pairs.length) {
                const peek = pairs[i];
                if (peek.c !== 0)
                    break;
                const nt = peek.v.trim().toUpperCase();
                if (nt === "SEQEND") {
                    readBag();
                    break;
                }
                if (nt !== "VERTEX")
                    break;
                const vr = readBag();
                if (!vr)
                    break;
                const x = f(bagGet(vr.bag, 10)[0] ?? "0");
                const y = f(bagGet(vr.bag, 20)[0] ?? "0");
                const b = f(bagGet(vr.bag, 42)[0] ?? "0");
                verts.push(b ? { x, y, b } : { x, y });
            }
            if (verts.length < 2)
                return null;
            return { ...common, id: takeId(), type: "polyline", pts: verts, closed, width: f(bagGet(rec.bag, 40)[0] ?? "0") };
        };
        while (i < pairs.length) {
            const rec = readBag();
            if (!rec)
                break;
            const t = rec.type.toUpperCase();
            if (t === "SECTION") {
                section = (bagGet(rec.bag, 2)[0] ?? "").trim().toUpperCase();
                continue;
            }
            if (t === "ENDSEC") {
                section = "";
                continue;
            }
            if (t === "EOF")
                break;
            if (section === "HEADER") {
                // header vars are 9 then value, but they're not 0-separated the way we split.
                // We only split on group 0, so the whole HEADER is one bag if no 0 inside.
                // $ACADVER etc. live in the SECTION bag... actually HEADER pairs are not
                // introduced by group 0, so they were consumed as the SECTION bag. Handled below.
                continue;
            }
            if (section === "TABLES" && t === "LAYER") {
                const name = (bagGet(rec.bag, 2)[0] ?? "0").trim();
                const flags = f(bagGet(rec.bag, 70)[0] ?? "0");
                let col = f(bagGet(rec.bag, 62)[0] ?? "7");
                const on = col >= 0;
                col = Math.abs(col) || 7;
                const lt = mapLt((bagGet(rec.bag, 6)[0] ?? "CONTINUOUS").trim());
                const lw = Math.abs(f(bagGet(rec.bag, 370)[0] ?? "25")) / 100;
                doc.layers.push({
                    name,
                    color: col > 255 ? 7 : col,
                    lt,
                    lw: lw > 2.11 ? 0.25 : lw,
                    on,
                    frozen: (flags & 1) !== 0,
                    locked: (flags & 4) !== 0,
                });
                continue;
            }
            if (section === "BLOCKS" && t === "BLOCK") {
                const name = (bagGet(rec.bag, 2)[0] ?? "").trim();
                const base = { x: f(bagGet(rec.bag, 10)[0] ?? "0"), y: f(bagGet(rec.bag, 20)[0] ?? "0") };
                const ents = [];
                if (/^\*(model_space|paper_space)/i.test(name)) {
                    while (i < pairs.length) {
                        const peek = pairs[i];
                        if (peek.c === 0 && peek.v.trim().toUpperCase() === "ENDBLK") {
                            readBag();
                            break;
                        }
                        readBag();
                    }
                    continue;
                }
                while (i < pairs.length) {
                    const peek = pairs[i];
                    if (peek.c === 0 && peek.v.trim().toUpperCase() === "ENDBLK") {
                        readBag();
                        break;
                    }
                    const er = readBag();
                    if (!er)
                        break;
                    if (er.type.toUpperCase() === "POLYLINE") {
                        const poly = readLegacyPolyline(er);
                        if (poly)
                            ents.push(poly);
                        continue;
                    }
                    if (er.type.toUpperCase() === "DIMENSION") {
                        const dref = bagGet(er.bag, 2)[0];
                        if (dref && blocks.has(dref.trim().toLowerCase())) {
                            ents.push({ ...commonStyle(er.bag), id: takeId(), type: "insert", name: dref.trim(), p: { x: 0, y: 0 }, sx: 1, sy: 1, rot: 0 });
                            continue;
                        }
                    }
                    const ent = entityFrom(er.type, er.bag, takeId, warnings);
                    if (ent)
                        ents.push(ent);
                }
                if (name)
                    blocks.set(name.toLowerCase(), { name, base, ents: /^\*d/i.test(name) ? ents.filter((en) => en.type !== "point") : ents });
                continue;
            }
            if (section === "ENTITIES") {
                if (t === "POLYLINE") {
                    const poly = readLegacyPolyline(rec);
                    if (poly)
                        entities.push(poly);
                    continue;
                }
                if (t === "DIMENSION") {
                    // Dimensions carry their drawn geometry in an anonymous block: keep that, it is exactly what the source CAD showed.
                    const dref = (bagGet(rec.bag, 2)[0] ?? "").trim();
                    if (dref && blocks.has(dref.toLowerCase())) {
                        entities.push({ ...commonStyle(rec.bag), id: takeId(), type: "insert", name: dref, p: { x: 0, y: 0 }, sx: 1, sy: 1, rot: 0 });
                        continue;
                    }
                }
                const ent = entityFrom(rec.type, rec.bag, takeId, warnings);
                if (ent)
                    entities.push(ent);
                else if (!["SEQEND", "VERTEX", "ENDBLK", "ENDTAB", "TABLE"].includes(t)) {
                    if (t !== "VIEWPORT" && t !== "DIMENSION" && t !== "ATTDEF" && t !== "ATTRIB")
                        warnings.push(`Skipped ${t}`);
                    if (t === "DIMENSION") {
                        const dim = dimensionFrom(rec.bag, takeId);
                        if (dim)
                            entities.push(dim);
                    }
                }
            }
        }
        // HEADER was swallowed. Scan raw pairs for $INSUNITS, $LTSCALE, $CLAYER.
        for (let k = 0; k < pairs.length; k++) {
            if (pairs[k].c === 9) {
                const key = pairs[k].v.trim().toUpperCase();
                const val = pairs[k + 1];
                if (!val)
                    continue;
                if (key === "$INSUNITS")
                    doc.units = f(val.v);
                if (key === "$LTSCALE")
                    doc.ltscale = f(val.v) || 1;
                if (key === "$CLAYER" && val.c === 8)
                    doc.currentLayer = val.v.trim() || "0";
            }
        }
        if (!doc.layers.length)
            doc.layers = [{ name: "0", color: 7, lt: "continuous", lw: 0.25, on: true, frozen: false, locked: false }];
        if (!doc.layers.some((l) => l.name === "0")) {
            doc.layers.unshift({ name: "0", color: 7, lt: "continuous", lw: 0.25, on: true, frozen: false, locked: false });
        }
        if (!doc.layers.some((l) => l.name.toLowerCase() === doc.currentLayer.toLowerCase()))
            doc.currentLayer = "0";
        for (const e of entities)
            doc.add(e);
        for (const b of blocks.values())
            doc.blocks.set(b.name.toLowerCase(), b);
        (0, entities_ts_1.resetIds)(maxId + 2);
        doc.past = [];
        doc.future = [];
        doc.bump();
        return { doc, warnings };
    }
    function readLegacyPoly(_bag, _id, _warnings, _next) {
        return null;
    }
    function mapLt(name) {
        const n = name.toLowerCase().replace(/\s+/g, "");
        if (n.includes("phantom"))
            return "phantom";
        if (n.includes("center") || n.includes("centre"))
            return "center";
        if (n.includes("hidden") || n.includes("dashdot") && n.includes("hidden"))
            return "hidden";
        if (n.includes("divide"))
            return "divide";
        if (n.includes("dashdot"))
            return "dashdot";
        if (n === "dot" || n.includes("dotted"))
            return "dot";
        if (n.includes("dash"))
            return "dashed";
        if (entities_ts_1.LINETYPES.includes(n))
            return n;
        return "continuous";
    }
    function commonStyle(bag) {
        const layer = (bagGet(bag, 8)[0] ?? "0").trim() || "0";
        let color = "bylayer";
        const c62 = bag.find((p) => p.c === 62);
        if (c62) {
            const n = f(c62.v);
            if (n === 0)
                color = "byblock";
            else if (n === 256)
                color = "bylayer";
            else if (n > 0 && n < 256)
                color = n;
        }
        const truecolor = bag.find((p) => p.c === 420);
        if (truecolor && color === "bylayer") {
            const n = f(truecolor.v) >>> 0;
            const r = (n >> 16) & 255;
            const g = (n >> 8) & 255;
            const b = n & 255;
            color = (0, aci_ts_1.nearestAci)(r, g, b);
        }
        let lt = "bylayer";
        const c6 = bag.find((p) => p.c === 6);
        if (c6) {
            const name = c6.v.trim().toLowerCase();
            if (name === "bylayer")
                lt = "bylayer";
            else if (name === "byblock")
                lt = "byblock";
            else
                lt = mapLt(name);
        }
        let lw = "bylayer";
        const c370 = bag.find((p) => p.c === 370);
        if (c370) {
            const n = f(c370.v);
            if (n === -1)
                lw = "bylayer";
            else if (n === -2)
                lw = "byblock";
            else if (n >= 0)
                lw = n / 100;
        }
        return { layer, color, lt, lw };
    }
    function entityFrom(type, bag, id, warnings) {
        const t = type.trim().toUpperCase();
        const st = commonStyle(bag);
        const x = (code, nth = 0) => f((bag.filter((p) => p.c === code)[nth] ?? { v: "0" }).v);
        if (t === "LINE") {
            return { ...st, id: id(), type: "line", a: { x: x(10), y: x(20) }, b: { x: x(11), y: x(21) } };
        }
        const flip = x(230) < 0 ? -1 : 1; // extrusion toward -Z mirrors the OCS in X
        if (t === "CIRCLE") {
            const r = x(40);
            if (r <= 0)
                return null;
            return { ...st, id: id(), type: "circle", c: { x: flip * x(10), y: x(20) }, r };
        }
        if (t === "ARC") {
            const r = x(40);
            if (r <= 0)
                return null;
            let a0 = (x(50) * Math.PI) / 180;
            let a1 = (x(51) * Math.PI) / 180;
            if (flip < 0) {
                const n0 = Math.PI - a1;
                const n1 = Math.PI - a0;
                a0 = n0;
                a1 = n1;
            }
            return { ...st, id: id(), type: "arc", c: { x: flip * x(10), y: x(20) }, r, a0, sweep: (0, math_ts_1.ccwSweep)(a0, a1) };
        }
        if (t === "POINT")
            return { ...st, id: id(), type: "point", p: { x: flip * x(10), y: x(20) } };
        if (t === "SOLID" || t === "TRACE") {
            const P = (k) => ({ x: flip * x(10 + k), y: x(20 + k) });
            const c = [P(0), P(1), P(3), P(2)];
            const pts = c.filter((p, k) => k === 0 || Math.hypot(p.x - c[k - 1].x, p.y - c[k - 1].y) > 1e-12);
            if (pts.length < 3)
                return null;
            return { ...st, id: id(), type: "hatch", loops: [{ pts, closed: true }], pattern: "SOLID", scale: 1, angle: 0, solid: true };
        }
        if (t === "3DFACE") {
            const c = [0, 1, 2, 3].map((k) => ({ x: x(10 + k), y: x(20 + k) }));
            const pts = c.filter((p, k) => k === 0 || Math.hypot(p.x - c[k - 1].x, p.y - c[k - 1].y) > 1e-12);
            if (pts.length < 3)
                return null;
            return { ...st, id: id(), type: "polyline", pts, closed: true, width: 0 };
        }
        if (t === "LEADER") {
            const pts = [];
            let cur = null;
            for (const p of bag) {
                if (p.c === 10) {
                    if (cur)
                        pts.push(cur);
                    cur = { x: f(p.v), y: 0 };
                }
                else if (p.c === 20 && cur)
                    cur.y = f(p.v);
            }
            if (cur)
                pts.push(cur);
            if (pts.length < 2)
                return null;
            return { ...st, id: id(), type: "polyline", pts, closed: false, width: 0 };
        }
        if (t === "LWPOLYLINE") {
            const closed = (f(bagGet(bag, 70)[0] ?? "0") & 1) !== 0;
            const width = f(bagGet(bag, 43)[0] ?? "0");
            const pts = [];
            let cur = null;
            for (const p of bag) {
                if (p.c === 10) {
                    if (cur)
                        pts.push(cur);
                    cur = { x: flip * f(p.v), y: 0 };
                }
                else if (p.c === 20 && cur)
                    cur.y = f(p.v);
                else if (p.c === 42 && cur) {
                    const b = f(p.v);
                    if (Math.abs(b) > 1e-12)
                        cur.b = flip * b;
                }
            }
            if (cur)
                pts.push(cur);
            if (pts.length < 2)
                return null;
            return { ...st, id: id(), type: "polyline", pts, closed, width };
        }
        if (t === "TEXT" || t === "ATTRIB") {
            const text = bagGet(bag, 1)[0] ?? "";
            const h = x(40) || 2.5;
            const rot = (x(50) * Math.PI) / 180;
            const halign = f(bagGet(bag, 72)[0] ?? "0");
            const valign = f(bagGet(bag, 73)[0] ?? "0");
            const hasAlign = halign !== 0 || valign !== 0;
            const p = hasAlign ? { x: x(11) || x(10), y: x(21) || x(20) } : { x: x(10), y: x(20) };
            const align = halign === 1 ? "center" : halign === 2 ? "right" : "left";
            return { ...st, id: id(), type: "text", p, h, rot, text: decodeText(text), align };
        }
        if (t === "MTEXT") {
            const parts = [...bag.filter((p) => p.c === 3).map((p) => p.v), ...bag.filter((p) => p.c === 1).map((p) => p.v)];
            const h = x(40) || 2.5;
            const hasDir = bag.some((p) => p.c === 11);
            const rot = hasDir ? Math.atan2(x(21), x(11)) : (x(50) * Math.PI) / 180;
            const att = f(bagGet(bag, 71)[0] ?? "1");
            const align = att === 2 || att === 5 || att === 8 ? "center" : att === 3 || att === 6 || att === 9 ? "right" : "left";
            const body = decodeText(parts.join(""));
            const nLines = body.split("\n").length;
            // MTEXT is anchored at its box; Northline text is anchored at the first baseline.
            const drop = att <= 3 ? h : att <= 6 ? h - (nLines * h * 1.25) / 2 + h * 0.25 : -(nLines - 1) * h * 1.25;
            const p = { x: x(10) + Math.sin(rot) * drop, y: x(20) - Math.cos(rot) * drop };
            return { ...st, id: id(), type: "text", p, h, rot, text: body, align };
        }
        if (t === "ELLIPSE") {
            const mx = x(11);
            const my = x(21);
            const ratio = x(40) || 1;
            const a0 = x(41);
            const a1 = x(42);
            let sweep = a1 - a0;
            if (sweep <= 1e-9)
                sweep += Math.PI * 2;
            return { ...st, id: id(), type: "ellipse", c: { x: x(10), y: x(20) }, mx, my, ratio, a0, sweep };
        }
        if (t === "SPLINE") {
            const fit = [];
            const ctrl = [];
            const knots = [];
            const weights = [];
            let mode = "none";
            let cur = null;
            const flush = () => {
                if (!cur)
                    return;
                if (mode === "fit")
                    fit.push(cur);
                else
                    ctrl.push(cur);
                cur = null;
            };
            for (const p of bag) {
                if (p.c === 10) {
                    flush();
                    mode = "ctrl";
                    cur = { x: f(p.v), y: 0 };
                }
                else if (p.c === 11) {
                    flush();
                    mode = "fit";
                    cur = { x: f(p.v), y: 0 };
                }
                else if ((p.c === 20 || p.c === 21) && cur)
                    cur.y = f(p.v);
                else if (p.c === 40)
                    knots.push(f(p.v));
                else if (p.c === 41)
                    weights.push(f(p.v));
            }
            flush();
            const degree = f(bagGet(bag, 71)[0] ?? "3") || 3;
            if (ctrl.length >= degree + 1 && knots.length === ctrl.length + degree + 1) {
                const pts = sampleBSpline(degree, knots, ctrl, weights);
                if (pts.length >= 2)
                    return { ...st, id: id(), type: "spline", pts };
            }
            const pts = fit.length >= 2 ? fit : ctrl;
            if (pts.length < 2)
                return null;
            return { ...st, id: id(), type: "spline", pts };
        }
        if (t === "XLINE" || t === "RAY") {
            const a = { x: x(10), y: x(20) };
            const b = { x: a.x + x(11), y: a.y + x(21) };
            return { ...st, id: id(), type: t === "XLINE" ? "xline" : "ray", a, b };
        }
        if (t === "INSERT") {
            const name = (bagGet(bag, 2)[0] ?? "").trim();
            if (!name || (name.startsWith("*") && !/^\*[du]/i.test(name)))
                return null;
            return {
                ...st,
                id: id(),
                type: "insert",
                name,
                p: { x: x(10), y: x(20) },
                sx: x(41) || 1,
                sy: x(42) || x(41) || 1,
                rot: (x(50) * Math.PI) / 180,
            };
        }
        if (t === "HATCH") {
            const name = (bagGet(bag, 2)[0] ?? "SOLID").trim();
            const solid = f(bagGet(bag, 70)[0] ?? "0") === 1 || name.toUpperCase() === "SOLID";
            const scale = f(bagGet(bag, 41)[0] ?? "1") || 1;
            const angle = f(bagGet(bag, 52)[0] ?? "0");
            const loops = readHatchLoops(bag);
            if (!loops.length) {
                warnings.push("Hatch without a readable boundary");
                return null;
            }
            return { ...st, id: id(), type: "hatch", loops, pattern: name.toUpperCase(), scale, angle, solid };
        }
        if (t === "DIMENSION")
            return dimensionFrom(bag, id);
        return null;
    }
    function sampleBSpline(p, U, P, W) {
        const n = P.length - 1;
        const rational = W.length === P.length;
        const t0 = U[p];
        const t1 = U[n + 1];
        if (!(t1 > t0))
            return [];
        const spans = Math.max(1, n - p + 1);
        const N = Math.min(600, Math.max(24, spans * 18));
        const out = [];
        for (let s = 0; s <= N; s++) {
            const t = Math.min(t1 - 1e-12 * (t1 - t0), t0 + ((t1 - t0) * s) / N);
            let k = p;
            while (k < n && t >= U[k + 1])
                k++;
            const d = [];
            for (let j = 0; j <= p; j++) {
                const w = rational ? W[j + k - p] : 1;
                d.push({ x: P[j + k - p].x * w, y: P[j + k - p].y * w, w });
            }
            for (let r = 1; r <= p; r++) {
                for (let j = p; j >= r; j--) {
                    const den = U[j + 1 + k - r] - U[j + k - p];
                    const a = den === 0 ? 0 : (t - U[j + k - p]) / den;
                    d[j] = {
                        x: (1 - a) * d[j - 1].x + a * d[j].x,
                        y: (1 - a) * d[j - 1].y + a * d[j].y,
                        w: (1 - a) * d[j - 1].w + a * d[j].w,
                    };
                }
            }
            const q = d[p];
            if (q.w)
                out.push({ x: q.x / q.w, y: q.y / q.w });
        }
        return out;
    }
    function readHatchLoops(bag) {
        const loops = [];
        let i = bag.findIndex((q) => q.c === 91);
        if (i < 0)
            return legacyHatchLoops(bag);
        const nLoops = f(bag[i].v);
        i++;
        for (let li = 0; li < nLoops && i < bag.length; li++) {
            while (i < bag.length && bag[i].c !== 92)
                i++;
            if (i >= bag.length)
                break;
            const flags = f(bag[i].v);
            i++;
            if (flags & 2) {
                let hasBulge = false;
                let count = 0;
                while (i < bag.length && bag[i].c !== 93) {
                    if (bag[i].c === 72)
                        hasBulge = f(bag[i].v) !== 0;
                    i++;
                }
                count = f(bag[i]?.v ?? "0");
                i++;
                const pts = [];
                while (i < bag.length && pts.length < count) {
                    if (bag[i].c === 10) {
                        const q = { x: f(bag[i].v), y: 0 };
                        i++;
                        if (bag[i]?.c === 20) {
                            q.y = f(bag[i].v);
                            i++;
                        }
                        if (hasBulge && bag[i]?.c === 42) {
                            const b = f(bag[i].v);
                            if (Math.abs(b) > 1e-12)
                                q.b = b;
                            i++;
                        }
                        pts.push(q);
                    }
                    else
                        i++;
                }
                if (pts.length >= 3)
                    loops.push({ pts, closed: true });
            }
            else {
                const nEdges = f(bag[i]?.v ?? "0");
                i++;
                const pts = [];
                let circle = null;
                for (let ei = 0; ei < nEdges && i < bag.length; ei++) {
                    while (i < bag.length && bag[i].c !== 72)
                        i++;
                    const type = f(bag[i]?.v ?? "0");
                    i++;
                    const vals = {};
                    while (i < bag.length && ![72, 97, 92, 75, 76].includes(bag[i].c)) {
                        vals[bag[i].c] = f(bag[i].v);
                        i++;
                    }
                    if (type === 1)
                        pts.push({ x: vals[10] ?? 0, y: vals[20] ?? 0 });
                    else if (type === 2) {
                        const c = { x: vals[10] ?? 0, y: vals[20] ?? 0 };
                        const r = vals[40] ?? 0;
                        const a0 = ((vals[50] ?? 0) * Math.PI) / 180;
                        const a1 = ((vals[51] ?? 360) * Math.PI) / 180;
                        const ccw = (vals[73] ?? 1) !== 0;
                        let sweep = ccw ? (0, math_ts_1.ccwSweep)(a0, a1) : -(0, math_ts_1.ccwSweep)(a1, a0);
                        if (Math.abs(a1 - a0) >= Math.PI * 2 - 1e-6 && nEdges === 1) {
                            circle = { circle: { c, r } };
                            break;
                        }
                        if (Math.abs(sweep) < 1e-9)
                            sweep = Math.PI * 2;
                        const start = ccw ? a0 : a0;
                        pts.push({ x: c.x + Math.cos(start) * r, y: c.y + Math.sin(start) * r, b: Math.tan(sweep / 4) });
                    }
                    else if (type === 3) {
                        // elliptical arc edge: approximate with samples
                        const c = { x: vals[10] ?? 0, y: vals[20] ?? 0 };
                        const mx = vals[11] ?? 1;
                        const my = vals[21] ?? 0;
                        const ratio = vals[40] ?? 1;
                        const a0 = ((vals[50] ?? 0) * Math.PI) / 180;
                        let a1 = ((vals[51] ?? 360) * Math.PI) / 180;
                        if (a1 <= a0)
                            a1 += Math.PI * 2;
                        const L = Math.hypot(mx, my) || 1;
                        for (let k = 0; k < 24; k++) {
                            const a = a0 + ((a1 - a0) * k) / 24;
                            pts.push({ x: c.x + Math.cos(a) * mx - Math.sin(a) * (my / L) * L * ratio, y: c.y + Math.cos(a) * my + Math.sin(a) * (mx / L) * L * ratio });
                        }
                    }
                }
                if (circle)
                    loops.push(circle);
                else if (pts.length >= 3)
                    loops.push({ pts, closed: true });
            }
        }
        return loops;
    }
    function legacyHatchLoops(bag) {
        const loops = [];
        // Walk looking for boundary vertex runs (group 93 count followed by 10/20).
        for (let i = 0; i < bag.length; i++) {
            if (bag[i].c === 92 && bag[i + 1] && (f(bag[i].v) & 2) !== 0) {
                // polyline boundary — find 93
                let count = 0;
                let j = i + 1;
                while (j < bag.length && bag[j].c !== 93 && bag[j].c !== 92)
                    j++;
                if (bag[j]?.c === 93) {
                    count = f(bag[j].v);
                    j++;
                }
                const pts = [];
                let cur = null;
                while (j < bag.length && pts.length < count && bag[j].c !== 97 && bag[j].c !== 92) {
                    const p = bag[j];
                    if (p.c === 10) {
                        if (cur)
                            pts.push(cur);
                        cur = { x: f(p.v), y: 0 };
                    }
                    else if (p.c === 20 && cur)
                        cur.y = f(p.v);
                    else if (p.c === 42 && cur) {
                        const b = f(p.v);
                        if (Math.abs(b) > 1e-12)
                            cur.b = b;
                    }
                    j++;
                }
                if (cur)
                    pts.push(cur);
                if (pts.length >= 3)
                    loops.push({ pts, closed: true });
                i = j;
            }
            else if (bag[i].c === 72 && f(bag[i].v) === 2) {
                // circular edge following
                let cx = 0;
                let cy = 0;
                let r = 0;
                for (let j = i + 1; j < Math.min(bag.length, i + 8); j++) {
                    if (bag[j].c === 10)
                        cx = f(bag[j].v);
                    if (bag[j].c === 20)
                        cy = f(bag[j].v);
                    if (bag[j].c === 40)
                        r = f(bag[j].v);
                }
                if (r > 0)
                    loops.push({ circle: { c: { x: cx, y: cy }, r } });
            }
        }
        return loops;
    }
    function dimensionFrom(bag, id) {
        const st = commonStyle(bag);
        const type = f(bagGet(bag, 70)[0] ?? "0") & 7;
        const p1 = { x: x1(bag, 13), y: y1(bag, 23) };
        const p2 = { x: x1(bag, 14), y: y1(bag, 24) };
        const loc = { x: x1(bag, 10), y: y1(bag, 20) };
        if (type === 0 || type === 1) {
            const axis = type === 1 ? "aligned" : Math.abs(p2.x - p1.x) >= Math.abs(p2.y - p1.y) ? "h" : "v";
            return { ...st, id: id(), type: "dim", dim: { kind: "linear", axis, p1, p2, loc } };
        }
        return null;
    }
    function x1(bag, code) {
        return f(bagGet(bag, code)[0] ?? "0");
    }
    function y1(bag, code) {
        return f(bagGet(bag, code)[0] ?? "0");
    }
    function decodeText(s) {
        return s
            .replace(/\\P/g, "\n")
            .replace(/\\~/g, " ")
            .replace(/%%[dD]/g, "°")
            .replace(/%%[cC]/g, "Ø")
            .replace(/%%[pP]/g, "±")
            .replace(/\\[A-Za-z][^;]*;/g, "")
            .replace(/[{}]/g, "");
    }
    function downloadDxf(doc, filename) {
        const text = writeDxf(doc);
        const blob = new Blob([text], { type: "application/dxf" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename.toLowerCase().endsWith(".dxf") ? filename : `${filename}.dxf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }
    void entities_ts_1.uid;

  };

  factories["snaps.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_OSNAP = void 0;
    exports.findSnap = findSnap;
    exports.orthoPoint = orthoPoint;
    exports.polarPoint = polarPoint;
    exports.entityUnder = entityUnder;
    const entities_ts_1 = require("./entities.ts");
    const geom_ts_1 = require("./geom.ts");
    const math_ts_1 = require("./math.ts");
    exports.DEFAULT_OSNAP = {
        endpoint: true,
        midpoint: true,
        center: true,
        quadrant: true,
        intersection: true,
        perpendicular: false,
        tangent: false,
        node: true,
        insert: true,
        nearest: false,
    };
    const PRIORITY = {
        intersection: 0,
        endpoint: 1,
        midpoint: 2,
        center: 3,
        quadrant: 4,
        perpendicular: 5,
        tangent: 6,
        node: 7,
        insert: 8,
        nearest: 9,
    };
    function findSnap(doc, index, cursor, aperture, modes, from) {
        const near = index
            .near(doc, cursor, aperture * 4)
            .filter((e) => (0, entities_ts_1.snapEligible)(e, doc.layers))
            .map((e) => ({ e, d: (0, entities_ts_1.hitDist)(e, cursor, doc.ctx()) }))
            .sort((a, b) => a.d - b.d)
            .slice(0, 40)
            .map((x) => x.e);
        const hits = [];
        const push = (p, kind) => {
            if (!modes[kind])
                return;
            if ((0, math_ts_1.dist)(p, cursor) <= aperture)
                hits.push({ p, kind, priority: PRIORITY[kind] ?? 9 });
        };
        for (const e of near) {
            if (modes.endpoint || modes.midpoint || modes.center || modes.node || modes.insert || modes.quadrant) {
                for (const g of (0, entities_ts_1.gripsOf)(e)) {
                    if (g.kind === "end" || g.kind === "vertex")
                        push(g.p, "endpoint");
                    else if (g.kind === "mid")
                        push(g.p, "midpoint");
                    else if (g.kind === "cen")
                        push(g.p, "center");
                    else if (g.kind === "quad")
                        push(g.p, "quadrant");
                    else if (g.kind === "ins")
                        push(g.p, e.type === "point" ? "node" : "insert");
                }
            }
            if (e.type === "point")
                push(e.p, "node");
            if (e.type === "text" || e.type === "insert")
                push(e.p, "insert");
            if (e.type === "circle" || e.type === "arc" || e.type === "donut") {
                const c = e.c;
                const r = e.type === "donut" ? e.or : e.r;
                for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
                    if (e.type === "arc" && !(0, math_ts_1.angInSweep)(a, e.a0, e.sweep))
                        continue;
                    push((0, geom_ts_1.arcPoint)(c, r, a), "quadrant");
                }
                push(c, "center");
            }
        }
        if (modes.intersection && near.length > 1) {
            const limited = near.slice(0, 18);
            for (let i = 0; i < limited.length; i++) {
                const A = (0, entities_ts_1.curvesOf)(limited[i], doc.ctx()).slice(0, 8);
                for (let j = i + 1; j < limited.length; j++) {
                    const B = (0, entities_ts_1.curvesOf)(limited[j], doc.ctx()).slice(0, 8);
                    for (const a of A) {
                        for (const b of B) {
                            for (const p of (0, geom_ts_1.curveHits)(a, b))
                                push(p, "intersection");
                        }
                    }
                }
            }
        }
        if (from && (modes.perpendicular || modes.tangent || modes.nearest)) {
            for (const e of near) {
                const curves = (0, entities_ts_1.curvesOf)(e, doc.ctx()).slice(0, 12);
                for (const c of curves) {
                    if (modes.perpendicular) {
                        const foot = perpendicular(from, c);
                        if (foot)
                            push(foot, "perpendicular");
                    }
                    if (modes.tangent && (c.k === "circle" || c.k === "arc")) {
                        for (const p of (0, geom_ts_1.tangentPoints)(c.c, c.r, from)) {
                            if (c.k === "arc" && !(0, math_ts_1.angInSweep)(Math.atan2(p.y - c.c.y, p.x - c.c.x), c.a0, c.sweep))
                                continue;
                            push(p, "tangent");
                        }
                    }
                    if (modes.nearest) {
                        const q = (0, geom_ts_1.closestOnCurve)(cursor, c);
                        if (q)
                            push(q.pt, "nearest");
                    }
                }
            }
        }
        else if (modes.nearest) {
            for (const e of near) {
                for (const c of (0, entities_ts_1.curvesOf)(e, doc.ctx()).slice(0, 12)) {
                    const q = (0, geom_ts_1.closestOnCurve)(cursor, c);
                    if (q)
                        push(q.pt, "nearest");
                }
            }
        }
        if (!hits.length)
            return null;
        const eps = aperture * 0.05;
        hits.sort((a, b) => {
            const da = (0, math_ts_1.dist)(a.p, cursor);
            const db = (0, math_ts_1.dist)(b.p, cursor);
            return Math.abs(da - db) > eps ? da - db : a.priority - b.priority;
        });
        return hits[0] ?? null;
    }
    function perpendicular(from, c) {
        if (c.k === "line" || c.k === "ray" || c.k === "xline") {
            const a = c.k === "line" ? c.a : c.p;
            const d = c.k === "line" ? (0, math_ts_1.norm)((0, math_ts_1.sub)(c.b, c.a)) : c.d;
            if (d.x === 0 && d.y === 0)
                return null;
            const t = (0, math_ts_1.dot)((0, math_ts_1.sub)(from, a), d);
            const q = { x: a.x + d.x * t, y: a.y + d.y * t };
            if (c.k === "line") {
                const ab = (0, math_ts_1.sub)(c.b, c.a);
                const l2 = (0, math_ts_1.dot)(ab, ab) || 1;
                const u = (0, math_ts_1.dot)((0, math_ts_1.sub)(q, c.a), ab) / l2;
                if (u < -1e-6 || u > 1 + 1e-6)
                    return null;
            }
            else if (c.k === "ray" && t < -1e-6)
                return null;
            return q;
        }
        if (c.k === "circle" || c.k === "arc") {
            const d = (0, math_ts_1.dist)(from, c.c);
            if (d < 1e-9)
                return null;
            const q = {
                x: c.c.x + ((from.x - c.c.x) / d) * c.r,
                y: c.c.y + ((from.y - c.c.y) / d) * c.r,
            };
            const q2 = {
                x: c.c.x - ((from.x - c.c.x) / d) * c.r,
                y: c.c.y - ((from.y - c.c.y) / d) * c.r,
            };
            if (c.k === "arc") {
                const ok = (p) => (0, math_ts_1.angInSweep)(Math.atan2(p.y - c.c.y, p.x - c.c.x), c.a0, c.sweep);
                if (ok(q))
                    return q;
                if (ok(q2))
                    return q2;
                return null;
            }
            return (0, math_ts_1.dist)(from, q) < (0, math_ts_1.dist)(from, q2) ? q : q2;
        }
        return null;
    }
    function orthoPoint(origin, p) {
        if (Math.abs(p.x - origin.x) >= Math.abs(p.y - origin.y))
            return { x: p.x, y: origin.y };
        return { x: origin.x, y: p.y };
    }
    function polarPoint(origin, p, stepDeg, ppm) {
        const v = (0, math_ts_1.sub)(p, origin);
        const d = Math.hypot(v.x, v.y);
        if (d < 1e-9)
            return null;
        const a = Math.atan2(v.y, v.x);
        const step = (stepDeg * Math.PI) / 180;
        const locked = Math.round(a / step) * step;
        let diff = Math.abs(a - locked);
        diff = Math.min(diff, math_ts_1.TAU - diff);
        const tol = Math.max((3 * Math.PI) / 180, Math.atan2(8 / ppm, d));
        if (diff > tol)
            return null;
        const dir = { x: Math.cos(locked), y: Math.sin(locked) };
        return { p: { x: origin.x + dir.x * d, y: origin.y + dir.y * d }, dir };
    }
    function entityUnder(doc, index, p, tol, selectable) {
        const near = index.near(doc, p, tol * 3);
        let best = null;
        let bestD = tol;
        for (let i = near.length - 1; i >= 0; i--) {
            const e = near[i];
            if (!selectable(e))
                continue;
            // Local import cycle avoidance: hit test inline via curves distance is in entities.hitDist
            const d = (0, entities_ts_1.hitDist)(e, p, doc.ctx());
            if (d <= bestD) {
                bestD = d;
                best = e;
            }
        }
        return best;
    }

  };

  factories["render.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.worldPerPixel = worldPerPixel;
    exports.w2s = w2s;
    exports.s2w = s2w;
    exports.zoomAt = zoomAt;
    exports.viewOfBox = viewOfBox;
    exports.drawScene = drawScene;
    exports.themeFrom = themeFrom;
    const entities_ts_1 = require("./entities.ts");
    const geom_ts_1 = require("./geom.ts");
    const math_ts_1 = require("./math.ts");
    const DASH = {
        continuous: [],
        dashed: [6, 3],
        hidden: [3, 1.5],
        center: [12, 2, 1.5, 2],
        phantom: [12, 2, 1.5, 2, 1.5, 2],
        dot: [0.4, 2],
        dashdot: [6, 2, 0.4, 2],
        divide: [6, 2, 0.4, 2, 0.4, 2],
    };
    function worldPerPixel(view) {
        return 1 / view.ppm;
    }
    function w2s(view, p) {
        return {
            x: (p.x - view.cx) * view.ppm + view.w / 2,
            y: (view.cy - p.y) * view.ppm + view.h / 2,
        };
    }
    function s2w(view, p) {
        return {
            x: (p.x - view.w / 2) / view.ppm + view.cx,
            y: view.cy - (p.y - view.h / 2) / view.ppm,
        };
    }
    function zoomAt(view, screen, factor) {
        const before = s2w(view, screen);
        view.ppm = Math.min(8000, Math.max(0.002, view.ppm * factor));
        const after = s2w(view, screen);
        view.cx += before.x - after.x;
        view.cy += before.y - after.y;
    }
    function viewOfBox(view, minx, miny, maxx, maxy, pad = 1.12) {
        const bw = Math.max(1e-6, maxx - minx);
        const bh = Math.max(1e-6, maxy - miny);
        view.cx = (minx + maxx) / 2;
        view.cy = (miny + maxy) / 2;
        view.ppm = Math.min(view.w / (bw * pad), view.h / (bh * pad));
        view.ppm = Math.min(8000, Math.max(0.002, view.ppm));
    }
    function drawScene(ctx, view, doc, theme, overlay, opts) {
        ctx.clearRect(0, 0, view.w, view.h);
        ctx.fillStyle = theme.model;
        ctx.fillRect(0, 0, view.w, view.h);
        if (opts.grid)
            drawGrid(ctx, view, theme, opts.snapStep);
        drawAxes(ctx, view, theme);
        const list = doc.all();
        for (const e of list) {
            if (e.type === "hatch" && (0, entities_ts_1.visibleEnt)(e, doc.layers))
                drawEntity(ctx, view, doc, e, theme, false, opts.lwt);
        }
        for (const e of list) {
            if (e.type !== "hatch" && (0, entities_ts_1.visibleEnt)(e, doc.layers))
                drawEntity(ctx, view, doc, e, theme, false, opts.lwt);
        }
        for (const id of overlay.selected) {
            const e = doc.get(id);
            if (e && (0, entities_ts_1.visibleEnt)(e, doc.layers))
                strokeEntity(ctx, view, doc, e, theme.select, [], opts.lwt ? 2.2 : 1.6, theme);
        }
        if (overlay.hover) {
            const e = doc.get(overlay.hover);
            if (e && (0, entities_ts_1.visibleEnt)(e, doc.layers) && !overlay.selected.has(e.id))
                strokeEntity(ctx, view, doc, e, theme.preview, [], 1.25, theme);
        }
        for (const e of overlay.preview)
            strokeEntity(ctx, view, doc, e, theme.preview, [5, 4], 1.25, theme);
        if (overlay.trackFrom && overlay.cursor) {
            ctx.save();
            ctx.strokeStyle = theme.preview;
            ctx.globalAlpha = 0.55;
            ctx.setLineDash([2, 6]);
            ctx.lineWidth = 1;
            const a = w2s(view, overlay.trackFrom);
            const b = w2s(view, overlay.cursor);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
        }
        if (overlay.rubber)
            drawRubber(ctx, view, overlay.rubber, theme);
        for (const g of overlay.grips)
            drawGrip(ctx, view, g.p, theme.grip);
        if (overlay.snap)
            drawSnap(ctx, view, overlay.snap.p, overlay.snap.kind, theme.snap);
        if (overlay.showCross && overlay.cursor)
            drawCross(ctx, view, overlay.cursor, theme.cross, overlay.pickbox);
    }
    function drawAxes(ctx, view, theme) {
        const o = w2s(view, { x: 0, y: 0 });
        ctx.save();
        ctx.strokeStyle = theme.axis;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (o.y >= -2 && o.y <= view.h + 2) {
            ctx.moveTo(0, o.y);
            ctx.lineTo(view.w, o.y);
        }
        if (o.x >= -2 && o.x <= view.w + 2) {
            ctx.moveTo(o.x, 0);
            ctx.lineTo(o.x, view.h);
        }
        ctx.stroke();
        ctx.restore();
    }
    function drawGrid(ctx, view, theme, snapStep) {
        const min = s2w(view, { x: 0, y: view.h });
        const max = s2w(view, { x: view.w, y: 0 });
        let step = niceStep(48 / view.ppm);
        if (snapStep > 0 && snapStep * view.ppm >= 8 && snapStep * view.ppm < 160)
            step = snapStep;
        else if (snapStep > 0) {
            const m = Math.ceil(step / snapStep);
            const pow = 2 ** Math.round(Math.log2(Math.max(1, m)));
            if (snapStep * pow * view.ppm >= 10)
                step = snapStep * pow;
        }
        const major = step * 5;
        const x0 = Math.floor(min.x / step) * step;
        const y0 = Math.floor(min.y / step) * step;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = theme.grid;
        let count = 0;
        for (let x = x0; x <= max.x + step; x += step) {
            if (Math.abs(x / major - Math.round(x / major)) < 1e-6)
                continue;
            const s = w2s(view, { x, y: 0 });
            ctx.moveTo(s.x, 0);
            ctx.lineTo(s.x, view.h);
            if (++count > 400)
                break;
        }
        for (let y = y0; y <= max.y + step; y += step) {
            if (Math.abs(y / major - Math.round(y / major)) < 1e-6)
                continue;
            const s = w2s(view, { x: 0, y });
            ctx.moveTo(0, s.y);
            ctx.lineTo(view.w, s.y);
            if (++count > 800)
                break;
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = theme.gridMajor;
        for (let x = Math.floor(min.x / major) * major; x <= max.x + major; x += major) {
            const s = w2s(view, { x, y: 0 });
            ctx.moveTo(s.x, 0);
            ctx.lineTo(s.x, view.h);
        }
        for (let y = Math.floor(min.y / major) * major; y <= max.y + major; y += major) {
            const s = w2s(view, { x: 0, y });
            ctx.moveTo(0, s.y);
            ctx.lineTo(view.w, s.y);
        }
        ctx.stroke();
        ctx.restore();
    }
    function niceStep(target) {
        if (!Number.isFinite(target) || target <= 0)
            return 1;
        const pow = 10 ** Math.floor(Math.log10(target));
        const n = target / pow;
        const m = n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10;
        return m * pow;
    }
    function drawEntity(ctx, view, doc, e, theme, preview, lwt) {
        if (e.type === "insert") {
            const block = doc.blocks.get(e.name.toLowerCase());
            if (!block) {
                strokeEntity(ctx, view, doc, { ...e, type: "circle", c: e.p, r: 1 }, theme.preview, [2, 2], 1, theme);
                return;
            }
            for (const child of (0, entities_ts_1.placedInsert)(e, block))
                drawEntity(ctx, view, doc, child, theme, preview, lwt);
            return;
        }
        const paint = (0, entities_ts_1.resolvedPaint)(e, doc.layers, theme.color7);
        const dash = scaleDash(DASH[paint.lt] ?? [], doc.ltscale, view.ppm);
        const width = lwt ? Math.max(1, paint.lw * 3.1) : 1.15;
        if (e.type === "hatch") {
            drawHatch(ctx, view, e, paint.color);
            return;
        }
        if (e.type === "text") {
            drawText(ctx, view, e, paint.color);
            return;
        }
        if (e.type === "point") {
            const s = w2s(view, e.p);
            ctx.save();
            ctx.strokeStyle = paint.color;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(s.x - 3.5, s.y - 3.5);
            ctx.lineTo(s.x + 3.5, s.y + 3.5);
            ctx.moveTo(s.x + 3.5, s.y - 3.5);
            ctx.lineTo(s.x - 3.5, s.y + 3.5);
            ctx.stroke();
            ctx.restore();
            return;
        }
        if (e.type === "dim") {
            drawDim(ctx, view, doc, e, paint.color, theme);
            return;
        }
        if (e.type === "donut") {
            drawDonut(ctx, view, e, paint.color);
            return;
        }
        strokeEntity(ctx, view, doc, e, paint.color, dash, width, theme);
    }
    function scaleDash(pat, ltscale, ppm) {
        if (!pat.length)
            return [];
        const px = pat.map((n) => Math.max(0.5, n * ltscale * ppm));
        const cycle = px.reduce((s, n) => s + n, 0);
        if (cycle < 3)
            return [];
        return px;
    }
    function strokeEntity(ctx, view, doc, e, color, dash, width, theme) {
        if (e.type === "insert") {
            const block = doc.blocks.get(e.name.toLowerCase());
            if (!block)
                return;
            for (const child of (0, entities_ts_1.placedInsert)(e, block))
                strokeEntity(ctx, view, doc, child, color, dash, width, theme);
            return;
        }
        if (e.type === "hatch") {
            drawHatch(ctx, view, e, color);
            return;
        }
        if (e.type === "text") {
            drawText(ctx, view, e, color);
            return;
        }
        if (e.type === "dim") {
            drawDim(ctx, view, doc, e, color, theme);
            return;
        }
        if (e.type === "point")
            return;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.setLineDash(dash);
        ctx.beginPath();
        traceEntity(ctx, view, e);
        ctx.stroke();
        if (e.type === "polyline" && e.width > 1e-6 && !dash.length) {
            ctx.setLineDash([]);
            ctx.lineWidth = Math.max(width, e.width * view.ppm);
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            traceEntity(ctx, view, e);
            ctx.stroke();
        }
        ctx.restore();
    }
    function traceEntity(ctx, view, e) {
        switch (e.type) {
            case "line": {
                const a = w2s(view, e.a);
                const b = w2s(view, e.b);
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                return;
            }
            case "circle": {
                const s = w2s(view, e.c);
                ctx.moveTo(s.x + e.r * view.ppm, s.y);
                ctx.arc(s.x, s.y, Math.abs(e.r * view.ppm), 0, math_ts_1.TAU);
                return;
            }
            case "arc":
                traceArc(ctx, view, e.c, e.r, e.a0, e.sweep);
                return;
            case "polyline":
                tracePoly(ctx, view, e.pts, e.closed);
                return;
            case "spline":
                tracePoly(ctx, view, (0, entities_ts_1.splineSamples)(e.pts), false);
                return;
            case "ellipse":
                tracePoly(ctx, view, (0, entities_ts_1.ellipseSamples)(e, 64), e.sweep >= math_ts_1.TAU - 1e-3);
                return;
            case "xline":
            case "ray": {
                const seg = clipInfinite(view, e.a, e.b, e.type === "xline");
                if (!seg)
                    return;
                const a = w2s(view, seg[0]);
                const b = w2s(view, seg[1]);
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                return;
            }
            case "donut": {
                const s = w2s(view, e.c);
                ctx.arc(s.x, s.y, e.or * view.ppm, 0, math_ts_1.TAU);
                ctx.moveTo(s.x + e.ir * view.ppm, s.y);
                ctx.arc(s.x, s.y, Math.max(0.5, e.ir * view.ppm), 0, math_ts_1.TAU);
                return;
            }
            default:
                return;
        }
    }
    function traceArc(ctx, view, c, r, a0, sweep) {
        const s = w2s(view, c);
        const rp = Math.abs(r * view.ppm);
        if (rp < 0.4)
            return;
        // World CCW sweep maps to canvas with negated angles. See arc self-check.
        ctx.arc(s.x, s.y, rp, -a0, -(a0 + sweep), sweep > 0);
    }
    function tracePoly(ctx, view, pts, closed) {
        if (!pts.length)
            return;
        const n = pts.length;
        const segs = closed ? n : n - 1;
        const s0 = w2s(view, pts[0]);
        ctx.moveTo(s0.x, s0.y);
        for (let i = 0; i < segs; i++) {
            const p = pts[i];
            const q = pts[(i + 1) % n];
            const arc = p.b ? (0, geom_ts_1.bulgeArc)(p, q, p.b) : null;
            if (!arc) {
                const s = w2s(view, q);
                ctx.lineTo(s.x, s.y);
            }
            else {
                traceArc(ctx, view, arc.c, arc.r, arc.a0, arc.sweep);
            }
        }
    }
    function clipInfinite(view, a, b, both) {
        const d = (0, math_ts_1.norm)((0, math_ts_1.sub)(b, a));
        if ((0, math_ts_1.dist)(d, { x: 0, y: 0 }) < 0.5 && (d.x !== 0 || d.y !== 0)) {
            /* norm returns 0,0 if tiny */
        }
        if (Math.hypot(b.x - a.x, b.y - a.y) < 1e-12)
            return null;
        const dir = (0, math_ts_1.norm)((0, math_ts_1.sub)(b, a));
        const min = s2w(view, { x: -20, y: view.h + 20 });
        const max = s2w(view, { x: view.w + 20, y: -20 });
        const span = Math.max(max.x - min.x, max.y - min.y) * 2;
        const p0 = both ? { x: a.x - dir.x * span, y: a.y - dir.y * span } : a;
        const p1 = { x: a.x + dir.x * span, y: a.y + dir.y * span };
        return [p0, p1];
    }
    function drawDonut(ctx, view, e, color) {
        const s = w2s(view, e.c);
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.abs(e.or * view.ppm), 0, math_ts_1.TAU);
        ctx.arc(s.x, s.y, Math.abs(e.ir * view.ppm), 0, math_ts_1.TAU, true);
        ctx.fill("evenodd");
        ctx.restore();
    }
    function drawText(ctx, view, e, color) {
        const s = w2s(view, e.p);
        const size = Math.max(1, e.h * view.ppm);
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(-e.rot);
        ctx.fillStyle = color;
        ctx.font = `500 ${size}px "IBM Plex Sans", "Segoe UI", sans-serif`;
        ctx.textAlign = e.align;
        ctx.textBaseline = "alphabetic";
        const lines = e.text.split("\n");
        lines.forEach((line, i) => ctx.fillText(line, 0, i * size * 1.25));
        ctx.restore();
    }
    function drawHatch(ctx, view, e, color) {
        ctx.save();
        ctx.beginPath();
        for (const loop of e.loops) {
            if ("circle" in loop) {
                const s = w2s(view, loop.circle.c);
                ctx.moveTo(s.x + loop.circle.r * view.ppm, s.y);
                ctx.arc(s.x, s.y, Math.abs(loop.circle.r * view.ppm), 0, math_ts_1.TAU);
            }
            else {
                tracePoly(ctx, view, loop.pts, loop.closed);
            }
        }
        if (e.solid) {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.55;
            ctx.fill("evenodd");
            ctx.restore();
            return;
        }
        ctx.clip("evenodd");
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 1;
        const loops = e.loops;
        let minx = Infinity;
        let miny = Infinity;
        let maxx = -Infinity;
        let maxy = -Infinity;
        const consider = (p) => {
            minx = Math.min(minx, p.x);
            miny = Math.min(miny, p.y);
            maxx = Math.max(maxx, p.x);
            maxy = Math.max(maxy, p.y);
        };
        for (const loop of loops) {
            if ("circle" in loop) {
                consider({ x: loop.circle.c.x - loop.circle.r, y: loop.circle.c.y - loop.circle.r });
                consider({ x: loop.circle.c.x + loop.circle.r, y: loop.circle.c.y + loop.circle.r });
            }
            else
                for (const p of (0, geom_ts_1.tessellate)(loop.pts, loop.closed))
                    consider(p);
        }
        if (!Number.isFinite(minx)) {
            ctx.restore();
            return;
        }
        const name = e.pattern.toUpperCase();
        const spacing = Math.max(0.4, 3.2 * (e.scale || 1));
        const angles = name === "ANSI37" ? [45, 135] : name === "DOTS" ? [] : name === "ANSI32" ? [45, 45] : [45];
        if (name === "DOTS") {
            ctx.fillStyle = color;
            const step = spacing;
            for (let x = minx; x <= maxx; x += step) {
                for (let y = miny; y <= maxy; y += step) {
                    const s = w2s(view, { x, y });
                    ctx.fillRect(s.x, s.y, 1.4, 1.4);
                }
            }
            ctx.restore();
            return;
        }
        angles.forEach((deg, idx) => {
            const ang = ((deg + e.angle) * Math.PI) / 180;
            const dir = { x: Math.cos(ang), y: Math.sin(ang) };
            const nrm = { x: -dir.y, y: dir.x };
            const diag = (0, math_ts_1.dist)({ x: minx, y: miny }, { x: maxx, y: maxy }) + spacing * 2;
            const cx = (minx + maxx) / 2;
            const cy = (miny + maxy) / 2;
            const steps = Math.ceil(diag / spacing);
            const shift = name === "ANSI32" && idx === 1 ? spacing / 2 : 0;
            ctx.beginPath();
            for (let i = -steps; i <= steps; i++) {
                const o = addPt({ x: cx, y: cy }, mulPt(nrm, i * spacing + shift));
                const a = addPt(o, mulPt(dir, -diag));
                const b = addPt(o, mulPt(dir, diag));
                const sa = w2s(view, a);
                const sb = w2s(view, b);
                ctx.moveTo(sa.x, sa.y);
                ctx.lineTo(sb.x, sb.y);
            }
            ctx.stroke();
        });
        ctx.restore();
    }
    function addPt(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    function mulPt(a, s) {
        return { x: a.x * s, y: a.y * s };
    }
    function drawDim(ctx, view, doc, e, color, theme) {
        const h = e.dim.th ?? doc.dimtxt;
        const dprec = Math.max(0, Math.min(8, e.dim.prec ?? 2));
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        if (e.dim.kind === "linear") {
            const g = (0, entities_ts_1.linearDimGeom)(e.dim, h);
            seg(ctx, view, g.ext1[0], g.ext1[1]);
            seg(ctx, view, g.ext2[0], g.ext2[1]);
            seg(ctx, view, g.dim[0], g.dim[1]);
            for (const a of g.arrows)
                arrow(ctx, view, a.tip, a.dir, h * 0.7);
            drawText(ctx, view, {
                ...e,
                type: "text",
                p: g.textPt,
                h,
                rot: g.textRot,
                text: g.label,
                align: "center",
            }, color);
        }
        else if (e.dim.kind === "radial") {
            const tip = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.ang);
            const tail = e.dim.dia ? (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.ang + Math.PI) : e.dim.c;
            seg(ctx, view, tail, tip);
            arrow(ctx, view, tip, (0, math_ts_1.norm)((0, math_ts_1.sub)(tip, e.dim.c)), h * 0.7);
            if (e.dim.dia)
                arrow(ctx, view, tail, (0, math_ts_1.norm)((0, math_ts_1.sub)(tail, e.dim.c)), h * 0.7);
            const label = `${e.dim.dia ? "Ø" : "R"}${(e.dim.dia ? e.dim.r * 2 : e.dim.r).toFixed(dprec)}`;
            drawText(ctx, view, { ...e, type: "text", p: addPt(tip, { x: h * 0.4, y: h * 0.4 }), h, rot: 0, text: label, align: "left" }, color);
        }
        else {
            const sweep = ((e.dim.a1 - e.dim.a0) % math_ts_1.TAU + math_ts_1.TAU) % math_ts_1.TAU || math_ts_1.TAU;
            ctx.beginPath();
            traceArc(ctx, view, e.dim.c, e.dim.r, e.dim.a0, sweep);
            ctx.stroke();
            const s = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.a0);
            const t = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r, e.dim.a0 + sweep);
            // direction of the arc at the tip is perpendicular
            arrow(ctx, view, s, (0, math_ts_1.norm)({ x: Math.sin(e.dim.a0), y: -Math.cos(e.dim.a0) }), h * 0.65);
            arrow(ctx, view, t, (0, math_ts_1.norm)({ x: -Math.sin(e.dim.a0 + sweep), y: Math.cos(e.dim.a0 + sweep) }), h * 0.65);
            const mid = (0, geom_ts_1.arcPoint)(e.dim.c, e.dim.r + h * 0.4, e.dim.a0 + sweep / 2);
            drawText(ctx, view, { ...e, type: "text", p: mid, h, rot: 0, text: `${((sweep * 180) / Math.PI).toFixed(Math.min(dprec, 2))}°`, align: "center" }, color);
        }
        ctx.restore();
        void theme;
    }
    function trimNum(n, prec) {
        return n.toFixed(Math.min(4, prec));
    }
    function seg(ctx, view, a, b) {
        const A = w2s(view, a);
        const B = w2s(view, b);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
    }
    function arrow(ctx, view, tip, dir, size) {
        const u = (0, math_ts_1.norm)(dir);
        if (u.x === 0 && u.y === 0)
            return;
        const n = { x: -u.y, y: u.x };
        const b = { x: tip.x - u.x * size, y: tip.y - u.y * size };
        const p1 = { x: b.x + n.x * size * 0.28, y: b.y + n.y * size * 0.28 };
        const p2 = { x: b.x - n.x * size * 0.28, y: b.y - n.y * size * 0.28 };
        const A = w2s(view, tip);
        const B = w2s(view, p1);
        const C = w2s(view, p2);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.closePath();
        ctx.fill();
    }
    function drawRubber(ctx, view, rubber, theme) {
        const A = w2s(view, rubber.a);
        const B = w2s(view, rubber.b);
        const x = Math.min(A.x, B.x);
        const y = Math.min(A.y, B.y);
        const w = Math.abs(A.x - B.x);
        const h = Math.abs(A.y - B.y);
        ctx.save();
        ctx.strokeStyle = rubber.crossing ? theme.preview : theme.select;
        ctx.fillStyle = rubber.crossing ? theme.preview : theme.select;
        ctx.globalAlpha = 0.12;
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 1;
        ctx.setLineDash(rubber.crossing ? [4, 3] : []);
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
    }
    function drawGrip(ctx, view, p, color) {
        const s = w2s(view, p);
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = "#121418";
        ctx.lineWidth = 1;
        ctx.fillRect(s.x - 4, s.y - 4, 8, 8);
        ctx.strokeRect(s.x - 4, s.y - 4, 8, 8);
        ctx.restore();
    }
    function drawSnap(ctx, view, p, kind, color) {
        const s = w2s(view, p);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.4;
        const r = 6;
        ctx.beginPath();
        if (kind === "endpoint" || kind === "node" || kind === "insert") {
            ctx.strokeRect(s.x - r, s.y - r, r * 2, r * 2);
        }
        else if (kind === "midpoint") {
            ctx.moveTo(s.x, s.y - r);
            ctx.lineTo(s.x + r, s.y + r * 0.7);
            ctx.lineTo(s.x - r, s.y + r * 0.7);
            ctx.closePath();
            ctx.stroke();
        }
        else if (kind === "center") {
            ctx.arc(s.x, s.y, r, 0, math_ts_1.TAU);
            ctx.stroke();
        }
        else if (kind === "quadrant") {
            ctx.moveTo(s.x, s.y - r);
            ctx.lineTo(s.x + r, s.y);
            ctx.lineTo(s.x, s.y + r);
            ctx.lineTo(s.x - r, s.y);
            ctx.closePath();
            ctx.stroke();
        }
        else if (kind === "intersection") {
            ctx.moveTo(s.x - r, s.y - r);
            ctx.lineTo(s.x + r, s.y + r);
            ctx.moveTo(s.x + r, s.y - r);
            ctx.lineTo(s.x - r, s.y + r);
            ctx.stroke();
        }
        else if (kind === "perpendicular") {
            ctx.strokeRect(s.x - r, s.y - r, r, r);
            ctx.moveTo(s.x - r, s.y);
            ctx.lineTo(s.x + r, s.y);
            ctx.moveTo(s.x, s.y - r);
            ctx.lineTo(s.x, s.y + r * 0.2);
            ctx.stroke();
        }
        else {
            ctx.moveTo(s.x - r, s.y);
            ctx.lineTo(s.x + r, s.y);
            ctx.moveTo(s.x, s.y - r);
            ctx.lineTo(s.x, s.y + r);
            ctx.stroke();
        }
        ctx.restore();
    }
    function drawCross(ctx, view, cursor, color, pickbox) {
        const s = w2s(view, cursor);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, s.y);
        ctx.lineTo(view.w, s.y);
        ctx.moveTo(s.x, 0);
        ctx.lineTo(s.x, view.h);
        ctx.stroke();
        if (pickbox) {
            ctx.globalAlpha = 1;
            ctx.strokeRect(s.x - 5, s.y - 5, 10, 10);
        }
        ctx.restore();
    }
    function themeFrom(host) {
        const cs = getComputedStyle(host);
        const g = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
        return {
            model: g("--nl-model", "#0c0e11"),
            grid: g("--nl-grid", "rgba(126,176,191,0.16)"),
            gridMajor: g("--nl-grid-major", "rgba(211,146,62,0.28)"),
            axis: g("--nl-axis", "rgba(211,146,62,0.35)"),
            cross: g("--nl-cross", "#d3923e"),
            select: g("--nl-select", "#7eb0bf"),
            preview: g("--nl-preview", "#e0b56a"),
            grip: g("--nl-brass", "#d3923e"),
            gripHot: g("--nl-select", "#7eb0bf"),
            color7: g("--nl-aci7", "#f4f1ea"),
            snap: g("--nl-snap", "#f2d48a"),
        };
    }

  };

  factories["sample.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadSample = loadSample;
    const entities_ts_1 = require("./entities.ts");
    function S(partial) {
        return {
            id: (0, entities_ts_1.uid)(),
            color: "bylayer",
            lt: "bylayer",
            lw: "bylayer",
            ...partial,
        };
    }
    /** A small measured plate so the sheet isn't blank on first open. */
    function loadSample(doc) {
        doc.layers = (0, entities_ts_1.defaultLayers)();
        doc.blocks.clear();
        doc.ents.clear();
        doc.order = [];
        doc.currentLayer = "Outline";
        doc.color = "bylayer";
        doc.lt = "bylayer";
        doc.lw = "bylayer";
        doc.ltscale = 1;
        doc.dimtxt = 3.4;
        doc.dimprec = 2;
        doc.texth = 3.2;
        doc.prec = 2;
        doc.units = 4;
        doc.fillet = 6;
        doc.offsetDist = 8;
        doc.past = [];
        doc.future = [];
        doc.blocks.set("hole", {
            name: "HOLE",
            base: { x: 0, y: 0 },
            ents: [
                S({ type: "circle", layer: "Outline", c: { x: 0, y: 0 }, r: 8 }),
                S({ type: "line", layer: "Center", a: { x: -15, y: 0 }, b: { x: 15, y: 0 } }),
                S({ type: "line", layer: "Center", a: { x: 0, y: -15 }, b: { x: 0, y: 15 } }),
            ],
        });
        const plate = [
            { x: 0, y: 0 },
            { x: 180, y: 0 },
            { x: 180, y: 110 },
            { x: 0, y: 110 },
        ];
        doc.add(S({ type: "polyline", layer: "Outline", pts: plate, closed: true, width: 0 }));
        const slot = [
            { x: 58, y: 46 },
            { x: 122, y: 46, b: 1 },
            { x: 122, y: 64 },
            { x: 58, y: 64, b: 1 },
        ];
        // Bulge lives on the start of the arc segment. The two semicircles are the vertical ends.
        const slotPts = [
            { x: 58, y: 46 },
            { x: 122, y: 46, b: 1 },
            { x: 122, y: 64 },
            { x: 58, y: 64, b: 1 },
        ];
        void slot;
        doc.add(S({ type: "polyline", layer: "Outline", pts: slotPts, closed: true, width: 0 }));
        for (const p of [
            { x: 22, y: 22 },
            { x: 158, y: 22 },
            { x: 22, y: 88 },
            { x: 158, y: 88 },
        ]) {
            doc.add(S({ type: "insert", layer: "Outline", name: "HOLE", p, sx: 1, sy: 1, rot: 0 }));
        }
        doc.add(S({ type: "circle", layer: "Outline", c: { x: 90, y: 55 }, r: 16 }));
        doc.add(S({ type: "circle", layer: "Hidden", c: { x: 90, y: 55 }, r: 10 }));
        doc.add(S({ type: "line", layer: "Center", a: { x: 64, y: 55 }, b: { x: 116, y: 55 } }));
        doc.add(S({ type: "line", layer: "Center", a: { x: 90, y: 30 }, b: { x: 90, y: 80 } }));
        const rib = [
            { x: 146, y: 42 },
            { x: 170, y: 42 },
            { x: 170, y: 68 },
            { x: 146, y: 68 },
        ];
        doc.add(S({ type: "polyline", layer: "Outline", pts: rib, closed: true, width: 0 }));
        doc.add(S({
            type: "hatch",
            layer: "Hatch",
            loops: [{ pts: rib.map((p) => ({ ...p })), closed: true }],
            pattern: "ANSI31",
            scale: 1.1,
            angle: 0,
            solid: false,
        }));
        doc.add(S({
            type: "dim",
            layer: "Dim",
            dim: { kind: "linear", axis: "h", p1: { x: 0, y: 0 }, p2: { x: 180, y: 0 }, loc: { x: 90, y: -16 }, th: 3.4, prec: 2 },
        }));
        doc.add(S({
            type: "dim",
            layer: "Dim",
            dim: { kind: "linear", axis: "v", p1: { x: 180, y: 0 }, p2: { x: 180, y: 110 }, loc: { x: 198, y: 55 }, th: 3.4, prec: 2 },
        }));
        doc.add(S({
            type: "dim",
            layer: "Dim",
            dim: { kind: "radial", c: { x: 90, y: 55 }, r: 16, ang: Math.PI / 4, dia: true, th: 3.4, prec: 2 },
        }));
        doc.add(S({ type: "text", layer: "Text", p: { x: 0, y: 122 }, h: 6, rot: 0, text: "NORTHLINE", align: "left" }));
        doc.add(S({
            type: "text",
            layer: "Text",
            p: { x: 0, y: -28 },
            h: 3.2,
            rot: 0,
            text: "SAMPLE PLATE   ·   AL 6061   ·   UNITS mm",
            align: "left",
        }));
        doc.add(S({ type: "point", layer: "0", p: { x: 90, y: 55 } }));
        doc.bump();
    }

  };

  factories["commands.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.COMMANDS = exports.AbortCmd = void 0;
    exports.resolveCommand = resolveCommand;
    exports.matchKeyword = matchKeyword;
    const entities_ts_1 = require("./entities.ts");
    const geom_ts_1 = require("./geom.ts");
    const math_ts_1 = require("./math.ts");
    class AbortCmd extends Error {
        constructor() {
            super("abort");
            this.name = "AbortCmd";
        }
    }
    exports.AbortCmd = AbortCmd;
    function isAbort(e) {
        return e instanceof AbortCmd;
    }
    function dist(a, b) {
        return (0, math_ts_1.dist)(a, b);
    }
    async function line(io) {
        io.ensureDraw();
        const first = await io.point("Specify first point:");
        if (first.t !== "point")
            return;
        let prev = first.p;
        const made = [];
        const commit = () => {
            if (!made.length)
                return;
            const batch = made.splice(0, made.length);
            io.transact(() => batch.forEach((e) => io.doc.add(e)));
        };
        try {
            while (true) {
                const nxt = await io.point(made.length > 1 ? "Specify next point or [Close/Undo]:" : "Specify next point or [Undo]:", {
                    base: prev,
                    keywords: made.length > 1
                        ? [{ name: "Close", aliases: ["c"] }, { name: "Undo", aliases: ["u"] }]
                        : [{ name: "Undo", aliases: ["u"] }],
                    preview: (c) => [...made, io.make({ type: "line", a: prev, b: c })],
                });
                if (nxt.t === "none")
                    break;
                if (nxt.t === "kw") {
                    if (nxt.name === "Close") {
                        if (dist(prev, first.p) > 1e-9)
                            made.push(io.make({ type: "line", a: prev, b: first.p }));
                        break;
                    }
                    made.pop();
                    prev = made.length ? made[made.length - 1].b : first.p;
                    io.preview(made);
                    continue;
                }
                if (nxt.t !== "point")
                    break;
                if (dist(prev, nxt.p) < 1e-9)
                    continue;
                made.push(io.make({ type: "line", a: prev, b: nxt.p }));
                prev = nxt.p;
                io.preview(made);
            }
        }
        catch (err) {
            commit();
            throw err;
        }
        io.preview(null);
        commit();
    }
    async function pline(io) {
        io.ensureDraw();
        const first = await io.point("Specify start point:");
        if (first.t !== "point")
            return;
        const pts = [{ ...first.p }];
        let arcMode = false;
        let dir = null;
        try {
        while (true) {
            const msg = arcMode ? "Specify endpoint of arc or [Line/Undo/Close]:" : "Specify next point or [Arc/Undo/Close]:";
            const kws = arcMode
                ? [
                    { name: "Line", aliases: ["l"] },
                    { name: "Undo", aliases: ["u"] },
                    { name: "Close", aliases: ["c"] },
                ]
                : [
                    { name: "Arc", aliases: ["a"] },
                    { name: "Undo", aliases: ["u"] },
                    { name: "Close", aliases: ["c"] },
                ];
            const prev = pts[pts.length - 1];
            const nxt = await io.point(msg, {
                base: prev,
                keywords: kws,
                preview: (c) => {
                    const draft = pts.map((p) => ({ ...p }));
                    if (arcMode && dir) {
                        const b = tangentBulge(prev, dir, c);
                        if (b)
                            draft[draft.length - 1] = { ...draft[draft.length - 1], b };
                    }
                    draft.push({ ...c });
                    return [io.make({ type: "polyline", pts: draft, closed: false, width: 0 })];
                },
            });
            if (nxt.t === "none")
                break;
            if (nxt.t === "kw") {
                if (nxt.name === "Arc")
                    arcMode = true;
                else if (nxt.name === "Line")
                    arcMode = false;
                else if (nxt.name === "Undo") {
                    if (pts.length > 1)
                        pts.pop();
                    dir = pts.length >= 2 ? (0, math_ts_1.sub)(pts[pts.length - 1], pts[pts.length - 2]) : null;
                }
                else if (nxt.name === "Close") {
                    if (pts.length >= 2) {
                        const ent = io.make({ type: "polyline", pts, closed: true, width: 0 });
                        io.transact(() => io.doc.add(ent));
                    }
                    io.preview(null);
                    return;
                }
                continue;
            }
            if (nxt.t !== "point")
                return;
            if ((0, math_ts_1.dist)(prev, nxt.p) < 1e-9)
                continue;
            if (arcMode && dir) {
                const b = tangentBulge(prev, dir, nxt.p);
                if (b)
                    pts[pts.length - 1] = { ...prev, b };
            }
            const incoming = (0, math_ts_1.sub)(nxt.p, prev);
            pts.push({ ...nxt.p });
            if (arcMode && dir) {
                const arc = pts[pts.length - 2].b ? (0, geom_ts_1.bulgeArc)(pts[pts.length - 2], nxt.p, pts[pts.length - 2].b) : null;
                if (arc) {
                    const endAng = arc.a0 + arc.sweep;
                    dir = { x: -Math.sin(endAng) * Math.sign(arc.sweep || 1), y: Math.cos(endAng) * Math.sign(arc.sweep || 1) };
                }
                else
                    dir = incoming;
            }
            else
                dir = incoming;
        }
        }
        catch (err) {
            if (err instanceof AbortCmd && pts.length >= 2)
                io.transact(() => io.doc.add(io.make({ type: "polyline", pts, closed: false, width: 0 })));
            throw err;
        }
        io.preview(null);
        if (pts.length < 2)
            return;
        const ent = io.make({ type: "polyline", pts, closed: false, width: 0 });
        io.transact(() => io.doc.add(ent));
    }
    function tangentBulge(prev, dir, next) {
        const chord = (0, math_ts_1.sub)(next, prev);
        if ((0, math_ts_1.len)(chord) < 1e-9 || (0, math_ts_1.len)(dir) < 1e-9)
            return null;
        const tangent = (0, math_ts_1.norm)(dir);
        const chordU = (0, math_ts_1.norm)(chord);
        const phi = Math.atan2(tangent.x * chordU.y - tangent.y * chordU.x, tangent.x * chordU.x + tangent.y * chordU.y);
        const bulge = Math.tan(phi / 2);
        if (!Number.isFinite(bulge) || Math.abs(bulge) > 50)
            return null;
        return bulge;
    }
    async function circle(io) {
        io.ensureDraw();
        const first = await io.point("Specify center point for circle or [2P/3P]:", {
            keywords: [
                { name: "2P", aliases: ["2p", "2"] },
                { name: "3P", aliases: ["3p", "3"] },
            ],
        });
        if (first.t === "kw" && first.name === "2P") {
            const a = await io.point("Specify first end point of diameter:");
            if (a.t !== "point")
                return;
            const b = await io.point("Specify second end point of diameter:", {
                base: a.p,
                preview: (c) => {
                    const center = { x: (a.p.x + c.x) / 2, y: (a.p.y + c.y) / 2 };
                    return [io.make({ type: "circle", c: center, r: (0, math_ts_1.dist)(a.p, c) / 2 })];
                },
            });
            if (b.t !== "point")
                return;
            const center = { x: (a.p.x + b.p.x) / 2, y: (a.p.y + b.p.y) / 2 };
            const ent = io.make({ type: "circle", c: center, r: (0, math_ts_1.dist)(a.p, b.p) / 2 });
            io.transact(() => io.doc.add(ent));
            return;
        }
        if (first.t === "kw" && first.name === "3P") {
            const a = await io.point("Specify first point on circle:");
            if (a.t !== "point")
                return;
            const b = await io.point("Specify second point on circle:");
            if (b.t !== "point")
                return;
            const c = await io.point("Specify third point on circle:", {
                preview: (p) => {
                    const circ = (0, geom_ts_1.circumcircle)(a.p, b.p, p);
                    return circ ? [io.make({ type: "circle", c: circ.c, r: circ.r })] : [];
                },
            });
            if (c.t !== "point")
                return;
            const circ = (0, geom_ts_1.circumcircle)(a.p, b.p, c.p);
            if (!circ) {
                io.info("Points are colinear.");
                return;
            }
            io.transact(() => io.doc.add(io.make({ type: "circle", c: circ.c, r: circ.r })));
            return;
        }
        if (first.t !== "point")
            return;
        const center = first.p;
        const rad = await io.point("Specify radius of circle or [Diameter]:", {
            base: center,
            acceptNumber: true,
            keywords: [{ name: "Diameter", aliases: ["d"] }],
            preview: (c) => [io.make({ type: "circle", c: center, r: (0, math_ts_1.dist)(center, c) })],
        });
        let r = 0;
        if (rad.t === "kw") {
            const d = await io.point("Specify diameter:", {
                base: center,
                acceptNumber: true,
                preview: (c) => [io.make({ type: "circle", c: center, r: (0, math_ts_1.dist)(center, c) / 2 })],
            });
            if (d.t === "num")
                r = d.v / 2;
            else if (d.t === "point")
                r = (0, math_ts_1.dist)(center, d.p) / 2;
            else
                return;
        }
        else if (rad.t === "num")
            r = rad.v;
        else if (rad.t === "point")
            r = (0, math_ts_1.dist)(center, rad.p);
        else
            return;
        if (r <= 1e-9) {
            io.info("Radius must be positive.");
            return;
        }
        io.transact(() => io.doc.add(io.make({ type: "circle", c: center, r })));
    }
    async function arc(io) {
        io.ensureDraw();
        const a = await io.point("Specify start point of arc or [Center]:", {
            keywords: [{ name: "Center", aliases: ["c"] }],
        });
        if (a.t === "kw") {
            const c = await io.point("Specify center point of arc:");
            if (c.t !== "point")
                return;
            const s = await io.point("Specify start point:", {
                base: c.p,
                preview: (p) => [io.make({ type: "line", a: c.p, b: p })],
            });
            if (s.t !== "point")
                return;
            const r = (0, math_ts_1.dist)(c.p, s.p);
            const a0 = Math.atan2(s.p.y - c.p.y, s.p.x - c.p.x);
            const e = await io.point("Specify end point or [Angle]:", {
                base: c.p,
                acceptNumber: true,
                keywords: [{ name: "Angle", aliases: ["a"] }],
                preview: (p) => {
                    const a1 = Math.atan2(p.y - c.p.y, p.x - c.p.x);
                    return [io.make({ type: "arc", c: c.p, r, a0, sweep: (0, math_ts_1.ccwSweep)(a0, a1) })];
                },
            });
            let sweep = 0;
            if (e.t === "kw" || e.t === "num") {
                const n = e.t === "num" ? e : await io.number("Specify included angle:", {});
                if (n.t !== "num")
                    return;
                sweep = (n.v * Math.PI) / 180;
                if (sweep < 0)
                    sweep = math_ts_1.TAU + (sweep % math_ts_1.TAU);
            }
            else if (e.t === "point") {
                const a1 = Math.atan2(e.p.y - c.p.y, e.p.x - c.p.x);
                sweep = (0, math_ts_1.ccwSweep)(a0, a1);
            }
            else
                return;
            if (sweep < 1e-4)
                return;
            io.transact(() => io.doc.add(io.make({ type: "arc", c: c.p, r, a0, sweep })));
            return;
        }
        if (a.t !== "point")
            return;
        const b = await io.point("Specify second point of arc or [End]:", {
            base: a.p,
            keywords: [{ name: "End", aliases: ["e"] }],
        });
        if (b.t === "kw") {
            const end = await io.point("Specify end point:", { base: a.p });
            if (end.t !== "point")
                return;
            const ang = await io.number("Specify included angle:", { def: 90 });
            if (ang.t !== "num" && ang.t !== "none")
                return;
            const deg = ang.t === "num" ? ang.v : 90;
            const chord = (0, math_ts_1.dist)(a.p, end.p);
            const theta = (Math.abs(deg) * Math.PI) / 180;
            if (theta < 1e-3 || theta >= math_ts_1.TAU)
                return;
            const r = chord / (2 * Math.sin(theta / 2));
            const mid = { x: (a.p.x + end.p.x) / 2, y: (a.p.y + end.p.y) / 2 };
            const dir = (0, math_ts_1.norm)((0, math_ts_1.sub)(end.p, a.p));
            const nrm = { x: -dir.y, y: dir.x };
            const h = r * Math.cos(theta / 2);
            // A counter-clockwise arc from start to end bulges to the right of the chord (negative normal).
            const sign = deg >= 0 ? -1 : 1;
            const center = { x: mid.x - nrm.x * h * sign, y: mid.y - nrm.y * h * sign };
            const built = (0, geom_ts_1.arcThrough)(a.p, { x: mid.x + nrm.x * (r - h) * sign, y: mid.y + nrm.y * (r - h) * sign }, end.p);
            const use = built ?? { c: center, r: Math.abs(r), a0: Math.atan2(a.p.y - center.y, a.p.x - center.x), sweep: theta };
            io.transact(() => io.doc.add(io.make({ type: "arc", c: use.c, r: use.r, a0: use.a0, sweep: use.sweep })));
            return;
        }
        if (b.t !== "point")
            return;
        const c = await io.point("Specify end point of arc:", {
            preview: (p) => {
                const built = (0, geom_ts_1.arcThrough)(a.p, b.p, p);
                return built ? [io.make({ type: "arc", c: built.c, r: built.r, a0: built.a0, sweep: built.sweep })] : [];
            },
        });
        if (c.t !== "point")
            return;
        const built = (0, geom_ts_1.arcThrough)(a.p, b.p, c.p);
        if (!built) {
            io.info("Points are colinear.");
            return;
        }
        io.transact(() => io.doc.add(io.make({ type: "arc", c: built.c, r: built.r, a0: built.a0, sweep: built.sweep })));
    }
    async function rect(io) {
        io.ensureDraw();
        const a = await io.point("Specify first corner:");
        if (a.t !== "point")
            return;
        const b = await io.point("Specify other corner:", {
            base: a.p,
            rubber: true,
            preview: (c) => [
                io.make({
                    type: "polyline",
                    closed: true,
                    width: 0,
                    pts: [
                        { x: a.p.x, y: a.p.y },
                        { x: c.x, y: a.p.y },
                        { x: c.x, y: c.y },
                        { x: a.p.x, y: c.y },
                    ],
                }),
            ],
        });
        if (b.t !== "point")
            return;
        if (Math.abs(a.p.x - b.p.x) < 1e-9 || Math.abs(a.p.y - b.p.y) < 1e-9) {
            io.info("Rectangle has zero area.");
            return;
        }
        io.transact(() => io.doc.add(io.make({
            type: "polyline",
            closed: true,
            width: 0,
            pts: [
                { x: a.p.x, y: a.p.y },
                { x: b.p.x, y: a.p.y },
                { x: b.p.x, y: b.p.y },
                { x: a.p.x, y: b.p.y },
            ],
        })));
    }
    async function polygon(io) {
        io.ensureDraw();
        const nAns = await io.number("Enter number of sides <6>:", { def: 6 });
        const sides = Math.round(nAns.t === "num" ? nAns.v : nAns.t === "none" ? 6 : NaN);
        if (!Number.isFinite(sides) || sides < 3 || sides > 256) {
            io.info("Sides must be from 3 to 256.");
            return;
        }
        const c = await io.point("Specify center of polygon:");
        if (c.t !== "point")
            return;
        const mode = await io.choose("Enter an option [Inscribed/Circumscribed] <Inscribed>:", [
            { name: "Inscribed", aliases: ["i"] },
            { name: "Circumscribed", aliases: ["c"] },
        ], "Inscribed");
        const inscribed = mode !== "Circumscribed";
        const r = await io.point(inscribed ? "Specify radius:" : "Specify radius of circle:", {
            base: c.p,
            acceptNumber: true,
            preview: (p) => [io.make({ type: "polyline", closed: true, width: 0, pts: polyPts(c.p, (0, math_ts_1.dist)(c.p, p), sides, Math.atan2(p.y - c.p.y, p.x - c.p.x) - (inscribed ? 0 : Math.PI / sides), inscribed) })],
        });
        let radius = 0;
        let rot = 0;
        if (r.t === "num")
            radius = r.v;
        else if (r.t === "point") {
            radius = (0, math_ts_1.dist)(c.p, r.p);
            rot = Math.atan2(r.p.y - c.p.y, r.p.x - c.p.x);
        }
        else
            return;
        if (radius <= 1e-9)
            return;
        if (!inscribed)
            rot -= Math.PI / sides;
        io.transact(() => io.doc.add(io.make({ type: "polyline", closed: true, width: 0, pts: polyPts(c.p, radius, sides, rot, inscribed) })));
    }
    function polyPts(c, radius, sides, rot, inscribed) {
        const r = inscribed ? radius : radius / Math.cos(Math.PI / sides);
        const pts = [];
        for (let i = 0; i < sides; i++) {
            const a = rot + (i * math_ts_1.TAU) / sides;
            pts.push({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r });
        }
        return pts;
    }
    async function ellipse(io) {
        io.ensureDraw();
        const a = await io.point("Specify axis endpoint of ellipse or [Center]:", {
            keywords: [{ name: "Center", aliases: ["c"] }],
        });
        let center;
        let majorEnd;
        if (a.t === "kw") {
            const c = await io.point("Specify center of ellipse:");
            if (c.t !== "point")
                return;
            const e = await io.point("Specify endpoint of axis:", { base: c.p });
            if (e.t !== "point")
                return;
            center = c.p;
            majorEnd = e.p;
        }
        else if (a.t === "point") {
            const b = await io.point("Specify other endpoint of axis:", { base: a.p });
            if (b.t !== "point")
                return;
            center = { x: (a.p.x + b.p.x) / 2, y: (a.p.y + b.p.y) / 2 };
            majorEnd = b.p;
        }
        else
            return;
        const mx = majorEnd.x - center.x;
        const my = majorEnd.y - center.y;
        const major = Math.hypot(mx, my);
        if (major < 1e-9)
            return;
        const other = await io.point("Specify distance to other axis or [Rotation]:", {
            base: center,
            acceptNumber: true,
            preview: (p) => {
                const ratio = Math.min(1, (0, math_ts_1.dist)(center, p) / major);
                return [io.make({ type: "ellipse", c: center, mx, my, ratio: ratio || 0.01, a0: 0, sweep: math_ts_1.TAU })];
            },
        });
        let ratio = 0.5;
        if (other.t === "num")
            ratio = other.v / major;
        else if (other.t === "point")
            ratio = (0, math_ts_1.dist)(center, other.p) / major;
        else
            return;
        ratio = Math.min(1, Math.max(0.01, ratio));
        io.transact(() => io.doc.add(io.make({ type: "ellipse", c: center, mx, my, ratio, a0: 0, sweep: math_ts_1.TAU })));
    }
    async function pointCmd(io) {
        io.ensureDraw();
        while (true) {
            const p = await io.point("Specify a point:");
            if (p.t !== "point")
                return;
            io.transact(() => io.doc.add(io.make({ type: "point", p: p.p })));
        }
    }
    async function text(io) {
        io.ensureDraw();
        const p = await io.point("Specify start point of text:");
        if (p.t !== "point")
            return;
        const hAns = await io.point(`Specify height <${io.doc.texth}>:`, {
            base: p.p,
            acceptNumber: true,
            preview: (c) => [io.make({ type: "text", p: p.p, h: Math.max(0.1, (0, math_ts_1.dist)(p.p, c)), rot: 0, text: "Text", align: "left" })],
        });
        let h = io.doc.texth;
        if (hAns.t === "num")
            h = hAns.v;
        else if (hAns.t === "point")
            h = (0, math_ts_1.dist)(p.p, hAns.p);
        else if (hAns.t !== "none")
            return;
        h = Math.max(1e-4, h);
        io.doc.texth = h;
        const rAns = await io.number("Specify rotation angle of text <0>:", { def: 0 });
        const rot = ((rAns.t === "num" ? rAns.v : 0) * Math.PI) / 180;
        const raw = await io.text("Enter text (\\n or \\P starts a new line):");
        const str = raw.replace(/\\[nP]/g, "\n");
        if (!str.trim())
            return;
        io.transact(() => io.doc.add(io.make({ type: "text", p: p.p, h, rot, text: str, align: "left" })));
    }
    async function spline(io) {
        io.ensureDraw();
        const pts = [];
        try {
        while (true) {
            const p = await io.point(pts.length ? "Specify next fit point or [Undo]:" : "Specify first fit point:", {
                base: pts[pts.length - 1] ?? null,
                keywords: pts.length ? [{ name: "Undo", aliases: ["u"] }] : [],
                preview: (c) => (pts.length ? [io.make({ type: "spline", pts: [...pts, c] })] : []),
            });
            if (p.t === "none")
                break;
            if (p.t === "kw") {
                pts.pop();
                continue;
            }
            if (p.t !== "point")
                return;
            pts.push(p.p);
        }
        }
        catch (err) {
            if (err instanceof AbortCmd && pts.length >= 2)
                io.transact(() => io.doc.add(io.make({ type: "spline", pts })));
            throw err;
        }
        io.preview(null);
        if (pts.length < 2)
            return;
        io.transact(() => io.doc.add(io.make({ type: "spline", pts })));
    }
    async function xline(io, ray) {
        io.ensureDraw();
        const a = await io.point(ray ? "Specify start point:" : "Specify a point on the xline:");
        if (a.t !== "point")
            return;
        while (true) {
            const b = await io.point(ray ? "Specify through point:" : "Specify through point:", {
                base: a.p,
                preview: (c) => [io.make(ray ? { type: "ray", a: a.p, b: c } : { type: "xline", a: a.p, b: c })],
            });
            if (b.t !== "point")
                return;
            io.transact(() => io.doc.add(io.make(ray ? { type: "ray", a: a.p, b: b.p } : { type: "xline", a: a.p, b: b.p })));
            if (ray)
                return;
        }
    }
    async function donut(io) {
        io.ensureDraw();
        const ir = await io.number("Specify inside diameter <1>:", { def: 1 });
        const or = await io.number("Specify outside diameter <2>:", { def: 2 });
        const inner = Math.abs(ir.t === "num" ? ir.v : 1) / 2;
        const outer = Math.abs(or.t === "num" ? or.v : 2) / 2;
        if (outer <= inner) {
            io.info("Outside diameter must be larger.");
            return;
        }
        while (true) {
            const p = await io.point("Specify center of donut:", {
                preview: (c) => [io.make({ type: "donut", c, ir: inner, or: outer })],
            });
            if (p.t !== "point")
                return;
            io.transact(() => io.doc.add(io.make({ type: "donut", c: p.p, ir: inner, or: outer })));
        }
    }
    async function hatch(io) {
        io.ensureDraw();
        const how = await io.choose("Hatch by [Point/Select] <Point>:", [
            { name: "Point", aliases: ["p"] },
            { name: "Select", aliases: ["s"] },
        ], "Point");
        const pattern = await io.choose("Pattern [Solid/ANSI31/ANSI32/ANSI37/Dots] <ANSI31>:", [
            { name: "Solid", aliases: ["s"] },
            { name: "ANSI31", aliases: ["31"] },
            { name: "ANSI32", aliases: ["32"] },
            { name: "ANSI37", aliases: ["37"] },
            { name: "Dots", aliases: ["d"] },
        ], "ANSI31");
        const sc = await io.number("Pattern scale <1>:", { def: 1 });
        const ang = await io.number("Pattern angle <0>:", { def: 0 });
        const scale = sc.t === "num" ? sc.v : 1;
        const angle = ang.t === "num" ? ang.v : 0;
        const solid = pattern === "Solid";
        const loops = [];
        if (how === "Select") {
            const ents = await io.select("Select closed objects:");
            for (const e of ents) {
                const loop = loopOf(e);
                if (loop)
                    loops.push(loop);
                else
                    io.info("Skipped an open object.");
            }
        }
        else {
            while (true) {
                const p = await io.point(loops.length ? "Pick another internal point (Enter to finish):" : "Pick internal point:");
                if (p.t !== "point")
                    break;
                const found = smallestContainer(io.doc, p.p);
                if (!found) {
                    io.info("No closed boundary contains that point.");
                    if (!loops.length)
                        continue;
                    continue;
                }
                const loop = loopOf(found);
                if (loop) {
                    loops.push(loop);
                    for (const isl of islandsOf(io.doc, found))
                        loops.push(isl);
                }
                io.info(`${loops.length} boundar${loops.length === 1 ? "y" : "ies"} found. Pick another point or press Enter.`);
            }
        }
        if (!loops.length)
            return;
        io.transact(() => {
            io.doc.add(io.make({
                type: "hatch",
                layer: io.doc.currentLayer,
                loops,
                pattern: pattern.toUpperCase(),
                scale: Math.max(0.01, scale),
                angle,
                solid,
            }));
        });
        io.info("Hatch created.");
    }
    function loopOf(e) {
        if (e.type === "circle")
            return { circle: { c: { ...e.c }, r: e.r } };
        if (e.type === "polyline" && e.closed && e.pts.length >= 3)
            return { pts: e.pts.map((p) => ({ ...p })), closed: true };
        if (e.type === "ellipse" && e.sweep >= math_ts_1.TAU - 1e-3) {
            const pts = Array.from({ length: 48 }, (_, i) => {
                const a = (i / 48) * math_ts_1.TAU;
                const L = Math.hypot(e.mx, e.my) || 1;
                const minor = L * e.ratio;
                return {
                    x: e.c.x + Math.cos(a) * e.mx - Math.sin(a) * (e.my / L) * minor,
                    y: e.c.y + Math.cos(a) * e.my + Math.sin(a) * (e.mx / L) * minor,
                };
            });
            return { pts, closed: true };
        }
        if (e.type === "donut")
            return { circle: { c: { ...e.c }, r: e.or } };
        return null;
    }
    /** Closed shapes a hatch can use, including the ones inside block references. */
    function loopCandidates(doc) {
        const out = [];
        for (const e of doc.all()) {
            if (!(0, entities_ts_1.visibleEnt)(e, doc.layers))
                continue;
            if (e.type === "insert") {
                const block = doc.blocks.get(e.name.toLowerCase());
                if (block)
                    for (const child of (0, entities_ts_1.placedInsert)(e, block))
                        if (loopOf(child))
                            out.push(child);
                continue;
            }
            if (loopOf(e))
                out.push(e);
        }
        return out;
    }
    function loopContains(loop, p) {
        if ("circle" in loop)
            return (0, math_ts_1.dist)(p, loop.circle.c) < loop.circle.r;
        return pointIn(p, (0, geom_ts_1.tessellate)(loop.pts, true));
    }
    function loopSample(loop) {
        return "circle" in loop ? loop.circle.c : loop.pts[0];
    }
    function smallestContainer(doc, p) {
        let best = null;
        let bestA = Infinity;
        for (const e of loopCandidates(doc)) {
            const loop = loopOf(e);
            const area = (0, entities_ts_1.areaOf)(e) ?? 0;
            if (area > 0 && area < bestA && loopContains(loop, p)) {
                bestA = area;
                best = e;
            }
        }
        return best;
    }
    /** Closed shapes directly inside `outer` (not nested inside another inner shape) become holes. */
    function islandsOf(doc, outer) {
        const outerLoop = loopOf(outer);
        const outerArea = (0, entities_ts_1.areaOf)(outer) ?? 0;
        const inside = [];
        for (const e of loopCandidates(doc)) {
            if (e === outer || e.id === outer.id)
                continue;
            const loop = loopOf(e);
            const area = (0, entities_ts_1.areaOf)(e) ?? 0;
            if (area <= 0 || area >= outerArea)
                continue;
            if (loopContains(outerLoop, loopSample(loop)))
                inside.push({ loop, area });
        }
        return inside
            .filter((c) => !inside.some((d) => d !== c && d.area > c.area && loopContains(d.loop, loopSample(c.loop))))
            .map((c) => c.loop);
    }
    function pointIn(p, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const a = poly[i];
            const b = poly[j];
            if (a.y > p.y !== b.y > p.y) {
                const x = ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y || 1e-18) + a.x;
                if (p.x < x)
                    inside = !inside;
            }
        }
        return inside;
    }
    async function dimLinear(io, aligned) {
        io.ensureDraw();
        const a = await io.point("Specify first extension line origin:");
        if (a.t !== "point")
            return;
        const b = await io.point("Specify second extension line origin:", { base: a.p });
        if (b.t !== "point")
            return;
        const loc = await io.point(aligned ? "Specify dimension line location:" : "Specify dimension line location or [Horizontal/Vertical]:", {
            keywords: aligned
                ? []
                : [
                    { name: "Horizontal", aliases: ["h"] },
                    { name: "Vertical", aliases: ["v"] },
                ],
            preview: (c) => {
                const axis = aligned ? "aligned" : Math.abs(c.y - (a.p.y + b.p.y) / 2) >= Math.abs(c.x - (a.p.x + b.p.x) / 2) ? "h" : "v";
                return [io.make({ type: "dim", dim: { kind: "linear", axis, p1: a.p, p2: b.p, loc: c, th: io.doc.dimtxt, prec: io.doc.dimprec } })];
            },
        });
        if (loc.t === "kw") {
            const p = await io.point("Specify dimension line location:");
            if (p.t !== "point")
                return;
            const axis = loc.name === "Vertical" ? "v" : "h";
            io.transact(() => io.doc.add(io.make({ type: "dim", dim: { kind: "linear", axis, p1: a.p, p2: b.p, loc: p.p, th: io.doc.dimtxt, prec: io.doc.dimprec } })));
            return;
        }
        if (loc.t !== "point")
            return;
        const axis = aligned ? "aligned" : Math.abs(loc.p.y - (a.p.y + b.p.y) / 2) >= Math.abs(loc.p.x - (a.p.x + b.p.x) / 2) ? "h" : "v";
        io.transact(() => io.doc.add(io.make({ type: "dim", dim: { kind: "linear", axis, p1: a.p, p2: b.p, loc: loc.p, th: io.doc.dimtxt, prec: io.doc.dimprec } })));
    }
    async function dimRadial(io, dia) {
        io.ensureDraw();
        const hit = await io.pick(dia ? "Select a circle or arc for diameter:" : "Select a circle or arc:");
        if (hit.t !== "ent")
            return;
        const e = hit.ent;
        if (e.type !== "circle" && e.type !== "arc" && e.type !== "donut") {
            io.info("Not a circle or arc.");
            return;
        }
        const c = e.c;
        const r = e.type === "donut" ? e.or : e.r;
        const loc = await io.point("Specify dimension line location:", {
            base: c,
            preview: (p) => [io.make({ type: "dim", dim: { kind: "radial", c, r, ang: Math.atan2(p.y - c.y, p.x - c.x), dia, th: io.doc.dimtxt, prec: io.doc.dimprec } })],
        });
        if (loc.t !== "point")
            return;
        const ang = Math.atan2(loc.p.y - c.y, loc.p.x - c.x);
        io.transact(() => io.doc.add(io.make({ type: "dim", dim: { kind: "radial", c, r, ang, dia, th: io.doc.dimtxt, prec: io.doc.dimprec } })));
    }
    async function dimAngular(io) {
        io.ensureDraw();
        const a = await io.pick("Select first line:");
        const b = await io.pick("Select second line:");
        if (a.t !== "ent" || b.t !== "ent" || a.ent.type !== "line" || b.ent.type !== "line") {
            io.info("Angular dimension needs two lines.");
            return;
        }
        const hit = lineish(a.ent.a, a.ent.b, b.ent.a, b.ent.b);
        if (!hit) {
            io.info("Lines are parallel.");
            return;
        }
        const loc = await io.point("Specify dimension arc location:", {
            base: hit,
            preview: (p) => {
                const r = (0, math_ts_1.dist)(hit, p);
                const a0 = Math.atan2(a.ent.type === "line" ? a.ent.a.y - hit.y : 0, 1);
                void a0;
                const angA = angleOfLineNear(a.ent, hit, a.at);
                const angB = angleOfLineNear(b.ent, hit, b.at);
                return [io.make({ type: "dim", dim: { kind: "angular", c: hit, a0: angA, a1: angB, r, th: io.doc.dimtxt, prec: io.doc.dimprec } })];
            },
        });
        if (loc.t !== "point")
            return;
        const angA = angleOfLineNear(a.ent, hit, a.at);
        const angB = angleOfLineNear(b.ent, hit, b.at);
        io.transact(() => io.doc.add(io.make({ type: "dim", dim: { kind: "angular", c: hit, a0: angA, a1: angB, r: (0, math_ts_1.dist)(hit, loc.p), th: io.doc.dimtxt, prec: io.doc.dimprec } })));
    }
    function lineish(a, b, c, d) {
        const r = (0, math_ts_1.sub)(b, a);
        const s = (0, math_ts_1.sub)(d, c);
        const den = r.x * s.y - r.y * s.x;
        if (Math.abs(den) < 1e-12)
            return null;
        const t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / den;
        return { x: a.x + r.x * t, y: a.y + r.y * t };
    }
    function angleOfLineNear(e, origin, pick) {
        const d1 = (0, math_ts_1.dist)(pick, e.a);
        const d2 = (0, math_ts_1.dist)(pick, e.b);
        const toward = d1 < d2 ? e.a : e.b;
        return Math.atan2(toward.y - origin.y, toward.x - origin.x);
    }
    async function move(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return void io.info("None selected.");
        const base = await io.point("Specify base point:");
        if (base.t !== "point")
            return;
        const to = await io.point("Specify second point:", {
            base: base.p,
            preview: (c) => ents.map((e) => (0, entities_ts_1.translateEnt)((0, entities_ts_1.cloneEnt)(e), (0, math_ts_1.sub)(c, base.p))),
        });
        if (to.t !== "point")
            return;
        const d = (0, math_ts_1.sub)(to.p, base.p);
        io.transact(() => {
            for (const e of ents)
                io.doc.replace((0, entities_ts_1.translateEnt)(e, d));
        });
    }
    async function copy(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return void io.info("None selected.");
        const base = await io.point("Specify base point:");
        if (base.t !== "point")
            return;
        const made = [];
        const commit = () => {
            if (!made.length)
                return 0;
            const batch = made.splice(0, made.length);
            io.transact(() => batch.forEach((e) => io.doc.add(e)));
            return batch.length;
        };
        try {
            while (true) {
                const to = await io.point("Specify second point or [Exit]:", {
                    base: base.p,
                    keywords: [{ name: "Exit", aliases: ["e"] }],
                    preview: (c) => [...made, ...ents.map((e) => (0, entities_ts_1.translateEnt)((0, entities_ts_1.retag)((0, entities_ts_1.cloneEnt)(e)), (0, math_ts_1.sub)(c, base.p)))],
                });
                if (to.t === "none" || to.t === "kw")
                    break;
                if (to.t !== "point")
                    break;
                for (const e of ents)
                    made.push((0, entities_ts_1.translateEnt)((0, entities_ts_1.retag)((0, entities_ts_1.cloneEnt)(e)), (0, math_ts_1.sub)(to.p, base.p)));
                io.preview(made);
            }
        }
        catch (err) {
            commit();
            throw err;
        }
        io.preview(null);
        const n = commit();
        if (n)
            io.info(`${n / ents.length} cop${n === ents.length ? "y" : "ies"} made.`);
    }
    async function rotate(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return void io.info("None selected.");
        const base = await io.point("Specify base point:");
        if (base.t !== "point")
            return;
        const ang = await io.point("Specify rotation angle:", {
            base: base.p,
            acceptNumber: true,
            preview: (c) => {
                const a = Math.atan2(c.y - base.p.y, c.x - base.p.x);
                return ents.map((e) => (0, entities_ts_1.rotateEnt)((0, entities_ts_1.cloneEnt)(e), base.p, a));
            },
        });
        let a = 0;
        if (ang.t === "num")
            a = (ang.v * Math.PI) / 180;
        else if (ang.t === "point")
            a = Math.atan2(ang.p.y - base.p.y, ang.p.x - base.p.x);
        else
            return;
        io.transact(() => {
            for (const e of ents)
                io.doc.replace((0, entities_ts_1.rotateEnt)(e, base.p, a));
        });
    }
    async function scale(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return void io.info("None selected.");
        const base = await io.point("Specify base point:");
        if (base.t !== "point")
            return;
        const f = await io.point("Specify scale factor:", {
            base: base.p,
            acceptNumber: true,
            preview: (c) => {
                const k = (0, math_ts_1.dist)(base.p, c) || 1;
                return ents.map((e) => (0, entities_ts_1.scaleEnt)((0, entities_ts_1.cloneEnt)(e), base.p, k));
            },
        });
        let k = 1;
        if (f.t === "num")
            k = f.v;
        else if (f.t === "point")
            k = (0, math_ts_1.dist)(base.p, f.p);
        else
            return;
        if (Math.abs(k) < 1e-9)
            return void io.info("Scale must be nonzero.");
        io.transact(() => {
            for (const e of ents)
                io.doc.replace((0, entities_ts_1.scaleEnt)(e, base.p, k));
        });
    }
    async function mirror(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return void io.info("None selected.");
        const a = await io.point("Specify first point of mirror line:");
        if (a.t !== "point")
            return;
        const b = await io.point("Specify second point of mirror line:", {
            base: a.p,
            preview: (c) => ents.map((e) => (0, entities_ts_1.mirrorEnt)((0, entities_ts_1.cloneEnt)(e), a.p, c)),
        });
        if (b.t !== "point")
            return;
        const erase = await io.choose("Erase source objects? [Yes/No] <No>:", [
            { name: "Yes", aliases: ["y"] },
            { name: "No", aliases: ["n"] },
        ], "No");
        const copies = ents.map((e) => (0, entities_ts_1.mirrorEnt)((0, entities_ts_1.retag)((0, entities_ts_1.cloneEnt)(e)), a.p, b.p));
        io.transact(() => {
            if (erase === "Yes")
                for (const e of ents)
                    io.doc.remove(e.id);
            copies.forEach((e) => io.doc.add(e));
        });
        io.setSelection([]);
    }
    async function offset(io) {
        const dAns = await io.number(`Specify offset distance <${io.doc.offsetDist}>:`, { def: io.doc.offsetDist });
        const distance = Math.abs(dAns.t === "num" ? dAns.v : io.doc.offsetDist);
        if (distance < 1e-9)
            return void io.info("Distance must be positive.");
        io.doc.offsetDist = distance;
        while (true) {
            const hit = await io.pick("Select object to offset or [Exit]:", { keywords: [{ name: "Exit", aliases: ["e"] }] });
            if (hit.t === "none" || hit.t === "kw")
                return;
            if (hit.t !== "ent")
                return;
            const side = await io.point("Specify point on side to offset:", {
                preview: (c) => {
                    const made = offsetOne(hit.ent, distance, c, io);
                    return made ? [made] : [];
                },
            });
            if (side.t !== "point")
                return;
            const made = offsetOne(hit.ent, distance, side.p, io);
            if (!made) {
                io.info("Cannot offset that object.");
                continue;
            }
            io.transact(() => io.doc.add(made));
        }
    }
    function offsetOne(e, distance, side, io) {
        if (!(0, entities_ts_1.editableEnt)(e, io.doc.layers))
            return null;
        if (e.type === "line") {
            const seg = (0, geom_ts_1.offsetLine)(e.a, e.b, distance, side);
            if (!seg)
                return null;
            return io.make({ type: "line", a: seg[0], b: seg[1], layer: e.layer, color: e.color, lt: e.lt, lw: e.lw });
        }
        if (e.type === "circle" || e.type === "donut") {
            const inside = (0, math_ts_1.dist)(side, e.c) < (e.type === "circle" ? e.r : e.or);
            if (e.type === "circle") {
                const r = inside ? e.r - distance : e.r + distance;
                if (r <= 1e-6)
                    return null;
                return io.make({ type: "circle", c: { ...e.c }, r, layer: e.layer, color: e.color, lt: e.lt, lw: e.lw });
            }
            return null;
        }
        if (e.type === "arc") {
            const inside = (0, math_ts_1.dist)(side, e.c) < e.r;
            const r = inside ? e.r - distance : e.r + distance;
            if (r <= 1e-6)
                return null;
            return io.make({ type: "arc", c: { ...e.c }, r, a0: e.a0, sweep: e.sweep, layer: e.layer, color: e.color, lt: e.lt, lw: e.lw });
        }
        if (e.type === "polyline" && e.pts.length >= 2) {
            const sampled = (0, geom_ts_1.tessellate)(e.pts, e.closed, Math.PI / 24);
            if (sampled.length < 2)
                return null;
            const sign = e.closed ? sideOfClosed(sampled, side) : (0, geom_ts_1.sideOfPoly)(sampled, side);
            const shifted = e.closed ? (0, geom_ts_1.offsetClosedPoly)(sampled, distance * sign) : (0, geom_ts_1.offsetOpenPoly)(sampled, distance * sign);
            if (!shifted || shifted.length < 2)
                return null;
            return io.make({
                type: "polyline",
                pts: shifted,
                closed: e.closed,
                width: e.width,
                layer: e.layer,
                color: e.color,
                lt: e.lt,
                lw: e.lw,
            });
        }
        return null;
    }
    function sideOfClosed(pts, side) {
        // Reuse open-style nearest segment; duplicate the last edge by closing.
        const open = [...pts, pts[0]];
        return (0, geom_ts_1.sideOfPoly)(open, side);
    }
    async function trim(io) {
        io.setSelection([]);
        const picked = await io.select("Select cutting edges (Enter = all):", { noPickFirst: true });
        const all = picked.length === 0;
        if (all)
            io.info("All visible objects are cutting edges.");
        while (true) {
            const hit = await io.pick("Select object to trim:");
            if (hit.t === "none")
                return;
            if (hit.t !== "ent")
                return;
            const cutters = (all ? io.doc.all() : picked).filter((e) => e.id !== hit.ent.id);
            const cuts = cutters.flatMap((e) => (0, entities_ts_1.curvesOf)(e, io.doc.ctx()));
            const repl = (0, entities_ts_1.trimEntity)(hit.ent, cuts, hit.at, io.doc.ctx());
            if (!repl) {
                io.info("Object does not intersect a cutting edge.");
                continue;
            }
            io.transact(() => {
                io.doc.remove(hit.ent.id);
                repl.forEach((e) => io.doc.add(e));
            });
        }
    }
    async function extend(io) {
        io.setSelection([]);
        const picked = await io.select("Select boundary edges (Enter = all):", { noPickFirst: true });
        const all = picked.length === 0;
        while (true) {
            const hit = await io.pick("Select object to extend:");
            if (hit.t === "none")
                return;
            if (hit.t !== "ent")
                return;
            const bounds = (all ? io.doc.all() : picked).filter((e) => e.id !== hit.ent.id).flatMap((e) => (0, entities_ts_1.curvesOf)(e, io.doc.ctx()));
            const next = (0, entities_ts_1.extendEntity)(hit.ent, bounds, hit.at);
            if (!next) {
                io.info("Cannot extend to a boundary.");
                continue;
            }
            io.transact(() => io.doc.replace(next));
        }
    }
    async function fillet(io) {
        io.info(`Current fillet radius: ${io.doc.fillet}`);
        while (true) {
            const first = await io.pick("Select first object or [Radius/Polyline]:", {
                keywords: [
                    { name: "Radius", aliases: ["r"] },
                    { name: "Polyline", aliases: ["p"] },
                ],
            });
            if (first.t === "none")
                return;
            if (first.t === "kw" && first.name === "Radius") {
                const n = await io.number(`Specify fillet radius <${io.doc.fillet}>:`, { def: io.doc.fillet });
                if (n.t === "num")
                    io.doc.fillet = Math.max(0, n.v);
                continue;
            }
            if (first.t === "kw" && first.name === "Polyline") {
                const pl = await io.pick("Select polyline:");
                if (pl.t === "ent" && pl.ent.type === "polyline")
                    filletPolyline(io, pl.ent);
                else
                    io.info("Not a polyline.");
                continue;
            }
            if (first.t !== "ent" || first.ent.type !== "line") {
                io.info("Fillet supports lines (or a polyline via the Polyline option).");
                continue;
            }
            const second = await io.pick("Select second object:");
            if (second.t !== "ent" || second.ent.type !== "line") {
                io.info("Select a line.");
                continue;
            }
            const res = (0, geom_ts_1.filletLines)(first.ent.a, first.ent.b, second.ent.a, second.ent.b, io.doc.fillet, first.at, second.at);
            if (!res) {
                io.info("Lines are parallel.");
                continue;
            }
            io.transact(() => {
                io.doc.replace({ ...first.ent, a: res.a[0], b: res.a[1] });
                io.doc.replace({ ...second.ent, a: res.b[0], b: res.b[1] });
                if (res.arc && res.arc.sweep > 1e-4) {
                    io.doc.add(io.make({
                        type: "arc",
                        c: res.arc.c,
                        r: res.arc.r,
                        a0: res.arc.a0,
                        sweep: res.arc.sweep,
                        layer: first.ent.layer,
                        color: first.ent.color,
                        lt: first.ent.lt,
                        lw: first.ent.lw,
                    }));
                }
            });
        }
    }
    function filletPolyline(io, pl) {
        if (pl.pts.some((p) => p.b)) {
            io.info("Straighten arcs first (explode, or draw line segments).");
            return;
        }
        const r = io.doc.fillet;
        const n = pl.pts.length;
        const segs = pl.closed ? n : n - 1;
        if (segs < 2)
            return;
        // Walk vertices and replace each corner with a fillet, building a new vertex list.
        const corners = [];
        for (let i = 0; i < n; i++) {
            if (!pl.closed && (i === 0 || i === n - 1))
                continue;
            corners.push(i);
        }
        let pts = pl.pts.map((p) => ({ ...p }));
        // Apply from the end so indexes stay valid — actually replacing a vertex with two changes length.
        // Do a fresh build.
        const out = [];
        const count = pl.closed ? n : n - 1;
        if (!pl.closed)
            out.push({ ...pts[0] });
        for (let i = pl.closed ? 0 : 1; i < (pl.closed ? n : n - 1); i++) {
            const prev = pts[(i - 1 + n) % n];
            const cur = pts[i];
            const next = pts[(i + 1) % n];
            if (r <= 1e-9) {
                out.push({ ...cur });
                continue;
            }
            const res = (0, geom_ts_1.filletLines)(prev, cur, cur, next, r, prev, next);
            if (!res?.arc) {
                out.push({ ...cur });
                continue;
            }
            const bulge = Math.tan(res.arc.sweep / 4);
            out.push({ ...res.a[0], b: bulge });
            // The far end of the fillet is the start of the next segment; store it when we reach the next corner.
            // Simpler: push tangent point on the outgoing line without bulge; next iteration starts from geometric truth.
            // Because we still index the original pts, push the outgoing tangent as a normal vertex only if the next
            // corner won't regenerate it. Push it always and accept a duplicate that the next fillet overrides... messy.
            out.push({ ...res.b[0] });
        }
        if (!pl.closed)
            out.push({ ...pts[count] });
        if (out.length < 2)
            return void io.info("Could not fillet.");
        io.transact(() => io.doc.replace({ ...pl, pts: dedupe(out) }));
        io.info("Polyline filleted.");
        void corners;
    }
    function dedupe(pts) {
        const out = [];
        for (const p of pts) {
            const last = out[out.length - 1];
            if (last && (0, math_ts_1.dist)(last, p) < 1e-6) {
                if (p.b)
                    last.b = p.b;
                continue;
            }
            out.push(p);
        }
        return out;
    }
    async function chamfer(io) {
        io.info(`Chamfer distances: ${io.doc.chamferA}, ${io.doc.chamferB}`);
        while (true) {
            const first = await io.pick("Select first line or [Distance]:", {
                keywords: [{ name: "Distance", aliases: ["d"] }],
            });
            if (first.t === "none")
                return;
            if (first.t === "kw") {
                const a = await io.number("Specify first chamfer distance:", { def: io.doc.chamferA });
                const b = await io.number("Specify second chamfer distance:", { def: a.t === "num" ? a.v : io.doc.chamferB });
                if (a.t === "num")
                    io.doc.chamferA = Math.max(0, a.v);
                if (b.t === "num")
                    io.doc.chamferB = Math.max(0, b.v);
                continue;
            }
            if (first.t !== "ent" || first.ent.type !== "line") {
                io.info("Select a line.");
                continue;
            }
            const second = await io.pick("Select second line:");
            if (second.t !== "ent" || second.ent.type !== "line")
                continue;
            const res = (0, geom_ts_1.chamferLines)(first.ent.a, first.ent.b, second.ent.a, second.ent.b, io.doc.chamferA, io.doc.chamferB, first.at, second.at);
            if (!res) {
                io.info("Lines are parallel.");
                continue;
            }
            io.transact(() => {
                io.doc.replace({ ...first.ent, a: res.a[0], b: res.a[1] });
                io.doc.replace({ ...second.ent, a: res.b[0], b: res.b[1] });
                if ((0, math_ts_1.dist)(res.chord[0], res.chord[1]) > 1e-8) {
                    io.doc.add(io.make({
                        type: "line",
                        a: res.chord[0],
                        b: res.chord[1],
                        layer: first.ent.layer,
                        color: first.ent.color,
                        lt: first.ent.lt,
                        lw: first.ent.lw,
                    }));
                }
            });
        }
    }
    async function stretch(io) {
        const a = await io.point("Specify first corner of crossing window:");
        if (a.t !== "point")
            return;
        const b = await io.point("Specify opposite corner:", { base: a.p, rubber: true });
        if (b.t !== "point")
            return;
        const box = {
            minx: Math.min(a.p.x, b.p.x),
            miny: Math.min(a.p.y, b.p.y),
            maxx: Math.max(a.p.x, b.p.x),
            maxy: Math.max(a.p.y, b.p.y),
        };
        const base = await io.point("Specify base point:");
        if (base.t !== "point")
            return;
        const ents = io.doc.all().filter((e) => (0, entities_ts_1.editableEnt)(e, io.doc.layers));
        const to = await io.point("Specify second point:", {
            base: base.p,
            preview: (c) => {
                const d = (0, math_ts_1.sub)(c, base.p);
                const out = [];
                for (const e of ents) {
                    const s = (0, entities_ts_1.stretchEnt)(e, box, d);
                    if (s)
                        out.push(s);
                }
                return out;
            },
        });
        if (to.t !== "point")
            return;
        const d = (0, math_ts_1.sub)(to.p, base.p);
        let n = 0;
        io.transact(() => {
            for (const e of ents) {
                const s = (0, entities_ts_1.stretchEnt)(e, box, d);
                if (s) {
                    io.doc.replace(s);
                    n++;
                }
            }
        });
        io.info(n ? `${n} stretched.` : "Nothing crossed the window.");
    }
    async function arrayCmd(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return void io.info("None selected.");
        const kind = await io.choose("Enter array type [Rectangular/Polar] <Rectangular>:", [
            { name: "Rectangular", aliases: ["r"] },
            { name: "Polar", aliases: ["p"] },
        ], "Rectangular");
        if (kind === "Polar") {
            const c = await io.point("Specify center point of array:");
            if (c.t !== "point")
                return;
            const countA = await io.number("Enter the number of items:", { def: 6 });
            const fillA = await io.number("Specify the angle to fill <360>:", { def: 360 });
            const rot = await io.choose("Rotate items as they are copied? [Yes/No] <Yes>:", [
                { name: "Yes", aliases: ["y"] },
                { name: "No", aliases: ["n"] },
            ], "Yes");
            const count = Math.round(countA.t === "num" ? countA.v : 6);
            const fill = (((fillA.t === "num" ? fillA.v : 360) * Math.PI) / 180);
            if (count < 2)
                return;
            const full = Math.abs(Math.abs(fill) - math_ts_1.TAU) < 1e-3 || Math.abs(fill) >= math_ts_1.TAU - 1e-3;
            const step = full ? (Math.sign(fill) || 1) * (math_ts_1.TAU / count) : fill / (count - 1);
            const made = [];
            for (let i = 1; i < count; i++) {
                const ang = step * i;
                for (const e of ents) {
                    const copy = (0, entities_ts_1.retag)((0, entities_ts_1.cloneEnt)(e));
                    made.push(rot === "Yes" ? (0, entities_ts_1.rotateEnt)(copy, c.p, ang) : translatePolar(copy, c.p, ang, io));
                }
            }
            io.transact(() => made.forEach((e) => io.doc.add(e)));
            io.info(`Polar array, ${count} items.`);
            return;
        }
        const rowsA = await io.number("Enter the number of rows <1>:", { def: 1 });
        const colsA = await io.number("Enter the number of columns <1>:", { def: 1 });
        const rows = Math.max(1, Math.round(rowsA.t === "num" ? rowsA.v : 1));
        const cols = Math.max(1, Math.round(colsA.t === "num" ? colsA.v : 1));
        const rd = await io.number("Enter the distance between rows:", { def: 10 });
        const cd = await io.number("Enter the distance between columns:", { def: 10 });
        if (rd.t !== "num" || cd.t !== "num")
            return;
        const made = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (r === 0 && c === 0)
                    continue;
                for (const e of ents)
                    made.push((0, entities_ts_1.translateEnt)((0, entities_ts_1.retag)((0, entities_ts_1.cloneEnt)(e)), { x: c * cd.v, y: r * rd.v }));
            }
        }
        io.transact(() => made.forEach((e) => io.doc.add(e)));
        io.info("Rectangular array created.");
    }
    function translatePolar(e, center, ang, io) {
        void io;
        const b = bboxCenterOf(e);
        const rel = (0, math_ts_1.sub)(b, center);
        const spun = { x: rel.x * Math.cos(ang) - rel.y * Math.sin(ang), y: rel.x * Math.sin(ang) + rel.y * Math.cos(ang) };
        return (0, entities_ts_1.translateEnt)(e, (0, math_ts_1.sub)(spun, rel));
    }
    function bboxCenterOf(e) {
        if (e.type === "line")
            return { x: (e.a.x + e.b.x) / 2, y: (e.a.y + e.b.y) / 2 };
        if ("c" in e && e.type !== "dim")
            return e.c;
        if (e.type === "text" || e.type === "insert" || e.type === "point")
            return e.p;
        if (e.type === "polyline" || e.type === "spline") {
            const p = e.pts;
            const s = p.reduce((a, q) => ({ x: a.x + q.x, y: a.y + q.y }), { x: 0, y: 0 });
            return { x: s.x / p.length, y: s.y / p.length };
        }
        return { x: 0, y: 0 };
    }
    async function erase(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return void io.info("None selected.");
        io.transact(() => ents.forEach((e) => io.doc.remove(e.id)));
        io.setSelection([]);
        io.info(`${ents.length} erased.`);
    }
    async function explode(io) {
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return;
        let n = 0;
        io.transact(() => {
            for (const e of ents) {
                const parts = (0, entities_ts_1.explodeEnt)(e, io.doc.ctx());
                if (!parts)
                    continue;
                io.doc.remove(e.id);
                parts.forEach((p) => io.doc.add(p));
                n++;
            }
        });
        io.setSelection([]);
        io.info(n ? `${n} exploded.` : "Nothing to explode.");
    }
    async function brk(io) {
        const hit = await io.pick("Select object:");
        if (hit.t !== "ent")
            return;
        const second = await io.point("Specify second break point:", { base: hit.at });
        if (second.t !== "point")
            return;
        const parts = (0, entities_ts_1.breakEntity)(hit.ent, hit.at, second.p);
        if (!parts)
            return void io.info("Cannot break that object.");
        io.transact(() => {
            io.doc.remove(hit.ent.id);
            parts.forEach((p) => io.doc.add(p));
        });
    }
    function reversePts(pts) {
        const rev = [...pts].reverse();
        return rev.map((p, i) => {
            const prev = rev[i + 1];
            const q = { x: p.x, y: p.y };
            if (prev && prev.b)
                q.b = -prev.b;
            return q;
        });
    }
    async function join(io) {
        const ents = io.editable(await io.select("Select lines, arcs, or open polylines to join:"));
        if (ents.length < 2)
            return void io.info("Select at least two objects.");
        const tol = 1e-4;
        // 1. Everything becomes a "piece": a list of vertices with bulges, plus the ids it came from.
        let pieces = [];
        for (const e of ents) {
            if (e.type === "line")
                pieces.push({ kind: "line", pts: [{ ...e.a }, { ...e.b }], ids: [e.id], st: e });
            else if (e.type === "arc" && e.sweep < math_ts_1.TAU - 1e-6)
                pieces.push({
                    kind: "arc",
                    pts: [
                        { ...(0, geom_ts_1.arcPoint)(e.c, e.r, e.a0), b: Math.tan(e.sweep / 4) },
                        { ...(0, geom_ts_1.arcPoint)(e.c, e.r, e.a0 + e.sweep) },
                    ],
                    ids: [e.id],
                    st: e,
                });
            else if (e.type === "polyline" && !e.closed && e.pts.length >= 2)
                pieces.push({ kind: "poly", pts: e.pts.map((p) => ({ ...p })), ids: [e.id], st: e });
        }
        if (pieces.length < 2)
            return void io.info("Nothing to join: select lines, arcs, or open polylines.");
        // 2. Collinear, touching or overlapping lines collapse into one longer line.
        let merged = true;
        while (merged) {
            merged = false;
            outer: for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].kind !== "line")
                    continue;
                for (let j = i + 1; j < pieces.length; j++) {
                    if (pieces[j].kind !== "line")
                        continue;
                    const A = pieces[i].pts;
                    const B = pieces[j].pts;
                    if (!collinearEnough(A[0], A[1], B[0], tol) || !collinearEnough(A[0], A[1], B[1], tol))
                        continue;
                    const span = gapOrOverlap(A[0], A[1], B[0], B[1], tol);
                    if (!span)
                        continue;
                    pieces[i] = { kind: "line", pts: [{ ...span[0] }, { ...span[1] }], ids: [...pieces[i].ids, ...pieces[j].ids], st: pieces[i].st };
                    pieces.splice(j, 1);
                    merged = true;
                    break outer;
                }
            }
        }
        // 3. End-to-end chains of any mix of lines, arcs and polylines become polylines.
        const out = [];
        const used = new Array(pieces.length).fill(false);
        for (let s0 = 0; s0 < pieces.length; s0++) {
            if (used[s0])
                continue;
            used[s0] = true;
            let pts = pieces[s0].pts.map((p) => ({ ...p }));
            const ids = [...pieces[s0].ids];
            let pieceCount = 1;
            let grew = true;
            while (grew) {
                grew = false;
                for (let k = 0; k < pieces.length; k++) {
                    if (used[k])
                        continue;
                    const op = pieces[k].pts;
                    const head = pts[0];
                    const tail = pts[pts.length - 1];
                    const os = op[0];
                    const oe = op[op.length - 1];
                    if ((0, math_ts_1.dist)(tail, os) <= tol)
                        pts = [...pts.slice(0, -1), ...op.map((p) => ({ ...p }))];
                    else if ((0, math_ts_1.dist)(tail, oe) <= tol)
                        pts = [...pts.slice(0, -1), ...reversePts(op)];
                    else if ((0, math_ts_1.dist)(head, oe) <= tol)
                        pts = [...op.slice(0, -1).map((p) => ({ ...p })), ...pts];
                    else if ((0, math_ts_1.dist)(head, os) <= tol)
                        pts = [...reversePts(op).slice(0, -1), ...pts];
                    else
                        continue;
                    used[k] = true;
                    ids.push(...pieces[k].ids);
                    pieceCount++;
                    grew = true;
                    break;
                }
            }
            if (ids.length < 2)
                continue;
            const st = pieces[s0].st;
            const style = { layer: st.layer, color: st.color, lt: st.lt, lw: st.lw };
            if (pieceCount === 1 && pts.length === 2 && !pts[0].b) {
                out.push({ ids, ent: io.make({ type: "line", a: pts[0], b: pts[1], ...style }) });
                continue;
            }
            let closed = false;
            if (pts.length >= 3 && (0, math_ts_1.dist)(pts[0], pts[pts.length - 1]) <= tol) {
                pts = pts.slice(0, -1);
                closed = true;
            }
            out.push({ ids, ent: io.make({ type: "polyline", pts, closed, width: 0, ...style }) });
        }
        if (!out.length)
            return void io.info("Nothing connected closely enough to join.");
        io.transact(() => {
            for (const o of out)
                for (const id of o.ids)
                    io.doc.remove(id);
            for (const o of out)
                io.doc.add(o.ent);
        });
        const n = out.reduce((s, o) => s + o.ids.length, 0);
        io.info(`Joined ${n} object${n === 1 ? "" : "s"} into ${out.length}.`);
    }
    function collinearEnough(a, b, c, tol) {
        const ab = (0, math_ts_1.len)((0, math_ts_1.sub)(b, a)) || 1;
        const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        return Math.abs(cross) / ab <= tol;
    }
    function gapOrOverlap(a, b, c, d, tol) {
        const dir = (0, math_ts_1.norm)((0, math_ts_1.sub)(b, a));
        const proj = (p) => (p.x - a.x) * dir.x + (p.y - a.y) * dir.y;
        const ts = [0, proj(b), proj(c), proj(d)].sort((x, y) => x - y);
        const span = ts[3] - ts[0];
        const len1 = Math.abs(proj(b));
        const len2 = (0, math_ts_1.dist)(c, d);
        if (span > len1 + len2 + tol)
            return null;
        const p0 = (0, math_ts_1.add)(a, (0, math_ts_1.mul)(dir, ts[0]));
        const p1 = (0, math_ts_1.add)(a, (0, math_ts_1.mul)(dir, ts[3]));
        return [p0, p1];
    }
    function weld(a, b, tol) {
        if (a.closed || b.closed)
            return null;
        const ends = [
            { p: a.pts[0], which: "as" },
            { p: a.pts[a.pts.length - 1], which: "ae" },
        ];
        const b0 = b.pts[0];
        const b1 = b.pts[b.pts.length - 1];
        let best = null;
        const options = [
            { d: (0, math_ts_1.dist)(ends[1].p, b0), flipA: false, flipB: false },
            { d: (0, math_ts_1.dist)(ends[1].p, b1), flipA: false, flipB: true },
            { d: (0, math_ts_1.dist)(ends[0].p, b0), flipA: true, flipB: false },
            { d: (0, math_ts_1.dist)(ends[0].p, b1), flipA: true, flipB: true },
        ];
        for (const o of options)
            if (o.d <= tol && (!best || o.d < best.d))
                best = o;
        if (!best)
            return null;
        const A = best.flipA ? [...a.pts].reverse().map(flipBulge) : a.pts.map((p) => ({ ...p }));
        const B = best.flipB ? [...b.pts].reverse().map(flipBulge) : b.pts.map((p) => ({ ...p }));
        const pts = [...A.slice(0, -1), ...B];
        return { ...a, pts, closed: false };
    }
    function flipBulge(p, i, arr) {
        const prev = arr[i + 1];
        if (!prev?.b)
            return { x: p.x, y: p.y };
        return { x: p.x, y: p.y, b: -prev.b };
    }
    async function lengthen(io) {
        const mode = await io.choose("Lengthen by [Delta/Total] <Delta>:", [
            { name: "Delta", aliases: ["d"] },
            { name: "Total", aliases: ["t"] },
        ], "Delta");
        const n = await io.number(mode === "Total" ? "Specify total length:" : "Enter delta length:", { def: 1 });
        if (n.t !== "num")
            return;
        while (true) {
            const hit = await io.pick("Select an object to change:");
            if (hit.t !== "ent")
                return;
            const e = hit.ent;
            let next = null;
            if (e.type === "line") {
                const endA = (0, math_ts_1.dist)(hit.at, e.a) < (0, math_ts_1.dist)(hit.at, e.b);
                const origin = endA ? e.b : e.a;
                const tip = endA ? e.a : e.b;
                const current = (0, math_ts_1.dist)(e.a, e.b);
                const target = mode === "Total" ? n.v : current + n.v;
                if (target <= 1e-6) {
                    io.info("Too short.");
                    continue;
                }
                const dir = (0, math_ts_1.norm)((0, math_ts_1.sub)(tip, origin));
                const moved = (0, math_ts_1.add)(origin, (0, math_ts_1.mul)(dir, target));
                next = { ...e, a: endA ? moved : e.a, b: endA ? e.b : moved };
            }
            else if (e.type === "arc") {
                const s = { x: e.c.x + Math.cos(e.a0) * e.r, y: e.c.y + Math.sin(e.a0) * e.r };
                const end = { x: e.c.x + Math.cos(e.a0 + e.sweep) * e.r, y: e.c.y + Math.sin(e.a0 + e.sweep) * e.r };
                const atStart = (0, math_ts_1.dist)(hit.at, s) < (0, math_ts_1.dist)(hit.at, end);
                const current = Math.abs(e.sweep) * e.r;
                const target = mode === "Total" ? n.v : current + n.v;
                const sweep = Math.min(math_ts_1.TAU * 0.999, target / e.r);
                if (atStart)
                    next = { ...e, a0: e.a0 + e.sweep - sweep, sweep };
                else
                    next = { ...e, sweep };
            }
            else {
                io.info("Lengthen works on lines and arcs.");
                continue;
            }
            if (next)
                io.transact(() => io.doc.replace(next));
        }
    }
    async function pedit(io) {
        const hit = await io.pick("Select polyline:");
        if (hit.t !== "ent")
            return;
        let e = hit.ent;
        if (e.type === "line" || e.type === "arc") {
            const yes = await io.choose("Object selected is not a polyline. Turn it into one? [Yes/No] <Yes>:", [
                { name: "Yes", aliases: ["y"] },
                { name: "No", aliases: ["n"] },
            ], "Yes");
            if (yes !== "Yes")
                return;
            const pl = e.type === "line"
                ? io.make({ type: "polyline", pts: [e.a, e.b], closed: false, width: 0, layer: e.layer, color: e.color, lt: e.lt, lw: e.lw })
                : io.make({
                    type: "polyline",
                    pts: [
                        {
                            x: e.c.x + Math.cos(e.a0) * e.r,
                            y: e.c.y + Math.sin(e.a0) * e.r,
                            b: Math.tan(e.sweep / 4),
                        },
                        {
                            x: e.c.x + Math.cos(e.a0 + e.sweep) * e.r,
                            y: e.c.y + Math.sin(e.a0 + e.sweep) * e.r,
                        },
                    ],
                    closed: false,
                    width: 0,
                    layer: e.layer,
                    color: e.color,
                    lt: e.lt,
                    lw: e.lw,
                });
            io.transact(() => {
                io.doc.remove(e.id);
                io.doc.add(pl);
            });
            e = pl;
        }
        if (e.type !== "polyline")
            return void io.info("Not a polyline.");
        const opt = await io.choose("Enter an option [Close/Open/Join] <Exit>:", [
            { name: e.closed ? "Open" : "Close", aliases: ["c", "o"] },
            { name: "Join", aliases: ["j"] },
            { name: "Exit", aliases: ["x"] },
        ], "Exit");
        if (opt === "Exit")
            return;
        if (opt === "Close" || opt === "Open") {
            io.transact(() => io.doc.replace({ ...e, closed: opt === "Close" }));
            return;
        }
        io.info("Select objects, then use JOIN.");
        await join(io);
    }
    async function matchprop(io) {
        const src = await io.pick("Select source object:");
        if (src.t !== "ent")
            return;
        const dest = io.editable(await io.select("Select destination objects:"));
        if (!dest.length)
            return;
        io.transact(() => {
            for (const e of dest) {
                io.doc.replace({ ...e, layer: src.ent.layer, color: src.ent.color, lt: src.ent.lt, lw: src.ent.lw });
            }
        });
        io.info("Properties matched.");
    }
    async function zoom(io) {
        const a = await io.point("Specify corner of window or [All/Extents/Previous/Scale]:", {
            keywords: [
                { name: "All", aliases: ["a"] },
                { name: "Extents", aliases: ["e"] },
                { name: "Previous", aliases: ["p"] },
                { name: "Scale", aliases: ["s"] },
            ],
        });
        if (a.t === "kw") {
            if (a.name === "Previous")
                io.zoomPrev();
            else if (a.name === "Scale") {
                const n = await io.number("Enter a scale factor:", { def: 1 });
                if (n.t === "num" && n.v > 0)
                    io.zoomScale(n.v);
            }
            else
                io.zoomExtents();
            return;
        }
        if (a.t !== "point")
            return;
        const b = await io.point("Specify opposite corner:", { base: a.p, rubber: true });
        if (b.t !== "point")
            return;
        io.zoomWindow(a.p, b.p);
    }
    async function layerCmd(io) {
        io.showSide("layers");
        io.info(`Current layer: ${io.doc.currentLayer}`);
        const opt = await io.choose("Layer [Make/Set/New/On/Off/Freeze/Thaw/Lock/Unlock/Color/Ltype/Rename/Delete] <exit>:", [
            { name: "Make", aliases: ["m"] },
            { name: "Set", aliases: ["s"] },
            { name: "New", aliases: ["n"] },
            { name: "On", aliases: ["on"] },
            { name: "Off", aliases: ["off"] },
            { name: "Freeze", aliases: ["f"] },
            { name: "Thaw", aliases: ["t"] },
            { name: "Lock", aliases: ["lo"] },
            { name: "Unlock", aliases: ["u"] },
            { name: "Color", aliases: ["c"] },
            { name: "Ltype", aliases: ["lt"] },
            { name: "Rename", aliases: ["r"] },
            { name: "Delete", aliases: ["d"] },
            { name: "Exit", aliases: ["x"] },
        ], "Exit");
        if (opt === "Exit")
            return;
        const name = (await io.text("Enter layer name:")).trim();
        if (!name)
            return;
        const existing = io.doc.layers.find((l) => l.name.toLowerCase() === name.toLowerCase());
        if (opt === "New" || opt === "Make") {
            if (existing) {
                if (opt === "Make") {
                    io.doc.currentLayer = existing.name;
                    io.doc.bump();
                }
                else
                    io.info("Layer already exists.");
                return;
            }
            io.transact(() => {
                io.doc.layers.push({ name, color: 7, lt: "continuous", lw: 0.25, on: true, frozen: false, locked: false });
                if (opt === "Make")
                    io.doc.currentLayer = name;
            });
            return;
        }
        if (!existing)
            return void io.info("No such layer.");
        if (opt === "Set") {
            io.doc.currentLayer = existing.name;
            io.doc.bump();
            return;
        }
        if (opt === "Color") {
            const n = await io.number("Color number 1-255 <7>:", { def: 7 });
            if (n.t !== "num" || !Number.isInteger(n.v) || n.v < 1 || n.v > 255)
                return void io.info("Enter a whole number from 1 to 255.");
            io.transact(() => {
                existing.color = n.v;
            });
            return;
        }
        if (opt === "Ltype") {
            const lt = await io.choose("Linetype [Continuous/Dashed/Hidden/Center/Phantom/Dot/Dashdot/Divide] <Continuous>:", entities_ts_1.LINETYPES.map((n) => ({ name: n, aliases: [n.slice(0, 2)] })), "continuous");
            io.transact(() => {
                existing.lt = lt.toLowerCase();
            });
            return;
        }
        if (opt === "Rename") {
            const to = (await io.text("New layer name:")).trim();
            if (!to)
                return;
            if (existing.name === "0")
                return void io.info("Layer 0 cannot be renamed.");
            if (io.doc.layers.some((l) => l !== existing && l.name.toLowerCase() === to.toLowerCase()))
                return void io.info("That name is already in use.");
            io.transact(() => {
                const was = existing.name;
                existing.name = to;
                if (io.doc.currentLayer === was)
                    io.doc.currentLayer = to;
                const fix = (e) => {
                    if (e.layer.toLowerCase() === was.toLowerCase())
                        e.layer = to;
                };
                for (const e of io.doc.ents.values())
                    fix(e);
                for (const blk of io.doc.blocks.values())
                    for (const e of blk.ents)
                        fix(e);
            });
            return;
        }
        if (opt === "Delete") {
            if (existing.name === "0")
                return void io.info("Layer 0 cannot be deleted.");
            if (existing.name === io.doc.currentLayer)
                return void io.info("The current layer cannot be deleted.");
            const key = existing.name.toLowerCase();
            const inUse = [...io.doc.ents.values()].some((e) => e.layer.toLowerCase() === key) ||
                [...io.doc.blocks.values()].some((blk) => blk.ents.some((e) => e.layer.toLowerCase() === key));
            if (inUse)
                return void io.info("That layer still holds objects. Move or erase them first.");
            io.transact(() => {
                io.doc.layers.splice(io.doc.layers.indexOf(existing), 1);
            });
            return;
        }
        io.transact(() => {
            if (opt === "On")
                existing.on = true;
            if (opt === "Off")
                existing.on = false;
            if (opt === "Freeze") {
                if (existing.name === io.doc.currentLayer)
                    io.info("The current layer cannot be frozen.");
                else
                    existing.frozen = true;
            }
            if (opt === "Thaw")
                existing.frozen = false;
            if (opt === "Lock")
                existing.locked = true;
            if (opt === "Unlock")
                existing.locked = false;
        });
    }
    async function colorCmd(io) {
        const n = await io.text("New object color [bylayer or ACI 1-255]:");
        const s = n.trim().toLowerCase();
        if (s === "bylayer" || s === "byl")
            io.doc.color = "bylayer";
        else if (s === "byblock")
            io.doc.color = "byblock";
        else {
            const v = Number(s);
            if (!Number.isInteger(v) || v < 1 || v > 255)
                return void io.info("Enter BYLAYER or 1–255.");
            io.doc.color = v;
        }
        io.doc.bump();
        io.info(`Color set to ${String(io.doc.color)}.`);
    }
    async function linetypeCmd(io) {
        const n = await io.choose("Linetype [Bylayer/Continuous/Dashed/Hidden/Center/Phantom/Dot/Dashdot/Divide]:", ["bylayer", "continuous", "dashed", "hidden", "center", "phantom", "dot", "dashdot", "divide"].map((name) => ({
            name,
            aliases: [name.slice(0, 2)],
        })), "bylayer");
        io.doc.lt = n.toLowerCase();
        io.doc.bump();
    }
    async function lineweightCmd(io) {
        const n = await io.number("Lineweight in mm, or -1 for bylayer:", { def: -1 });
        if (n.t !== "num")
            return;
        io.doc.lw = n.v < 0 ? "bylayer" : Math.max(0, Math.min(2.11, n.v));
        io.doc.bump();
    }
    async function blockCmd(io) {
        const name = (await io.text("Enter block name:")).trim();
        if (!name)
            return;
        const base = await io.point("Specify insertion base point:");
        if (base.t !== "point")
            return;
        const ents = io.editable(await io.select("Select objects:"));
        if (!ents.length)
            return;
        const blockEnts = ents.map((e) => (0, entities_ts_1.cloneEnt)(e));
        io.transact(() => {
            io.doc.blocks.set(name.toLowerCase(), { name, base: base.p, ents: blockEnts });
            ents.forEach((e) => io.doc.remove(e.id));
            io.doc.add(io.make({ type: "insert", name, p: base.p, sx: 1, sy: 1, rot: 0 }));
        });
        io.info(`Block ${name} defined.`);
    }
    async function insertCmd(io) {
        io.ensureDraw();
        const names = [...io.doc.blocks.values()].map((b) => b.name);
        if (!names.length)
            return void io.info("No blocks defined. Use BLOCK first.");
        io.info(`Blocks: ${names.join(", ")}`);
        const name = (await io.text("Enter block name:")).trim();
        const block = io.doc.blocks.get(name.toLowerCase());
        if (!block)
            return void io.info("Unknown block.");
        const p = await io.point("Specify insertion point:", {
            preview: (c) => {
                const ghost = io.make({ type: "insert", name: block.name, p: c, sx: 1, sy: 1, rot: 0 });
                return [ghost];
            },
        });
        if (p.t !== "point")
            return;
        const sc = await io.number("Specify scale <1>:", { def: 1 });
        const rot = await io.number("Specify rotation <0>:", { def: 0 });
        const s = sc.t === "num" ? sc.v : 1;
        const a = ((rot.t === "num" ? rot.v : 0) * Math.PI) / 180;
        io.transact(() => io.doc.add(io.make({ type: "insert", name: block.name, p: p.p, sx: s, sy: s, rot: a })));
    }
    async function distCmd(io) {
        const a = await io.point("Specify first point:");
        if (a.t !== "point")
            return;
        const b = await io.point("Specify second point:", { base: a.p });
        if (b.t !== "point")
            return;
        const d = (0, math_ts_1.dist)(a.p, b.p);
        const ang = (Math.atan2(b.p.y - a.p.y, b.p.x - a.p.x) * 180) / Math.PI;
        io.info(`Distance = ${d.toFixed(io.doc.prec)}, angle = ${ang.toFixed(2)}°, Δx = ${(b.p.x - a.p.x).toFixed(io.doc.prec)}, Δy = ${(b.p.y - a.p.y).toFixed(io.doc.prec)}`);
    }
    async function idCmd(io) {
        const p = await io.point("Specify point:");
        if (p.t !== "point")
            return;
        io.info(`X = ${p.p.x.toFixed(io.doc.prec)}   Y = ${p.p.y.toFixed(io.doc.prec)}`);
    }
    async function listCmd(io) {
        const ents = await io.select("Select objects to list:");
        if (!ents.length)
            return;
        for (const e of ents) {
            io.info(`${(0, entities_ts_1.describeEnt)(e)}  layer ${e.layer}  color ${e.color}  lt ${e.lt}`);
        }
    }
    async function areaCmd(io) {
        const ents = await io.select("Select a closed object:");
        if (!ents.length)
            return;
        for (const e of ents) {
            const a = (0, entities_ts_1.areaOf)(e);
            if (a === null)
                io.info(`${e.type}: not a closed area.`);
            else
                io.info(`${e.type} area = ${a.toFixed(io.doc.prec)}`);
        }
    }
    async function unitsCmd(io) {
        const u = await io.choose("Units [Millimeters/Inches/Centimeters/Meters/Unitless] <Millimeters>:", [
            { name: "Millimeters", aliases: ["mm"] },
            { name: "Inches", aliases: ["in"] },
            { name: "Centimeters", aliases: ["cm"] },
            { name: "Meters", aliases: ["m"] },
            { name: "Unitless", aliases: ["u"] },
        ], "Millimeters");
        const map = { Millimeters: 4, Inches: 1, Centimeters: 5, Meters: 6, Unitless: 0 };
        io.doc.units = map[u] ?? 4;
        const p = await io.number("Decimal places <4>:", { def: io.doc.prec });
        if (p.t === "num")
            io.doc.prec = Math.max(0, Math.min(8, Math.round(p.v)));
        io.doc.bump();
        io.info("Units updated. Dimensions already drawn keep their text until recreated.");
    }
    exports.COMMANDS = [
        { name: "LINE", aliases: ["l"], group: "Draw", label: "Line", hint: "Segments from point to point", run: line },
        { name: "PLINE", aliases: ["pl", "polyline"], group: "Draw", label: "Polyline", hint: "Connected lines and tangent arcs", run: pline },
        { name: "CIRCLE", aliases: ["c"], group: "Draw", label: "Circle", hint: "Center/radius, 2P, or 3P", run: circle },
        { name: "ARC", aliases: ["a"], group: "Draw", label: "Arc", hint: "3-point, or center-start-end", run: arc },
        { name: "RECTANG", aliases: ["rec", "rectangle"], group: "Draw", label: "Rectangle", hint: "Two-corner rectangle", run: rect },
        { name: "POLYGON", aliases: ["pol"], group: "Draw", label: "Polygon", hint: "Regular polygon", run: polygon },
        { name: "ELLIPSE", aliases: ["el"], group: "Draw", label: "Ellipse", hint: "Axis and conjugate radius", run: ellipse },
        { name: "POINT", aliases: ["po"], group: "Draw", label: "Point", hint: "A node", run: pointCmd },
        { name: "TEXT", aliases: ["t", "dt", "mtext", "mt"], group: "Draw", label: "Text", hint: "Single-line text", run: text },
        { name: "SPLINE", aliases: ["spl"], group: "Draw", label: "Spline", hint: "Smooth fit-point curve", run: spline },
        { name: "XLINE", aliases: ["xl"], group: "Draw", label: "Xline", hint: "Infinite construction line", run: (io) => xline(io, false) },
        { name: "RAY", aliases: ["ray"], group: "Draw", label: "Ray", hint: "Half-infinite line", run: (io) => xline(io, true) },
        { name: "DONUT", aliases: ["do", "doughnut"], group: "Draw", label: "Donut", hint: "Filled ring", run: donut },
        { name: "HATCH", aliases: ["h", "bhatch"], group: "Draw", label: "Hatch", hint: "Solid or ANSI pattern", run: hatch },
        { name: "DIMLINEAR", aliases: ["dli", "dimlin"], group: "Draw", label: "Dim linear", hint: "Horizontal or vertical", run: (io) => dimLinear(io, false) },
        { name: "DIMALIGNED", aliases: ["dal", "dimali"], group: "Draw", label: "Dim aligned", hint: "Parallel to the measured edge", run: (io) => dimLinear(io, true) },
        { name: "DIMRADIUS", aliases: ["dra"], group: "Draw", label: "Dim radius", hint: "Radius of a circle or arc", run: (io) => dimRadial(io, false) },
        { name: "DIMDIAMETER", aliases: ["ddi"], group: "Draw", label: "Dim diameter", hint: "Diameter of a circle or arc", run: (io) => dimRadial(io, true) },
        { name: "DIMANGULAR", aliases: ["dan"], group: "Draw", label: "Dim angular", hint: "Angle between two lines", run: dimAngular },
        { name: "MOVE", aliases: ["m"], group: "Modify", label: "Move", hint: "Translate", run: move },
        { name: "COPY", aliases: ["co", "cp"], group: "Modify", label: "Copy", hint: "Duplicate, repeat until Enter", run: copy },
        { name: "ROTATE", aliases: ["ro"], group: "Modify", label: "Rotate", hint: "Around a base point", run: rotate },
        { name: "SCALE", aliases: ["sc"], group: "Modify", label: "Scale", hint: "Uniform scale", run: scale },
        { name: "MIRROR", aliases: ["mi"], group: "Modify", label: "Mirror", hint: "Reflect across a line", run: mirror },
        { name: "OFFSET", aliases: ["o"], group: "Modify", label: "Offset", hint: "Parallel curve", run: offset },
        { name: "TRIM", aliases: ["tr"], group: "Modify", label: "Trim", hint: "Cut back to edges. Enter = all edges", run: trim },
        { name: "EXTEND", aliases: ["ex"], group: "Modify", label: "Extend", hint: "Lengthen to a boundary", run: extend },
        { name: "FILLET", aliases: ["f"], group: "Modify", label: "Fillet", hint: "Tangent arc, or radius 0 to corner", run: fillet },
        { name: "CHAMFER", aliases: ["cha"], group: "Modify", label: "Chamfer", hint: "Beveled corner", run: chamfer },
        { name: "STRETCH", aliases: ["s"], group: "Modify", label: "Stretch", hint: "Move vertices inside a crossing window", run: stretch },
        { name: "ARRAY", aliases: ["ar"], group: "Modify", label: "Array", hint: "Rectangular or polar", run: arrayCmd },
        { name: "ERASE", aliases: ["e", "delete"], group: "Modify", label: "Erase", hint: "Delete selection", run: erase },
        { name: "EXPLODE", aliases: ["x"], group: "Modify", label: "Explode", hint: "Break compounds into pieces", run: explode },
        { name: "BREAK", aliases: ["br"], group: "Modify", label: "Break", hint: "Gap an object between two points", run: brk },
        { name: "JOIN", aliases: ["j"], group: "Modify", label: "Join", hint: "Weld collinear lines or polylines", run: join },
        { name: "LENGTHEN", aliases: ["len"], group: "Modify", label: "Lengthen", hint: "Delta or total length", run: lengthen },
        { name: "PEDIT", aliases: ["pe"], group: "Modify", label: "Pedit", hint: "Close, open, or join a polyline", run: pedit },
        { name: "MATCHPROP", aliases: ["ma", "painter"], group: "Modify", label: "Match", hint: "Copy layer and style", run: matchprop },
        { name: "ZOOM", aliases: ["z"], group: "View", label: "Zoom", hint: "Window, extents, previous, scale", run: zoom },
        { name: "PAN", aliases: ["p"], group: "View", label: "Pan", hint: "Drag the sheet. Middle mouse always pans", run: (io) => io.panMode() },
        { name: "REGEN", aliases: ["re", "redraw", "r"], group: "View", label: "Regen", hint: "Redraw", run: async (io) => { io.doc.bump(); io.info("Regenerated."); } },
        { name: "DIST", aliases: ["di"], group: "Tools", label: "Distance", hint: "Measure two points", run: distCmd },
        { name: "ID", aliases: ["id"], group: "Tools", label: "ID", hint: "Coordinates of a point", run: idCmd },
        { name: "LIST", aliases: ["li", "ls"], group: "Tools", label: "List", hint: "Dump selected geometry", run: listCmd },
        { name: "AREA", aliases: ["aa"], group: "Tools", label: "Area", hint: "Area of a closed object", run: areaCmd },
        { name: "UNITS", aliases: ["un"], group: "Format", label: "Units", hint: "Millimetres, inches, precision", run: unitsCmd },
        { name: "LAYER", aliases: ["la"], group: "Format", label: "Layers", hint: "Make, set, on, off, lock", run: layerCmd },
        { name: "COLOR", aliases: ["col", "colour"], group: "Format", label: "Color", hint: "ACI color for new objects", run: colorCmd },
        { name: "LINETYPE", aliases: ["lt", "ltype"], group: "Format", label: "Linetype", hint: "Linetype for new objects", run: linetypeCmd },
        { name: "LINEWEIGHT", aliases: ["lw", "lweight"], group: "Format", label: "Lineweight", hint: "Millimetres, or -1 bylayer", run: lineweightCmd },
        { name: "LTSCALE", aliases: ["lts"], group: "Format", label: "LT scale", hint: "Global linetype scale", run: async (io) => {
                const n = await io.number(`Enter linetype scale <${io.doc.ltscale}>:`, { def: io.doc.ltscale });
                if (n.t === "num" && n.v > 0) {
                    io.doc.ltscale = n.v;
                    io.doc.bump();
                }
            } },
        { name: "DIMSTYLE", aliases: ["dst", "dimtxt", "dimstyle"], group: "Format", label: "Dim style", hint: "Dimension text height and decimals for new dimensions", run: async (io) => {
                const h = await io.number(`Dimension text height <${io.doc.dimtxt}>:`, { def: io.doc.dimtxt });
                if (h.t === "num" && h.v > 0)
                    io.doc.dimtxt = h.v;
                const p = await io.number(`Decimal places for dimensions <${io.doc.dimprec}>:`, { def: io.doc.dimprec });
                if (p.t === "num")
                    io.doc.dimprec = Math.max(0, Math.min(8, Math.round(p.v)));
                io.doc.bump();
                io.info(`New dimensions: text ${io.doc.dimtxt}, ${io.doc.dimprec} decimals.`);
            } },
        { name: "SNAP", aliases: ["sn", "snapstep"], group: "Format", label: "Snap spacing", hint: "Grid snap spacing (F9 toggles)", run: async (io) => {
                const n = await io.number(`Snap spacing <${io.snapStepValue()}>:`, { def: io.snapStepValue() });
                if (n.t === "num" && n.v > 0)
                    io.setSnapStep(n.v);
            } },
        { name: "POLARANG", aliases: ["pa", "polar"], group: "Format", label: "Polar angle", hint: "Polar tracking increment in degrees (F10 toggles)", run: async (io) => {
                const n = await io.number(`Polar angle increment <${io.polarStepValue()}>:`, { def: io.polarStepValue() });
                if (n.t === "num" && n.v > 0 && n.v <= 180)
                    io.setPolarStep(n.v);
            } },
        { name: "SAVE", aliases: ["qsave"], group: "Tools", label: "Save", hint: "Download the drawing as DXF", run: async (io) => io.saveDrawing() },
        { name: "SAVEAS", aliases: ["saveas"], group: "Tools", label: "Save as", hint: "Download under a new file name", run: async (io) => {
                const n = (await io.text("File name:")).trim();
                if (n)
                    io.saveDrawing(n);
            } },
        { name: "OPEN", aliases: ["open"], group: "Tools", label: "Open", hint: "Open a DXF file", run: async (io) => io.openDialog() },
        { name: "NEW", aliases: ["new"], group: "Tools", label: "New", hint: "Start an empty drawing", run: async (io) => io.newDrawingCmd() },
        { name: "EXPORTSVG", aliases: ["svg"], group: "Tools", label: "Export SVG", hint: "Vector image of the whole drawing", run: async (io) => io.exportImage("svg") },
        { name: "EXPORTPNG", aliases: ["png"], group: "Tools", label: "Export PNG", hint: "Raster image of the whole drawing", run: async (io) => io.exportImage("png") },
        { name: "BLOCK", aliases: ["b"], group: "Tools", label: "Block", hint: "Define a block from the selection", run: blockCmd },
        { name: "INSERT", aliases: ["i"], group: "Tools", label: "Insert", hint: "Place a block", run: insertCmd },
        { name: "UNDO", aliases: ["u"], group: "Tools", label: "Undo", hint: "Undo last change", run: async (io) => io.undo() },
        { name: "REDO", aliases: ["redo"], group: "Tools", label: "Redo", hint: "Redo", run: async (io) => io.redo() },
    ];
    const BY_ALIAS = new Map();
    for (const cmd of exports.COMMANDS) {
        BY_ALIAS.set(cmd.name.toLowerCase(), cmd);
        for (const a of cmd.aliases)
            BY_ALIAS.set(a.toLowerCase(), cmd);
    }
    function resolveCommand(input) {
        const s = input.trim().toLowerCase();
        if (!s)
            return null;
        const exact = BY_ALIAS.get(s);
        if (exact)
            return exact;
        const hits = exports.COMMANDS.filter((c) => c.name.toLowerCase().startsWith(s) || c.aliases.some((a) => a.toLowerCase().startsWith(s)));
        return hits.length === 1 ? hits[0] : null;
    }
    function matchKeyword(input, keywords) {
        const s = input.trim().toLowerCase();
        if (!s || !keywords.length)
            return null;
        for (const k of keywords) {
            if (k.name.toLowerCase() === s || (k.aliases ?? []).some((a) => a.toLowerCase() === s))
                return k.name;
        }
        const hits = keywords.filter((k) => k.name.toLowerCase().startsWith(s) || (k.aliases ?? []).some((a) => a.toLowerCase().startsWith(s)));
        if (hits.length === 1)
            return hits[0].name;
        if (hits.length > 1)
            return "ambiguous";
        return null;
    }
    void geom_ts_1.closestOnCurve;
    void geom_ts_1.polyCurves;
    void isAbort;
    void math_ts_1.add;
    void math_ts_1.sub;

  };

  factories["selfcheck.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runSelfCheck = runSelfCheck;
    const dxf_ts_1 = require("./dxf.ts");
    const doc_ts_1 = require("./doc.ts");
    const geom_ts_1 = require("./geom.ts");
    const math_ts_1 = require("./math.ts");
    const entities_ts_1 = require("./entities.ts");
    function runSelfCheck() {
        const errors = [];
        const fail = (m) => errors.push(m);
        const arc = (0, geom_ts_1.bulgeArc)({ x: 1, y: 0 }, { x: 0, y: 1 }, Math.tan(Math.PI / 8));
        if (!arc)
            fail("bulge arc missing");
        else {
            if ((0, math_ts_1.dist)(arc.c, { x: 0, y: 0 }) > 1e-3)
                fail(`bulge center ${arc.c.x},${arc.c.y}`);
            if (Math.abs(arc.r - 1) > 1e-3)
                fail(`bulge r ${arc.r}`);
            if (Math.abs(arc.sweep - Math.PI / 2) > 1e-3)
                fail(`bulge sweep ${arc.sweep}`);
        }
        const hit = (0, geom_ts_1.lineIntersect)({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 10 }, false);
        if (!hit || (0, math_ts_1.dist)(hit, { x: 0, y: 0 }) > 1e-6)
            fail("line intersect");
        const fil = (0, geom_ts_1.filletLines)({ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 20 }, 5, { x: 12, y: 0 }, { x: 0, y: 12 });
        if (!fil?.arc)
            fail("fillet missing");
        else {
            if ((0, math_ts_1.dist)(fil.arc.c, { x: 5, y: 5 }) > 1e-3)
                fail(`fillet center ${fil.arc.c.x},${fil.arc.c.y}`);
            if ((0, math_ts_1.dist)(fil.a[0], { x: 5, y: 0 }) > 1e-3)
                fail("fillet tangent A");
            if ((0, math_ts_1.dist)(fil.b[0], { x: 0, y: 5 }) > 1e-3)
                fail("fillet tangent B");
        }
        const doc = new doc_ts_1.Doc();
        doc.add({
            id: (0, entities_ts_1.uid)(),
            type: "line",
            layer: "0",
            color: "bylayer",
            lt: "bylayer",
            lw: "bylayer",
            a: { x: 1, y: 2 },
            b: { x: 4, y: 6 },
        });
        doc.add({
            id: (0, entities_ts_1.uid)(),
            type: "circle",
            layer: "Outline",
            color: 4,
            lt: "dashed",
            lw: 0.5,
            c: { x: 10, y: 10 },
            r: 3,
        });
        doc.add({
            id: (0, entities_ts_1.uid)(),
            type: "polyline",
            layer: "0",
            color: "bylayer",
            lt: "bylayer",
            lw: "bylayer",
            closed: true,
            width: 0,
            pts: [
                { x: 0, y: 0, b: 0.5 },
                { x: 8, y: 0 },
                { x: 8, y: 5 },
                { x: 0, y: 5 },
            ],
        });
        doc.add({
            id: (0, entities_ts_1.uid)(),
            type: "text",
            layer: "Text",
            color: "bylayer",
            lt: "bylayer",
            lw: "bylayer",
            p: { x: 2, y: 3 },
            h: 2.5,
            rot: 0,
            text: "Northline",
            align: "left",
        });
        const dxf = (0, dxf_ts_1.writeDxf)(doc);
        const back = (0, dxf_ts_1.readDxf)(dxf);
        const types = back.doc.all().map((e) => e.type).sort().join(",");
        if (!types.includes("line") || !types.includes("circle") || !types.includes("polyline") || !types.includes("text")) {
            fail(`dxf roundtrip types ${types}`);
        }
        const pl = back.doc.all().find((e) => e.type === "polyline");
        if (!pl || pl.type !== "polyline" || !pl.closed || Math.abs((pl.pts[0]?.b ?? 0) - 0.5) > 1e-6)
            fail("polyline bulge roundtrip");
        const circ = back.doc.all().find((e) => e.type === "circle");
        if (!circ || circ.type !== "circle" || circ.color !== 4 || circ.layer !== "Outline")
            fail("circle style roundtrip");
        if (!back.doc.layers.some((l) => l.name === "Outline"))
            fail("layer table");
        return errors;
    }

  };

  factories["app.ts"] = function (exports, require, module) {

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mountNorthline = mountNorthline;
    const commands_ts_1 = require("./commands.ts");
    const geom_ts_1 = require("./geom.ts");
    const doc_ts_1 = require("./doc.ts");
    const dxf_ts_1 = require("./dxf.ts");
    const entities_ts_1 = require("./entities.ts");
    const aci_ts_1 = require("./aci.ts");
    const math_ts_1 = require("./math.ts");
    const render_ts_1 = require("./render.ts");
    const sample_ts_1 = require("./sample.ts");
    const selfcheck_ts_1 = require("./selfcheck.ts");
    const snaps_ts_1 = require("./snaps.ts");
    const STORE = "northline.drawing.v1";
    const PREFS = "northline.prefs.v1";
    const ICONS = {
        LINE: "M5 19 L19 5",
        PLINE: "M4 17 L9 8 L14 13 L20 5",
        CIRCLE: "M12 12 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0",
        ARC: "M5 17 A9 9 0 0 1 19 8",
        RECTANG: "M5 7 H19 V17 H5 Z",
        POLYGON: "M12 4 L20 9 L17 19 H7 L4 9 Z",
        ELLIPSE: "M12 7 A8 4.5 0 1 0 12 16.9 A8 4.5 0 1 0 12 7",
        POINT: "M12 12 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0",
        TEXT: "M6 18 L12 5 L18 18 M8.2 13 H15.8",
        SPLINE: "M4 16 C8 16 8 6 12 8 C16 10 16 18 20 8",
        XLINE: "M3 18 L21 6 M12 4 V8 M12 16 V20",
        RAY: "M5 17 L19 7 M19 7 L15 8 M19 7 L18 11",
        DONUT: "M12 12 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M12 12 m-2.2 0 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0",
        HATCH: "M6 18 L18 6 M8 18 L18 8 M6 14 L14 6 M6 10 L10 6",
        DIMLINEAR: "M5 17 H19 M5 17 V13 M19 17 V13 M12 15 V8",
        DIMALIGNED: "M6 18 L18 8 M6 18 L8 14 M18 8 L15 9",
        DIMRADIUS: "M8 16 A6 6 0 1 1 16 10 M8 16 L14 10",
        DIMDIAMETER: "M6 17 L18 7 M7 16 A7 7 0 1 0 17 8",
        DIMANGULAR: "M6 18 L12 8 L19 16",
        MOVE: "M12 4 V20 M12 4 L9 7 M12 4 L15 7 M4 12 H20 M4 12 L7 9 M4 12 L7 15",
        COPY: "M8 8 H18 V18 H8 Z M6 6 H14 V8",
        ROTATE: "M12 7 A6 6 0 1 1 7 14 M12 7 L15 4 M12 7 L9 4",
        SCALE: "M6 18 L18 6 M6 18 H11 M6 18 V13 M18 6 H13 M18 6 V11",
        MIRROR: "M12 4 V20 M7 8 L4 12 L7 16 M17 8 L20 12 L17 16",
        OFFSET: "M7 17 L17 7 M5 14 L12 18",
        TRIM: "M5 19 L14 10 M16 6 L19 9 M8 16 L5 19",
        EXTEND: "M5 18 H14 M14 18 L18 14 M8 8 L16 16",
        FILLET: "M5 18 H11 A5 5 0 0 0 16 13 V6",
        CHAMFER: "M5 18 H10 L15 8 V5 M15 8 H19",
        STRETCH: "M4 12 H20 M8 8 L4 12 L8 16 M16 8 L20 12 L16 16",
        ARRAY: "M5 5 H10 V10 H5 Z M14 5 H19 V10 H14 Z M5 14 H10 V19 H5 Z M14 14 H19 V19 H14 Z",
        ERASE: "M8 8 L16 16 M16 8 L8 16",
        EXPLODE: "M12 12 L6 6 M12 12 L18 6 M12 12 L6 18 M12 12 L18 18 M12 4 V8 M12 16 V20",
        BREAK: "M5 16 H10 M14 16 H19",
        JOIN: "M5 12 H10 M14 12 H19 M10 12 L14 12",
        LENGTHEN: "M5 16 H16 M16 16 L13 13 M16 16 L13 19",
        PEDIT: "M5 17 L9 8 H15 L19 17",
        MATCHPROP: "M7 17 L12 6 L17 17 M9 13 H15",
    };
    function svg(name) {
        const d = ICONS[name] ?? "M6 12 H18 M12 6 V18";
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
    }
    function mountNorthline(host) {
        const app = new Northline(host);
        return {
            destroy() {
                app.destroy();
            },
        };
    }
    class Northline {
        doc = new doc_ts_1.Doc();
        last = null;
        index = new doc_ts_1.Spatial();
        view = { cx: 90, cy: 50, ppm: 4, w: 800, h: 600 };
        host;
        canvas;
        ctx;
        logEl;
        promptEl;
        input;
        coordEl;
        layerSelect;
        side;
        layerBox;
        propBox;
        fileNameEl;
        snapCap;
        toolButtons = [];
        selection = new Set();
        hover = null;
        grips = [];
        previewEnts = [];
        cursor = null;
        snap = null;
        trackFrom = null;
        trackDir = null;
        rubber = null;
        waiter = null;
        token = 0;
        activeName = null;
        lastCmd = null;
        typed = [];
        typedAt = -1;
        ortho = false;
        grid = true;
        snapOn = false;
        polar = true;
        osnap = true;
        lwt = true;
        modes = { ...snaps_ts_1.DEFAULT_OSNAP };
        snapStep = 5;
        polarStep = 45;
        fileName = "untitled.dxf";
        dirty = false;
        views = [];
        wheelTimer = 0;
        gripDrag = null;
        drag = null;
        pan = null;
        pointers = new Map();
        pinch = null;
        consumed = new Set();
        raf = 0;
        saveTimer = 0;
        ro;
        onKey;
        onWin;
        onUnload;
        palLayer = null;
        alive = true;
        menuEl = null;
        constructor(host) {
            this.host = host;
            host.classList.add("nl-host");
            host.innerHTML = SHELL;
            const root = host.querySelector(".nl");
            this.canvas = root.querySelector("canvas");
            const ctx = this.canvas.getContext("2d");
            if (!ctx)
                throw new Error("Canvas is unavailable.");
            this.ctx = ctx;
            this.logEl = root.querySelector(".nl-log");
            this.promptEl = root.querySelector(".nl-prompt");
            this.input = root.querySelector(".nl-input");
            this.coordEl = root.querySelector(".nl-coord");
            this.layerSelect = root.querySelector(".nl-layerselect");
            this.side = root.querySelector(".nl-side");
            this.layerBox = root.querySelector(".nl-layers");
            this.propBox = root.querySelector(".nl-props");
            this.fileNameEl = root.querySelector(".nl-filename");
            this.snapCap = root.querySelector(".nl-snapcap");
            this.buildTools(root.querySelector(".nl-tools"));
            this.buildMenus(root.querySelector(".nl-menus"));
            this.buildStatus(root.querySelector(".nl-status"));
            this.restorePrefs(root);
            this.bootDrawing();
            this.bind(root);
            this.ro = new ResizeObserver(() => this.resize());
            this.ro.observe(this.canvas);
            this.onKey = (e) => this.key(e);
            window.addEventListener("keydown", this.onKey);
            this.onUnload = (e) => {
                if (this.dirty) {
                    e.preventDefault();
                    e.returnValue = "";
                }
            };
            window.addEventListener("beforeunload", this.onUnload);
            this.onWin = (e) => {
                const t = e && e.target;
                if (t && t.closest && (t.closest(".nl-menuwrap") || t.closest(".nl-help-card") || t.closest(".nl-swatchpop")))
                    return;
                if (t && t.classList && t.classList.contains("nl-help")) {
                    t.hidden = true;
                    return;
                }
                this.closePop();
            };
            window.addEventListener("pointerdown", this.onWin);
            this.resize();
            this.echo("Northline  —  a 2D drafting desk");
            this.echo("L line · C circle · PL polyline · A arc · REC rectangle · O offset · TR trim · F fillet");
            this.echo("Wheel zooms, middle mouse pans, right-click is Enter.  ? lists commands.");
            this.prompt("Command:");
            const problems = (0, selfcheck_ts_1.runSelfCheck)();
            if (problems.length)
                console.warn("Northline self-check", problems);
            const w = window;
            w.__northline = {
                ready: true,
                count: () => this.doc.ents.size,
                check: () => (0, selfcheck_ts_1.runSelfCheck)(),
                run: (name) => this.launch(name),
                doc: () => this.doc,
                view: () => this.view,
                selection: () => [...this.selection],
            };
            if (!window.matchMedia("(pointer: coarse)").matches)
                this.input.focus();
        }
        destroy() {
            this.alive = false;
            cancelAnimationFrame(this.raf);
            this.ro.disconnect();
            window.removeEventListener("keydown", this.onKey);
            window.removeEventListener("pointerdown", this.onWin);
            window.removeEventListener("beforeunload", this.onUnload);
            this.host.innerHTML = "";
        }
        // —— CadIO ——
        point(message, opt) {
            return this.wait("point", message, opt?.keywords ?? [], opt);
        }
        number(message, opt) {
            const hint = opt?.def !== undefined ? message.replace(/:\s*$/, "") : message;
            return this.wait("number", opt?.def !== undefined ? `${hint} <${opt.def}>:` : message, opt?.keywords ?? [], undefined, opt?.def !== undefined ? String(opt.def) : undefined);
        }
        text(message) {
            return this.wait("text", message, []);
        }
        choose(message, keywords, def) {
            return this.wait("choose", message, keywords, undefined, def);
        }
        select(message = "Select objects:", opts) {
            if (!opts?.noPickFirst && this.selection.size) {
                const ents = this.selectionEnts();
                this.info(`${ents.length} found`);
                return Promise.resolve(ents);
            }
            return new Promise((resolve, reject) => {
                this.waiter = {
                    mode: "select",
                    keywords: [{ name: "All", aliases: ["all"] }],
                    picked: new Set(),
                    resolve: (v) => resolve(v),
                    reject,
                };
                this.prompt(message);
                this.input.value = "";
            });
        }
        pick(message, opt) {
            return this.wait("pick", message, opt?.keywords ?? []);
        }
        transact(fn) {
            const changed = this.doc.transact(fn);
            if (changed) {
                this.dirty = true;
                this.scheduleSave();
            }
            this.syncChrome();
            this.requestDraw();
            return changed;
        }
        info(s) {
            this.echo(s);
        }
        make(partial) {
            return (0, doc_ts_1.stamp)(this.doc, partial);
        }
        preview(ents) {
            this.previewEnts = ents ?? [];
            this.requestDraw();
        }
        ppm() {
            return this.view.ppm;
        }
        selection() {
            return this.selectionEnts();
        }
        setSelection(ids) {
            this.selection = new Set(ids);
            this.refreshGrips();
            this.syncProps();
            this.requestDraw();
        }
        editable(ents) {
            const ok = ents.filter((e) => (0, entities_ts_1.editableEnt)(e, this.doc.layers));
            const skipped = ents.length - ok.length;
            if (skipped)
                this.info(`${skipped} on a locked or hidden layer skipped.`);
            if (!ok.length && ents.length)
                this.info("None selected.");
            return ok;
        }
        ensureDraw() {
            const layer = this.doc.layer(this.doc.currentLayer);
            if (!layer.on || layer.frozen || layer.locked) {
                this.info(`Cannot draw on layer ${layer.name}. It is ${layer.locked ? "locked" : layer.frozen ? "frozen" : "off"}.`);
                throw new commands_ts_1.AbortCmd();
            }
        }
        zoomExtents() {
            this.pushView();
            const b = this.doc.extents();
            if (!b) {
                this.view.cx = 0;
                this.view.cy = 0;
                this.view.ppm = 8;
            }
            else
                (0, render_ts_1.viewOfBox)(this.view, b.minx, b.miny, b.maxx, b.maxy, 1.18);
            this.requestDraw();
        }
        zoomPrev() {
            const v = this.views.pop();
            if (!v)
                return void this.info("No previous view.");
            this.view.cx = v.cx;
            this.view.cy = v.cy;
            this.view.ppm = v.ppm;
            this.requestDraw();
        }
        zoomWindow(a, b) {
            this.pushView();
            (0, render_ts_1.viewOfBox)(this.view, Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.x, b.x), Math.max(a.y, b.y), 1);
            this.requestDraw();
        }
        zoomScale(factor) {
            this.pushView();
            this.view.ppm = Math.min(8000, Math.max(0.002, this.view.ppm * factor));
            this.requestDraw();
        }
        panMode() {
            this.info("Drag to pan. Enter or right-click when finished.");
            return this.wait("pan", "Pan — Enter to exit:", []);
        }
        undo() {
            if (!this.doc.undo())
                this.info("Nothing to undo.");
            else {
                this.info("Undo");
                this.pruneSelection();
                this.scheduleSave();
                this.syncChrome();
            }
        }
        redo() {
            if (!this.doc.redo())
                this.info("Nothing to redo.");
            else {
                this.info("Redo");
                this.pruneSelection();
                this.scheduleSave();
                this.syncChrome();
            }
        }
        snapStepValue() {
            return this.snapStep;
        }
        setSnapStep(v) {
            this.snapStep = v;
            this.savePrefs();
            this.requestDraw();
            this.echo(`Snap spacing ${v}. F9 toggles snap.`);
        }
        polarStepValue() {
            return this.polarStep;
        }
        setPolarStep(v) {
            this.polarStep = v;
            this.savePrefs();
            this.echo(`Polar increment ${v}°. F10 toggles polar tracking.`);
        }
        saveDrawing(name) {
            if (name)
                this.fileName = /\.dxf$/i.test(name) ? name : `${name}.dxf`;
            this.save();
        }
        openDialog() {
            this.host.querySelector(".nl-file").click();
        }
        newDrawingCmd() {
            void this.newDrawing();
        }
        selectAll() {
            this.selection = new Set(this.doc.all().filter((en) => this.canSelect(en)).map((en) => en.id));
            this.refreshGrips();
            this.syncProps();
            this.requestDraw();
        }
        deselect() {
            this.selection.clear();
            this.refreshGrips();
            this.syncProps();
            this.requestDraw();
        }
        eraseSelection() {
            const ents = this.editable(this.selectionEnts());
            if (!ents.length)
                return;
            this.transact(() => ents.forEach((en) => this.doc.remove(en.id)));
            this.selection.clear();
            this.refreshGrips();
            this.syncProps();
        }
        download(blob, name) {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        }
        exportImage(kind) {
            const b = this.doc.extents();
            if (!b)
                return void this.echo("Nothing to export.");
            const base = this.fileName.replace(/\.dxf$/i, "");
            if (kind === "svg") {
                this.download(new Blob([this.buildSvg(b)], { type: "image/svg+xml" }), `${base}.svg`);
                this.echo(`Exported ${base}.svg`);
                return;
            }
            const root = this.host.querySelector(".nl");
            const theme = (0, render_ts_1.themeFrom)(root);
            const w = 2400;
            const bw = Math.max(1e-6, b.maxx - b.minx);
            const bh = Math.max(1e-6, b.maxy - b.miny);
            const h = Math.max(200, Math.round(w * (bh / bw)));
            const cv = document.createElement("canvas");
            cv.width = w;
            cv.height = Math.min(h, 6000);
            const view = { cx: 0, cy: 0, ppm: 1, w: cv.width, h: cv.height };
            (0, render_ts_1.viewOfBox)(view, b.minx, b.miny, b.maxx, b.maxy, 1.06);
            view.ppm = Math.min(8000, view.ppm);
            const ctx = cv.getContext("2d");
            (0, render_ts_1.drawScene)(ctx, view, this.doc, theme, { preview: [], selected: new Set(), hover: null, grips: [], rubber: null, snap: null, trackFrom: null, cursor: null, showCross: false, pickbox: false }, { grid: false, lwt: this.lwt, snapStep: 0 });
            cv.toBlob((blob) => {
                if (blob) {
                    this.download(blob, `${base}.png`);
                    this.echo(`Exported ${base}.png`);
                }
            }, "image/png");
        }
        buildSvg(b) {
            const pad = Math.max(b.maxx - b.minx, b.maxy - b.miny) * 0.03 + 1;
            const minx = b.minx - pad;
            const maxx = b.maxx + pad;
            const miny = b.miny - pad;
            const maxy = b.maxy + pad;
            const X = (x) => +(x - minx).toFixed(5);
            const Y = (y) => +(maxy - y).toFixed(5);
            const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
            const DASH = { dashed: [6, 3], hidden: [3, 1.5], center: [12, 2, 1.5, 2], phantom: [12, 2, 1.5, 2, 1.5, 2], dot: [0.4, 2], dashdot: [6, 2, 0.4, 2], divide: [6, 2, 0.4, 2, 0.4, 2] };
            const out = [];
            let clipN = 0;
            const defs = [];
            const pathOf = (pts, closed) => {
                const n = pts.length;
                const segs = closed ? n : n - 1;
                let d = `M${X(pts[0].x)} ${Y(pts[0].y)}`;
                for (let i = 0; i < segs; i++) {
                    const p = pts[i];
                    const q = pts[(i + 1) % n];
                    const arc = p.b ? (0, geom_ts_1.bulgeArc)(p, q, p.b) : null;
                    if (arc) {
                        const large = Math.abs(arc.sweep) > Math.PI ? 1 : 0;
                        const sf = arc.sweep > 0 ? 0 : 1;
                        d += `A${arc.r} ${arc.r} 0 ${large} ${sf} ${X(q.x)} ${Y(q.y)}`;
                    }
                    else
                        d += `L${X(q.x)} ${Y(q.y)}`;
                }
                return d + (closed ? "Z" : "");
            };
            const emit = (e, host) => {
                if (e.type === "insert") {
                    const block = this.doc.blocks.get(e.name.toLowerCase());
                    if (block)
                        for (const c of (0, entities_ts_1.placedInsert)(e, block))
                            emit(c, e);
                    return;
                }
                if (e.type === "dim") {
                    for (const c of (0, entities_ts_1.explodeDim)(e))
                        emit(c, e);
                    return;
                }
                if (!(0, entities_ts_1.visibleEnt)(e, this.doc.layers))
                    return;
                const paint = (0, entities_ts_1.resolvedPaint)(e, this.doc.layers, "#000000");
                const col = paint.color;
                const dash = DASH[paint.lt];
                const sw = Math.max(0.05, paint.lw);
                const stroke = `fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash.map((n) => +(n * this.doc.ltscale).toFixed(3)).join(" ")}"` : ""}`;
                const sample = (a) => a.map((p) => ({ x: p.x, y: p.y }));
                switch (e.type) {
                    case "line":
                        out.push(`<path d="M${X(e.a.x)} ${Y(e.a.y)}L${X(e.b.x)} ${Y(e.b.y)}" ${stroke}/>`);
                        break;
                    case "circle":
                        out.push(`<circle cx="${X(e.c.x)}" cy="${Y(e.c.y)}" r="${e.r}" ${stroke}/>`);
                        break;
                    case "arc": {
                        const s0 = (0, geom_ts_1.arcPoint)(e.c, e.r, e.a0);
                        const s1 = (0, geom_ts_1.arcPoint)(e.c, e.r, e.a0 + e.sweep);
                        out.push(`<path d="M${X(s0.x)} ${Y(s0.y)}A${e.r} ${e.r} 0 ${e.sweep > Math.PI ? 1 : 0} 0 ${X(s1.x)} ${Y(s1.y)}" ${stroke}/>`);
                        break;
                    }
                    case "polyline":
                        out.push(`<path d="${pathOf(e.pts, e.closed)}" ${stroke}/>`);
                        break;
                    case "spline":
                        out.push(`<path d="${pathOf(sample((0, entities_ts_1.splineSamples)(e.pts)), false)}" ${stroke}/>`);
                        break;
                    case "ellipse":
                        out.push(`<path d="${pathOf(sample((0, entities_ts_1.ellipseSamples)(e, 96)), e.sweep >= math_ts_1.TAU - 1e-3)}" ${stroke}/>`);
                        break;
                    case "donut":
                        out.push(`<path fill="${col}" fill-rule="evenodd" d="M${X(e.c.x - e.or)} ${Y(e.c.y)}a${e.or} ${e.or} 0 1 0 ${2 * e.or} 0a${e.or} ${e.or} 0 1 0 ${-2 * e.or} 0ZM${X(e.c.x - e.ir)} ${Y(e.c.y)}a${e.ir} ${e.ir} 0 1 0 ${2 * e.ir} 0a${e.ir} ${e.ir} 0 1 0 ${-2 * e.ir} 0Z"/>`);
                        break;
                    case "point":
                        out.push(`<path d="M${X(e.p.x) - 0.6} ${Y(e.p.y) - 0.6}l1.2 1.2m0 -1.2l-1.2 1.2" ${stroke}/>`);
                        break;
                    case "text": {
                        const lines = e.text.split("\n");
                        const anchor = e.align === "center" ? "middle" : e.align === "right" ? "end" : "start";
                        const tsp = lines.map((l, i) => `<tspan x="0" dy="${i === 0 ? 0 : e.h * 1.25}">${esc(l)}</tspan>`).join("");
                        out.push(`<text transform="translate(${X(e.p.x)} ${Y(e.p.y)}) rotate(${+(-(e.rot * 180) / Math.PI).toFixed(4)})" font-family="Arial, Helvetica, sans-serif" font-size="${e.h}" text-anchor="${anchor}" fill="${col}">${tsp}</text>`);
                        break;
                    }
                    case "hatch": {
                        const d = e.loops.map((l) => ("circle" in l ? `M${X(l.circle.c.x - l.circle.r)} ${Y(l.circle.c.y)}a${l.circle.r} ${l.circle.r} 0 1 0 ${2 * l.circle.r} 0a${l.circle.r} ${l.circle.r} 0 1 0 ${-2 * l.circle.r} 0Z` : pathOf(l.pts, l.closed))).join("");
                        if (e.solid) {
                            out.push(`<path d="${d}" fill="${col}" fill-opacity="0.55" fill-rule="evenodd"/>`);
                            break;
                        }
                        const id = `h${clipN++}`;
                        defs.push(`<clipPath id="${id}"><path d="${d}" clip-rule="evenodd"/></clipPath>`);
                        const spacing = Math.max(0.4, 3.2 * (e.scale || 1));
                        const name = e.pattern.toUpperCase();
                        const angles = name === "ANSI37" ? [45, 135] : name === "ANSI32" ? [45, 45] : [45];
                        const hb = (0, entities_ts_1.entityBBox)(e, this.doc.ctx());
                        const diag = Math.hypot(hb.maxx - hb.minx, hb.maxy - hb.miny) + spacing * 2;
                        const cx = (hb.minx + hb.maxx) / 2;
                        const cy = (hb.miny + hb.maxy) / 2;
                        let seg = "";
                        angles.forEach((deg, idx) => {
                            const ang = ((deg + e.angle) * Math.PI) / 180;
                            const dir = { x: Math.cos(ang), y: Math.sin(ang) };
                            const nrm = { x: -dir.y, y: dir.x };
                            const steps = Math.min(4000, Math.ceil(diag / spacing));
                            const shift = name === "ANSI32" && idx === 1 ? spacing / 2 : 0;
                            for (let i = -steps; i <= steps; i++) {
                                const ox = cx + nrm.x * (i * spacing + shift);
                                const oy = cy + nrm.y * (i * spacing + shift);
                                seg += `M${X(ox - dir.x * diag)} ${Y(oy - dir.y * diag)}L${X(ox + dir.x * diag)} ${Y(oy + dir.y * diag)}`;
                            }
                        });
                        out.push(`<g clip-path="url(#${id})"><path d="${seg}" fill="none" stroke="${col}" stroke-width="0.13"/></g>`);
                        break;
                    }
                    default:
                        break;
                }
                void host;
            };
            for (const e of this.doc.all())
                emit(e, null);
            const W = +(maxx - minx).toFixed(4);
            const H = +(maxy - miny).toFixed(4);
            const unit = this.doc.units === 4 ? "mm" : this.doc.units === 5 ? "cm" : this.doc.units === 6 ? "m" : this.doc.units === 1 ? "in" : "";
            const size = unit ? `width="${W}${unit}" height="${H}${unit}" ` : "";
            return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" ${size}viewBox="0 0 ${W} ${H}">\n<defs>${defs.join("")}</defs>\n<rect width="${W}" height="${H}" fill="#ffffff"/>\n${out.join("\n")}\n</svg>\n`;
        }
        showSide(which) {
            this.side.classList.add("is-open");
            const el = which === "layers" ? this.layerBox : this.propBox;
            el.scrollIntoView({ block: "nearest" });
        }
        // —— boot ——
        bootDrawing() {
            const raw = localStorage.getItem(STORE);
            if (raw) {
                try {
                    const data = JSON.parse(raw);
                    this.doc.restore(data.snap);
                    if (data.view) {
                        this.view.cx = data.view.cx;
                        this.view.cy = data.view.cy;
                        this.view.ppm = data.view.ppm;
                    }
                    this.fileName = data.name || "untitled.dxf";
                    this.fileNameEl.textContent = this.fileName;
                    this.syncChrome();
                    return;
                }
                catch {
                    /* fall through to the sample plate */
                }
            }
            (0, sample_ts_1.loadSample)(this.doc);
            this.fileName = "sample-plate.dxf";
            this.fileNameEl.textContent = this.fileName;
            this.syncChrome();
            requestAnimationFrame(() => this.zoomExtents());
        }
        restorePrefs(root) {
            try {
                const p = JSON.parse(localStorage.getItem(PREFS) || "{}");
                root.dataset.theme = p.theme || "ink";
                if (p.ortho !== undefined)
                    this.ortho = p.ortho;
                if (p.grid !== undefined)
                    this.grid = p.grid;
                if (p.snap !== undefined)
                    this.snapOn = p.snap;
                if (p.polar !== undefined)
                    this.polar = p.polar;
                if (p.osnap !== undefined)
                    this.osnap = p.osnap;
                if (p.lwt !== undefined)
                    this.lwt = p.lwt;
                if (p.modes)
                    this.modes = { ...snaps_ts_1.DEFAULT_OSNAP, ...p.modes };
                if (p.snapStep)
                    this.snapStep = p.snapStep;
                if (p.polarStep)
                    this.polarStep = p.polarStep;
            }
            catch {
                root.dataset.theme = "ink";
            }
        }
        savePrefs() {
            const root = this.host.querySelector(".nl");
            localStorage.setItem(PREFS, JSON.stringify({
                theme: root?.dataset.theme || "ink",
                ortho: this.ortho,
                grid: this.grid,
                snap: this.snapOn,
                polar: this.polar,
                osnap: this.osnap,
                lwt: this.lwt,
                modes: this.modes,
                snapStep: this.snapStep,
                polarStep: this.polarStep,
            }));
        }
        scheduleSave() {
            window.clearTimeout(this.saveTimer);
            this.saveTimer = window.setTimeout(() => this.persist(), 250);
        }
        persist() {
            try {
                localStorage.setItem(STORE, JSON.stringify({
                    snap: this.doc.snapshot(),
                    view: { cx: this.view.cx, cy: this.view.cy, ppm: this.view.ppm },
                    name: this.fileName,
                }));
            }
            catch {
                this.echo("Autosave failed — the drawing is too large for local storage.");
            }
        }
        // —— commands ——
        launch(name, alreadyEchoed = false) {
            const cmd = (0, commands_ts_1.resolveCommand)(name);
            if (!cmd) {
                this.echo(`Unknown command "${name.trim()}". Type ? for the list.`);
                return;
            }
            this.abortWait();
            const token = ++this.token;
            this.activeName = cmd.name;
            this.lastCmd = cmd.name;
            if (!alreadyEchoed)
                this.echo(cmd.name);
            this.previewEnts = [];
            this.rubber = null;
            this.gripDrag = null;
            this.markTools();
            void this.run(cmd.run, token);
        }
        async run(fn, token) {
            try {
                await fn(this);
            }
            catch (err) {
                if (!this.alive || token !== this.token)
                    return;
                if (!(err instanceof commands_ts_1.AbortCmd)) {
                    console.error(err);
                    this.echo("Command failed.");
                }
                else
                    this.echo("*Cancel*");
            }
            if (!this.alive || token !== this.token)
                return;
            this.activeName = null;
            this.waiter = null;
            this.previewEnts = [];
            this.rubber = null;
            this.prompt("Command:");
            this.markTools();
            this.refreshGrips();
            this.syncChrome();
            this.requestDraw();
            if (!window.matchMedia("(pointer: coarse)").matches)
                this.input.focus();
        }
        wait(mode, message, keywords, opt, def) {
            this.abortWait();
            this.prompt(message);
            return new Promise((resolve, reject) => {
                this.waiter = { mode, keywords, opt, def, resolve: (v) => resolve(v), reject };
            });
        }
        abortWait() {
            const w = this.waiter;
            this.waiter = null;
            if (w)
                w.reject(new commands_ts_1.AbortCmd());
        }
        settle(value) {
            const w = this.waiter;
            if (!w)
                return;
            this.waiter = null;
            this.rubber = null;
            this.previewEnts = [];
            w.resolve(value);
        }
        submitInput(raw) {
            const text = raw;
            this.input.value = "";
            const trimmed = text.trim();
            if (!this.waiter) {
                if (!trimmed) {
                    if (this.lastCmd)
                        this.launch(this.lastCmd);
                    return;
                }
                if (trimmed === "?") {
                    this.openHelp();
                    return;
                }
                this.typed.push(trimmed);
                this.typedAt = this.typed.length;
                this.echo(trimmed);
                this.launch(trimmed, true);
                return;
            }
            const w = this.waiter;
            if (!trimmed) {
                if (w.mode === "point" || w.mode === "pick")
                    this.settle({ t: "none" });
                else if (w.mode === "select")
                    this.finishSelect();
                else if (w.mode === "number")
                    this.settle(w.def !== undefined ? { t: "num", v: Number(w.def) } : { t: "none" });
                else if (w.mode === "choose")
                    this.settle(w.def ?? w.keywords[0]?.name ?? "");
                else if (w.mode === "text")
                    this.settle("");
                else if (w.mode === "pan")
                    this.settle(undefined);
                return;
            }
            this.echo(trimmed);
            if (w.mode === "text") {
                this.settle(text);
                return;
            }
            const kw = (0, commands_ts_1.matchKeyword)(trimmed, w.keywords);
            if (kw === "ambiguous") {
                this.echo("Ambiguous option.");
                return;
            }
            if (kw) {
                if (w.mode === "select" && kw === "All") {
                    w.picked = new Set(this.doc.all().filter((e) => this.canSelect(e)).map((e) => e.id));
                    this.selection = new Set(w.picked);
                    this.echo(`${w.picked.size} found`);
                    this.finishSelect();
                    return;
                }
                if (w.mode === "choose")
                    this.settle(kw);
                else
                    this.settle({ t: "kw", name: kw });
                return;
            }
            if (w.mode === "number") {
                const n = Number(trimmed);
                if (!Number.isFinite(n)) {
                    this.echo("Requires a numeric value.");
                    return;
                }
                this.settle({ t: "num", v: n });
                return;
            }
            if (w.mode === "choose") {
                this.echo("Invalid option keyword.");
                return;
            }
            if (w.mode === "point") {
                const parsed = parsePoint(trimmed, w.opt?.base !== undefined ? w.opt.base : this.last);
                if (parsed && parsed !== "bad") {
                    this.last = parsed;
                    this.settle({ t: "point", p: parsed });
                    return;
                }
                if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) {
                    const n = Number(trimmed);
                    if (w.opt?.acceptNumber) {
                        this.settle({ t: "num", v: n });
                        return;
                    }
                    const origin = w.opt?.base !== undefined ? w.opt.base : this.last;
                    if (origin && this.trackDir && (this.trackDir.x || this.trackDir.y)) {
                        const p = { x: origin.x + this.trackDir.x * n, y: origin.y + this.trackDir.y * n };
                        this.last = p;
                        this.settle({ t: "point", p });
                        return;
                    }
                    this.echo("Point or option keyword required.");
                    return;
                }
                this.echo(parsed === "bad" ? "Invalid point." : "Point or option keyword required.");
                return;
            }
            this.echo("Invalid input.");
        }
        finishSelect() {
            const ids = this.waiter?.picked ?? new Set();
            this.selection = new Set(ids);
            const ents = [...ids].map((id) => this.doc.get(id)).filter((e) => !!e);
            this.echo(`${ents.length} found`);
            this.refreshGrips();
            this.settle(ents);
        }
        // —— drawing ——
        resize() {
            const rect = this.canvas.getBoundingClientRect();
            this.view.w = Math.max(1, rect.width);
            this.view.h = Math.max(1, rect.height);
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            this.canvas.width = Math.floor(this.view.w * dpr);
            this.canvas.height = Math.floor(this.view.h * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.requestDraw();
        }
        requestDraw() {
            if (this.raf)
                return;
            this.raf = requestAnimationFrame(() => {
                this.raf = 0;
                if (!this.alive)
                    return;
                this.paint();
            });
        }
        paint() {
            const root = this.host.querySelector(".nl");
            const theme = (0, render_ts_1.themeFrom)(root);
            const picking = !this.waiter || this.waiter.mode === "select" || this.waiter.mode === "pick";
            (0, render_ts_1.drawScene)(this.ctx, this.view, this.doc, theme, {
                preview: this.previewEnts,
                selected: this.selection,
                hover: this.hover,
                grips: this.waiter ? [] : this.grips,
                rubber: this.rubber,
                snap: this.snap,
                trackFrom: this.trackFrom,
                cursor: this.cursor,
                showCross: !!this.cursor,
                pickbox: picking,
            }, { grid: this.grid, lwt: this.lwt, snapStep: this.snapOn ? this.snapStep : 0 });
        }
        screenOf(e) {
            const r = this.canvas.getBoundingClientRect();
            return { x: e.clientX - r.left, y: e.clientY - r.top };
        }
        moveCursor(screen) {
            let world = (0, render_ts_1.s2w)(this.view, screen);
            const base = this.acquireBase();
            const wantSnap = this.osnap && (this.waiter?.mode === "point" || this.gripDrag);
            this.snap = null;
            this.trackFrom = null;
            if (wantSnap) {
                const aperture = 12 / this.view.ppm;
                const hit = (0, snaps_ts_1.findSnap)(this.doc, this.index, world, aperture, this.modes, base);
                if (hit) {
                    this.snap = { p: hit.p, kind: hit.kind };
                    world = hit.p;
                }
            }
            if (!this.snap && base) {
                if (this.ortho) {
                    world = (0, snaps_ts_1.orthoPoint)(base, world);
                    this.trackFrom = base;
                    this.trackDir = normPt(world, base);
                }
                else if (this.polar) {
                    const locked = (0, snaps_ts_1.polarPoint)(base, world, this.polarStep, this.view.ppm);
                    if (locked) {
                        world = locked.p;
                        this.trackFrom = base;
                        this.trackDir = locked.dir;
                    }
                }
            }
            if (this.snapOn && !this.snap && !this.trackFrom && (this.waiter?.mode === "point" || this.gripDrag)) {
                world = {
                    x: Math.round(world.x / this.snapStep) * this.snapStep,
                    y: Math.round(world.y / this.snapStep) * this.snapStep,
                };
            }
            this.cursor = world;
            if (this.gripDrag) {
                const next = (0, entities_ts_1.applyGrip)((0, entities_ts_1.cloneEnt)(this.gripDrag.ent), this.gripDrag.grip, world);
                this.previewEnts = [next];
            }
            else if (this.waiter?.mode === "point" && this.waiter.opt?.preview) {
                this.previewEnts = this.waiter.opt.preview(world) ?? [];
            }
            if (this.waiter?.mode === "point" && this.waiter.opt?.rubber && base) {
                const crossing = world.x < base.x;
                this.rubber = { a: base, b: world, crossing };
            }
            else if (this.drag?.moved && (!this.waiter || this.waiter.mode === "select")) {
                const crossing = world.x < this.drag.world.x;
                this.rubber = { a: this.drag.world, b: world, crossing };
            }
            const rel = this.last && this.waiter ? `  @${(0, math_ts_1.fmt)(world.x - this.last.x, this.doc.prec)},${(0, math_ts_1.fmt)(world.y - this.last.y, this.doc.prec)}` : "";
            this.coordEl.textContent = `${(0, math_ts_1.fmt)(world.x, this.doc.prec)}, ${(0, math_ts_1.fmt)(world.y, this.doc.prec)}${rel}`;
            if (this.snap) {
                const s = (0, render_ts_1.w2s)(this.view, this.snap.p);
                this.snapCap.hidden = false;
                this.snapCap.textContent = this.snap.kind;
                this.snapCap.style.left = `${s.x + 14}px`;
                this.snapCap.style.top = `${s.y + 14}px`;
            }
            else
                this.snapCap.hidden = true;
            if (!this.waiter || this.waiter.mode === "select" || this.waiter.mode === "pick") {
                const tol = 8 / this.view.ppm;
                const under = (0, snaps_ts_1.entityUnder)(this.doc, this.index, world, tol, (e) => this.canSelect(e) || (0, entities_ts_1.visibleEnt)(e, this.doc.layers));
                this.hover = under && this.canSelect(under) ? under.id : null;
            }
            else
                this.hover = null;
            this.requestDraw();
        }
        acquireBase() {
            if (this.gripDrag)
                return this.gripDrag.grip.p;
            if (this.waiter?.mode === "point") {
                const opt = this.waiter.opt;
                if (opt && opt.base !== undefined)
                    return opt.base;
                return this.last;
            }
            return null;
        }
        canSelect(e) {
            const layer = this.doc.layer(e.layer);
            return layer.on && !layer.frozen && !layer.locked;
        }
        selectionEnts() {
            return [...this.selection].map((id) => this.doc.get(id)).filter((e) => !!e);
        }
        refreshGrips() {
            this.grips = [];
            if (this.waiter)
                return;
            for (const e of this.selectionEnts())
                this.grips.push(...(0, entities_ts_1.gripsOf)(e));
        }
        pruneSelection() {
            for (const id of [...this.selection])
                if (!this.doc.has(id))
                    this.selection.delete(id);
            this.refreshGrips();
        }
        pushView() {
            this.views.push({ cx: this.view.cx, cy: this.view.cy, ppm: this.view.ppm });
            if (this.views.length > 40)
                this.views.shift();
        }
        // —— chrome ——
        echo(s) {
            const row = document.createElement("div");
            row.textContent = s;
            this.logEl.appendChild(row);
            while (this.logEl.childElementCount > 250)
                this.logEl.firstElementChild?.remove();
            this.logEl.scrollTop = this.logEl.scrollHeight;
        }
        prompt(message) {
            this.promptEl.textContent = message;
        }
        syncChrome() {
            this.fileNameEl.textContent = this.dirty ? `${this.fileName} *` : this.fileName;
            this.fillLayers();
            this.syncProps();
            this.markToggles();
            this.refreshGrips();
        }
        fillLayers() {
            const cur = this.layerSelect.value;
            this.layerSelect.innerHTML = "";
            for (const layer of this.doc.layers) {
                const opt = document.createElement("option");
                opt.value = layer.name;
                opt.textContent = layer.name;
                if (layer.name === this.doc.currentLayer)
                    opt.selected = true;
                this.layerSelect.appendChild(opt);
            }
            if (cur && [...this.layerSelect.options].some((o) => o.value === cur) && cur === this.doc.currentLayer) {
                /* keep */
            }
            this.layerBox.innerHTML = "";
            const head = document.createElement("div");
            head.className = "nl-side-head";
            head.innerHTML = `<span>Layers</span>`;
            const add = document.createElement("button");
            add.type = "button";
            add.textContent = "New";
            const makeLayer = (raw) => {
                const name = raw.trim();
                if (!name)
                    return;
                if (this.doc.layers.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
                    this.echo("Layer already exists.");
                    return;
                }
                this.transact(() => {
                    this.doc.layers.push({ name, color: 7, lt: "continuous", lw: 0.25, on: true, frozen: false, locked: false });
                    this.doc.currentLayer = name;
                });
            };
            add.addEventListener("click", () => {
                const box = this.layerBox.querySelector(".nl-newlayer");
                if (box) {
                    box.remove();
                    return;
                }
                const wrap = document.createElement("div");
                wrap.className = "nl-newlayer";
                const inp = document.createElement("input");
                inp.placeholder = "Layer name, Enter to add";
                inp.addEventListener("keydown", (e) => {
                    e.stopPropagation();
                    if (e.key === "Enter")
                        makeLayer(inp.value);
                    else if (e.key === "Escape")
                        wrap.remove();
                });
                wrap.appendChild(inp);
                head.after(wrap);
                inp.focus();
            });
            head.appendChild(add);
            this.layerBox.appendChild(head);
            for (const layer of this.doc.layers) {
                this.layerBox.appendChild(this.layerRow(layer));
                if (this.palLayer === layer.name)
                    this.layerBox.appendChild(this.palette(layer));
            }
            this.osnapRow();
        }
        layerRow(layer) {
            const row = document.createElement("div");
            row.className = "nl-layer" + (layer.name === this.doc.currentLayer ? " is-current" : "");
            const swatch = document.createElement("button");
            swatch.type = "button";
            swatch.className = "nl-swatch";
            swatch.style.background = (0, aci_ts_1.aciHex)(layer.color, "#f4f1ea");
            swatch.title = "Color";
            swatch.addEventListener("click", () => {
                this.palLayer = this.palLayer === layer.name ? null : layer.name;
                this.syncChrome();
            });
            const name = document.createElement("button");
            name.type = "button";
            name.className = "nl-layer-name";
            name.textContent = layer.name;
            name.title = "Click: make current. Double-click: rename.";
            name.addEventListener("click", () => {
                this.doc.currentLayer = layer.name;
                this.doc.bump();
                this.syncChrome();
                this.echo(`Current layer: ${layer.name}`);
            });
            name.addEventListener("dblclick", () => {
                if (layer.name === "0")
                    return void this.echo("Layer 0 cannot be renamed.");
                const inp = document.createElement("input");
                inp.className = "nl-layer-rename";
                inp.value = layer.name;
                name.replaceWith(inp);
                inp.focus();
                inp.select();
                let done = false;
                const finish = (ok) => {
                    if (done)
                        return;
                    done = true;
                    const to = inp.value.trim();
                    if (!ok || !to || to === layer.name)
                        return void this.syncChrome();
                    if (this.doc.layers.some((l) => l !== layer && l.name.toLowerCase() === to.toLowerCase())) {
                        this.echo("That name is already in use.");
                        return void this.syncChrome();
                    }
                    this.transact(() => {
                        const was = layer.name;
                        layer.name = to;
                        if (this.doc.currentLayer === was)
                            this.doc.currentLayer = to;
                        const fix = (e) => {
                            if (e.layer.toLowerCase() === was.toLowerCase())
                                e.layer = to;
                        };
                        for (const e of this.doc.ents.values())
                            fix(e);
                        for (const blk of this.doc.blocks.values())
                            for (const e of blk.ents)
                                fix(e);
                    });
                };
                inp.addEventListener("keydown", (e) => {
                    e.stopPropagation();
                    if (e.key === "Enter")
                        finish(true);
                    else if (e.key === "Escape")
                        finish(false);
                });
                inp.addEventListener("blur", () => finish(true));
            });
            row.append(swatch, name, this.flag(layer.on ? "On" : "Off", layer.on, () => this.transact(() => void (layer.on = !layer.on)), layer.on ? "On" : "Off", "Visible: click to turn off"), this.flag(layer.frozen ? "Frozen" : "Thawed", !layer.frozen, () => this.transact(() => {
                if (!layer.frozen && layer.name === this.doc.currentLayer)
                    return void this.echo("The current layer cannot be frozen.");
                layer.frozen = !layer.frozen;
            }), layer.frozen ? "Fz" : "Th", layer.frozen ? "Frozen: click to thaw" : "Thawed: click to freeze"), this.flag(layer.locked ? "Locked" : "Unlocked", !layer.locked, () => this.transact(() => void (layer.locked = !layer.locked)), layer.locked ? "Lk" : "Un", layer.locked ? "Locked: click to unlock" : "Unlocked: click to lock"));
            return row;
        }
        palette(layer) {
            const box = document.createElement("div");
            box.className = "nl-palette";
            for (const c of [1, 2, 3, 4, 5, 6, 7, 8, 9, 30, 40, 50, 60, 70, 80, 90, 110, 130, 150, 170, 190, 210, 230, 250]) {
                const b = document.createElement("button");
                b.type = "button";
                b.title = `ACI ${c}`;
                b.style.background = (0, aci_ts_1.aciHex)(c, "#f4f1ea");
                if (c === layer.color)
                    b.className = "is-on";
                b.addEventListener("click", () => {
                    this.palLayer = null;
                    this.transact(() => {
                        layer.color = c;
                    });
                });
                box.appendChild(b);
            }
            return box;
        }
        flag(label, on, click, text, tip) {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "nl-flag" + (on ? " is-on" : "");
            b.textContent = text ?? label.slice(0, 2);
            b.title = tip ?? label;
            b.addEventListener("click", (e) => {
                e.stopPropagation();
                click();
            });
            return b;
        }
        osnapRow() {
            const box = document.createElement("div");
            box.className = "nl-osnaps";
            const title = document.createElement("div");
            title.className = "nl-side-head";
            title.textContent = "Object snap";
            box.appendChild(title);
            const keys = Object.keys(this.modes);
            for (const k of keys) {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "nl-chip" + (this.modes[k] ? " is-on" : "");
                b.textContent = k;
                b.addEventListener("click", () => {
                    this.modes[k] = !this.modes[k];
                    this.savePrefs();
                    this.syncChrome();
                });
                box.appendChild(b);
            }
            this.layerBox.appendChild(box);
        }
        syncProps() {
            const ents = this.selectionEnts();
            this.propBox.innerHTML = "";
            const head = document.createElement("div");
            head.className = "nl-side-head";
            head.textContent = ents.length ? `Properties · ${ents.length}` : "Properties";
            this.propBox.appendChild(head);
            if (!ents.length) {
                const p = document.createElement("p");
                p.className = "nl-muted";
                p.textContent = "Nothing selected. New objects use the current layer, color, and linetype.";
                this.propBox.appendChild(p);
                this.propBox.appendChild(this.field("Color", String(this.doc.color), (v) => {
                    const s = v.trim().toLowerCase();
                    if (s === "bylayer")
                        this.doc.color = "bylayer";
                    else if (Number.isInteger(Number(s)) && Number(s) >= 1 && Number(s) <= 255)
                        this.doc.color = Number(s);
                    else
                        this.echo("Color must be bylayer or a whole number from 1 to 255.");
                    this.doc.bump();
                    this.syncChrome();
                }));
                this.propBox.appendChild(this.selectField("Linetype", ["bylayer", ...entities_ts_1.LINETYPES], String(this.doc.lt), (v) => {
                    this.doc.lt = v;
                    this.doc.bump();
                }));
                this.propBox.appendChild(this.selectField("Lineweight", ["bylayer", ...entities_ts_1.WEIGHTS.map(String)], String(this.doc.lw), (v) => {
                    this.doc.lw = v === "bylayer" ? "bylayer" : Number(v);
                    this.doc.bump();
                }));
                return;
            }
            const layerName = same(ents.map((e) => e.layer));
            this.propBox.appendChild(this.selectField("Layer", this.doc.layers.map((l) => l.name), layerName ?? "*varies*", (v) => {
                this.transact(() => {
                    for (const e of ents)
                        this.doc.replace({ ...e, layer: v });
                });
            }));
            const color = same(ents.map((e) => String(e.color)));
            this.propBox.appendChild(this.field("Color", color ?? "*varies*", (v) => {
                const s = v.trim().toLowerCase();
                const colorV = s === "bylayer" ? "bylayer" : s === "byblock" ? "byblock" : Number(s);
                if (colorV !== "bylayer" && colorV !== "byblock" && !(Number.isFinite(colorV) && colorV >= 1 && colorV <= 255))
                    return;
                this.transact(() => {
                    for (const e of ents)
                        this.doc.replace({ ...e, color: colorV });
                });
            }));
            const lt = same(ents.map((e) => e.lt));
            this.propBox.appendChild(this.selectField("Linetype", ["bylayer", ...entities_ts_1.LINETYPES], lt ?? "*varies*", (v) => {
                this.transact(() => {
                    for (const e of ents)
                        this.doc.replace({ ...e, lt: v });
                });
            }));
            const lw = same(ents.map((e) => String(e.lw)));
            this.propBox.appendChild(this.selectField("Lineweight", ["bylayer", ...entities_ts_1.WEIGHTS.map(String)], lw ?? "*varies*", (v) => {
                const weight = v === "bylayer" ? "bylayer" : Number(v);
                this.transact(() => {
                    for (const e of ents)
                        this.doc.replace({ ...e, lw: weight });
                });
            }));
            if (ents.length === 1)
                this.geomFields(ents[0]);
        }
        geomFields(e) {
            const set = (mutate) => {
                this.transact(() => {
                    const c = (0, entities_ts_1.cloneEnt)(e);
                    mutate(c);
                    this.doc.replace(c);
                });
            };
            if (e.type === "line") {
                this.numPair("Start", e.a, (p) => set((c) => { if (c.type === "line")
                    c.a = p; }));
                this.numPair("End", e.b, (p) => set((c) => { if (c.type === "line")
                    c.b = p; }));
            }
            else if (e.type === "circle") {
                this.numPair("Center", e.c, (p) => set((c) => { if (c.type === "circle")
                    c.c = p; }));
                this.propBox.appendChild(this.field("Radius", String(e.r), (v) => set((c) => { if (c.type === "circle")
                    c.r = Math.max(1e-6, Number(v) || c.r); })));
            }
            else if (e.type === "text") {
                this.propBox.appendChild(this.field("Text", e.text, (v) => set((c) => { if (c.type === "text")
                    c.text = v; })));
                this.propBox.appendChild(this.field("Height", String(e.h), (v) => set((c) => { if (c.type === "text")
                    c.h = Math.max(1e-4, Number(v) || c.h); })));
            }
        }
        numPair(label, p, commit) {
            this.propBox.appendChild(this.field(`${label} X`, String(round4(p.x)), (v) => {
                if (v.trim() !== "" && Number.isFinite(Number(v)))
                    commit({ x: Number(v), y: p.y });
                else
                    this.syncProps();
            }));
            this.propBox.appendChild(this.field(`${label} Y`, String(round4(p.y)), (v) => {
                if (v.trim() !== "" && Number.isFinite(Number(v)))
                    commit({ x: p.x, y: Number(v) });
                else
                    this.syncProps();
            }));
        }
        field(label, value, commit) {
            const lab = document.createElement("label");
            lab.className = "nl-field";
            const span = document.createElement("span");
            span.textContent = label;
            const input = document.createElement("input");
            input.value = value;
            input.addEventListener("change", () => commit(input.value));
            input.addEventListener("keydown", (e) => e.stopPropagation());
            lab.append(span, input);
            return lab;
        }
        selectField(label, options, value, commit) {
            const lab = document.createElement("label");
            lab.className = "nl-field";
            const span = document.createElement("span");
            span.textContent = label;
            const sel = document.createElement("select");
            if (value === "*varies*") {
                const o = document.createElement("option");
                o.textContent = "*varies*";
                o.value = "";
                sel.appendChild(o);
            }
            for (const name of options) {
                const o = document.createElement("option");
                o.value = name;
                o.textContent = name;
                if (name === value)
                    o.selected = true;
                sel.appendChild(o);
            }
            sel.addEventListener("change", () => {
                if (sel.value)
                    commit(sel.value);
            });
            lab.append(span, sel);
            return lab;
        }
        buildTools(nav) {
            for (const group of ["Draw", "Modify"]) {
                const label = document.createElement("div");
                label.className = "nl-tool-label";
                label.textContent = group;
                nav.appendChild(label);
                for (const cmd of commands_ts_1.COMMANDS.filter((c) => c.group === group)) {
                    const b = document.createElement("button");
                    b.type = "button";
                    b.className = "nl-tool";
                    b.dataset.cmd = cmd.name;
                    b.title = `${cmd.label}  (${cmd.aliases[0]?.toUpperCase() ?? cmd.name}) — ${cmd.hint}`;
                    b.innerHTML = svg(cmd.name);
                    b.setAttribute("aria-label", cmd.label);
                    b.addEventListener("click", () => {
                        this.launch(cmd.name);
                        this.input.focus();
                    });
                    nav.appendChild(b);
                    this.toolButtons.push(b);
                }
            }
        }
        buildMenus(bar) {
            const cmd = (n) => () => this.launch(n);
            const menus = [
                {
                    label: "File",
                    items: [
                        { label: "New", run: () => void this.newDrawing() },
                        { label: "Open DXF…", run: () => this.openDialog() },
                        { label: "Save DXF  (Ctrl+S)", run: () => this.save() },
                        { label: "Save as…", run: cmd("SAVEAS") },
                        { label: "Export SVG", run: () => this.exportImage("svg") },
                        { label: "Export PNG", run: () => this.exportImage("png") },
                        { label: "Open sample plate", run: () => void this.openSample() },
                    ],
                },
                {
                    label: "Edit",
                    items: [
                        { label: "Undo  (Ctrl+Z)", run: () => this.undo() },
                        { label: "Redo  (Ctrl+Y)", run: () => this.redo() },
                        { label: "Select all  (Ctrl+A)", run: () => this.selectAll() },
                        { label: "Deselect  (Esc)", run: () => this.deselect() },
                        { label: "Delete selection  (Del)", run: () => this.eraseSelection() },
                    ],
                },
                {
                    label: "Draw",
                    items: commands_ts_1.COMMANDS.filter((c) => c.group === "Draw").map((c) => ({ label: c.label, run: () => this.launch(c.name) })),
                },
                {
                    label: "Modify",
                    items: commands_ts_1.COMMANDS.filter((c) => c.group === "Modify").map((c) => ({ label: c.label, run: () => this.launch(c.name) })),
                },
                {
                    label: "Format",
                    items: ["LAYER", "COLOR", "LINETYPE", "LINEWEIGHT", "LTSCALE", "UNITS", "DIMSTYLE", "SNAP", "POLARANG"].map((n) => {
                        const c = commands_ts_1.COMMANDS.find((x) => x.name === n);
                        return { label: c ? c.label : n, run: cmd(n) };
                    }),
                },
                {
                    label: "Tools",
                    items: ["DIST", "AREA", "LIST", "ID", "BLOCK", "INSERT"].map((n) => {
                        const c = commands_ts_1.COMMANDS.find((x) => x.name === n);
                        return { label: c ? c.label : n, run: cmd(n) };
                    }),
                },
                {
                    label: "View",
                    items: [
                        { label: "Zoom extents", run: () => this.zoomExtents() },
                        { label: "Zoom window", run: cmd("ZOOM") },
                        { label: "Zoom previous", run: () => this.zoomPrev() },
                        { label: "Pan", run: () => this.launch("PAN") },
                        { label: "Theme: Ink", run: () => this.setTheme("ink") },
                        { label: "Theme: Vellum", run: () => this.setTheme("vellum") },
                        { label: "Theme: Blueprint", run: () => this.setTheme("blueprint") },
                    ],
                },
            ];
            for (const menu of menus) {
                const wrap = document.createElement("div");
                wrap.className = "nl-menuwrap";
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "nl-menubtn";
                btn.textContent = menu.label;
                const pop = document.createElement("div");
                pop.className = "nl-pop";
                pop.hidden = true;
                for (const item of menu.items) {
                    const b = document.createElement("button");
                    b.type = "button";
                    b.textContent = item.label;
                    b.addEventListener("click", (e) => {
                        e.stopPropagation();
                        pop.hidden = true;
                        item.run();
                    });
                    pop.appendChild(b);
                }
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const open = pop.hidden;
                    this.closePop();
                    pop.hidden = !open;
                    this.menuEl = pop;
                });
                btn.addEventListener("pointerenter", () => {
                    if (this.menuEl && !this.menuEl.hidden && this.menuEl !== pop) {
                        this.closePop();
                        pop.hidden = false;
                        this.menuEl = pop;
                    }
                });
                wrap.append(btn, pop);
                bar.appendChild(wrap);
            }
            const help = document.createElement("button");
            help.type = "button";
            help.className = "nl-menubtn";
            help.textContent = "Help";
            help.addEventListener("click", () => this.openHelp());
            bar.appendChild(help);
            const sideBtn = document.createElement("button");
            sideBtn.type = "button";
            sideBtn.className = "nl-menubtn nl-side-toggle";
            sideBtn.textContent = "Layers";
            sideBtn.addEventListener("click", () => this.side.classList.toggle("is-open"));
            bar.appendChild(sideBtn);
        }
        buildStatus(bar) {
            const toggles = [
                { id: "snap", label: "SNAP", key: "F9", get: () => this.snapOn, set: (v) => (this.snapOn = v) },
                { id: "grid", label: "GRID", key: "F7", get: () => this.grid, set: (v) => (this.grid = v) },
                { id: "ortho", label: "ORTHO", key: "F8", get: () => this.ortho, set: (v) => (this.ortho = v) },
                { id: "polar", label: "POLAR", key: "F10", get: () => this.polar, set: (v) => (this.polar = v) },
                { id: "osnap", label: "OSNAP", key: "F3", get: () => this.osnap, set: (v) => (this.osnap = v) },
                { id: "lwt", label: "LWT", key: "", get: () => this.lwt, set: (v) => (this.lwt = v) },
            ];
            for (const t of toggles) {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "nl-stat";
                b.dataset.toggle = t.id;
                b.textContent = t.label;
                b.title = t.key ? `${t.label} (${t.key})` : t.label;
                b.addEventListener("click", () => {
                    t.set(!t.get());
                    if (t.id === "ortho" && this.ortho)
                        this.polar = false;
                    if (t.id === "polar" && this.polar)
                        this.ortho = false;
                    this.savePrefs();
                    this.markToggles();
                    this.requestDraw();
                });
                bar.appendChild(b);
            }
            const unit = document.createElement("span");
            unit.className = "nl-unit";
            unit.textContent = "model";
            bar.appendChild(unit);
        }
        markToggles() {
            const map = {
                snap: this.snapOn,
                grid: this.grid,
                ortho: this.ortho,
                polar: this.polar,
                osnap: this.osnap,
                lwt: this.lwt,
            };
            for (const b of this.host.querySelectorAll(".nl-stat")) {
                b.classList.toggle("is-on", !!map[b.dataset.toggle || ""]);
            }
        }
        markTools() {
            for (const b of this.toolButtons)
                b.classList.toggle("is-on", b.dataset.cmd === this.activeName);
        }
        setTheme(name) {
            const root = this.host.querySelector(".nl");
            root.dataset.theme = name;
            this.savePrefs();
            this.requestDraw();
        }
        closePop() {
            for (const pop of this.host.querySelectorAll(".nl-pop"))
                pop.hidden = true;
            const help = this.host.querySelector(".nl-help");
            if (help && !help.hidden && this.menuEl === help) {
                /* leave help to its own close */
            }
        }
        openHelp() {
            let help = this.host.querySelector(".nl-help");
            if (!help) {
                help = document.createElement("div");
                help.className = "nl-help";
                help.innerHTML = `<div class="nl-help-card"><header><strong>Commands</strong><button type="button" class="nl-help-x">Close</button></header><div class="nl-help-body"></div></div>`;
                this.host.querySelector(".nl").appendChild(help);
                help.querySelector(".nl-help-x").addEventListener("click", () => (help.hidden = true));
            }
            const body = help.querySelector(".nl-help-body");
            body.innerHTML = "";
            for (const group of ["Draw", "Modify", "View", "Format", "Tools"]) {
                const h = document.createElement("h3");
                h.textContent = group;
                body.appendChild(h);
                const ul = document.createElement("ul");
                for (const c of commands_ts_1.COMMANDS.filter((x) => x.group === group)) {
                    const li = document.createElement("li");
                    li.innerHTML = `<kbd>${c.aliases[0] ?? c.name}</kbd> <b>${c.name}</b> <span>${c.hint}</span>`;
                    ul.appendChild(li);
                }
                body.appendChild(ul);
            }
            const keys = document.createElement("p");
            keys.className = "nl-muted";
            keys.textContent = "Enter and Space run a command. @x,y is relative, @dist<ang is polar. F3 osnap, F7 grid, F8 ortho, F9 snap, F10 polar. Esc cancels. Delete erases the selection.";
            body.appendChild(keys);
            help.hidden = false;
        }
        async newDrawing() {
            if (this.doc.ents.size && !(await this.confirm("Start a new drawing? The current one stays in the browser until you overwrite it.")))
                return;
            this.abortWait();
            this.token++;
            this.doc.ents.clear();
            this.doc.order = [];
            this.doc.blocks.clear();
            this.doc.layers = (0, entities_ts_1.defaultLayers)();
            this.doc.currentLayer = "0";
            this.doc.past = [];
            this.doc.future = [];
            this.doc.bump();
            this.selection.clear();
            this.fileName = "untitled.dxf";
            this.dirty = true;
            this.view.cx = 40;
            this.view.cy = 30;
            this.view.ppm = 6;
            this.syncChrome();
            this.persist();
            this.echo("New drawing.");
            this.prompt("Command:");
            this.requestDraw();
        }
        async openSample() {
            if (this.doc.ents.size && !(await this.confirm("Replace the drawing with the sample plate?")))
                return;
            this.abortWait();
            this.token++;
            (0, sample_ts_1.loadSample)(this.doc);
            this.selection.clear();
            this.fileName = "sample-plate.dxf";
            this.dirty = false;
            this.syncChrome();
            this.zoomExtents();
            this.persist();
            this.echo("Sample plate loaded.");
        }
        save() {
            (0, dxf_ts_1.downloadDxf)(this.doc, this.fileName);
            this.dirty = false;
            this.fileNameEl.textContent = this.fileName;
            this.echo(`Saved ${this.fileName}. Dimensions are stored as lines and text so other programs can read them.`);
            this.persist();
        }
        async openFile(file) {
            const text = await file.text();
            let read;
            try {
                read = (0, dxf_ts_1.readDxf)(text);
            }
            catch (err) {
                this.echo(`Could not read that DXF. ${err instanceof Error ? err.message : ""}`);
                return;
            }
            this.abortWait();
            this.token++;
            this.doc = read.doc;
            this.index = new doc_ts_1.Spatial();
            this.selection.clear();
            this.fileName = file.name;
            this.dirty = false;
            this.syncChrome();
            this.zoomExtents();
            this.persist();
            this.echo(`Opened ${file.name}. ${this.doc.ents.size} entities.`);
            if (read.warnings.length)
                this.echo(read.warnings.slice(0, 4).join(" · "));
            this.prompt("Command:");
        }
        confirm(message) {
            const root = this.host.querySelector(".nl");
            const modal = document.createElement("div");
            modal.className = "nl-modal";
            modal.innerHTML = `<div class="nl-dialog"><p></p><div><button type="button" data-no>Cancel</button><button type="button" data-yes>Continue</button></div></div>`;
            modal.querySelector("p").textContent = message;
            root.appendChild(modal);
            return new Promise((resolve) => {
                const done = (v) => {
                    modal.remove();
                    resolve(v);
                };
                modal.querySelector("[data-no]").addEventListener("click", () => done(false));
                modal.querySelector("[data-yes]").addEventListener("click", () => done(true));
            });
        }
        // —— input ——
        bind(root) {
            this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
            this.canvas.addEventListener("pointerdown", (e) => this.down(e));
            this.canvas.addEventListener("pointermove", (e) => this.move(e));
            this.canvas.addEventListener("pointerup", (e) => this.up(e));
            this.canvas.addEventListener("pointercancel", (e) => this.up(e));
            this.canvas.addEventListener("wheel", (e) => this.wheel(e), { passive: false });
            this.canvas.addEventListener("pointerleave", () => {
                this.cursor = null;
                this.snapCap.hidden = true;
                this.requestDraw();
            });
            this.input.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    e.preventDefault();
                    this.escape();
                    return;
                }
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (!this.typed.length)
                        return;
                    this.typedAt = Math.max(0, this.typedAt - 1);
                    this.input.value = this.typed[this.typedAt] ?? "";
                    return;
                }
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (!this.typed.length)
                        return;
                    this.typedAt = Math.min(this.typed.length, this.typedAt + 1);
                    this.input.value = this.typed[this.typedAt] ?? "";
                    return;
                }
                if (e.key === "Enter" || (e.key === " " && this.waiter?.mode !== "text")) {
                    e.preventDefault();
                    this.submitInput(this.input.value);
                }
            });
            root.querySelector(".nl-form").addEventListener("submit", (e) => {
                e.preventDefault();
                this.submitInput(this.input.value);
            });
            this.layerSelect.addEventListener("change", () => {
                this.doc.currentLayer = this.layerSelect.value;
                this.doc.bump();
                this.syncChrome();
                this.layerSelect.blur();
                if (!window.matchMedia("(pointer: coarse)").matches)
                    this.input.focus();
            });
            root.querySelector(".nl-file").addEventListener("change", (e) => {
                const input = e.target;
                const file = input.files?.[0];
                input.value = "";
                if (file)
                    void this.openFile(file);
            });
        }
        key(e) {
            const target = e.target;
            const typingElsewhere = target instanceof HTMLInputElement && target !== this.input || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement && target !== this.layerSelect;
            if (e.key === "Escape") {
                if (typingElsewhere)
                    return;
                e.preventDefault();
                this.escape();
                return;
            }
            if (typingElsewhere)
                return;
            if (e.key === "F3" || e.key === "F7" || e.key === "F8" || e.key === "F9" || e.key === "F10") {
                e.preventDefault();
                if (e.key === "F3")
                    this.osnap = !this.osnap;
                if (e.key === "F7")
                    this.grid = !this.grid;
                if (e.key === "F8") {
                    this.ortho = !this.ortho;
                    if (this.ortho)
                        this.polar = false;
                }
                if (e.key === "F9")
                    this.snapOn = !this.snapOn;
                if (e.key === "F10") {
                    this.polar = !this.polar;
                    if (this.polar)
                        this.ortho = false;
                }
                this.savePrefs();
                this.markToggles();
                this.requestDraw();
                return;
            }
            if ((e.key === "z" || e.key === "Z") && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (e.shiftKey)
                    this.redo();
                else
                    this.undo();
                return;
            }
            if ((e.key === "y" || e.key === "Y") && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.redo();
                return;
            }
            if ((e.key === "s" || e.key === "S") && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.save();
                return;
            }
            if ((e.key === "a" || e.key === "A") && (e.ctrlKey || e.metaKey) && !this.waiter) {
                e.preventDefault();
                this.selectAll();
                return;
            }
            if (target !== this.input && !e.ctrlKey && !e.metaKey && !e.altKey && !this.host.querySelector(".nl-modal")) {
                const onButton = target instanceof HTMLButtonElement;
                if (e.key.length === 1 && !(e.key === " " && onButton)) {
                    e.preventDefault();
                    this.input.focus();
                    if (e.key === " " && this.waiter?.mode !== "text")
                        this.submitInput(this.input.value);
                    else
                        this.input.value += e.key;
                    return;
                }
                if (e.key === "Enter" && !onButton) {
                    e.preventDefault();
                    this.input.focus();
                    this.submitInput(this.input.value);
                    return;
                }
                if (e.key === "Backspace" && this.input.value) {
                    e.preventDefault();
                    this.input.focus();
                    this.input.value = this.input.value.slice(0, -1);
                    return;
                }
            }
            if ((e.key === "Delete" || e.key === "Backspace") && !this.waiter && target !== this.input) {
                const ents = this.editable(this.selectionEnts());
                if (!ents.length)
                    return;
                e.preventDefault();
                this.transact(() => ents.forEach((en) => this.doc.remove(en.id)));
                this.selection.clear();
                this.refreshGrips();
            }
        }
        escape() {
            const help = this.host.querySelector(".nl-help");
            if (help && !help.hidden) {
                help.hidden = true;
                return;
            }
            if (this.gripDrag) {
                this.gripDrag = null;
                this.previewEnts = [];
                this.requestDraw();
                return;
            }
            if (this.waiter) {
                this.token++;
                this.abortWait();
                this.activeName = null;
                this.previewEnts = [];
                this.rubber = null;
                this.prompt("Command:");
                this.echo("*Cancel*");
                this.markTools();
                this.refreshGrips();
                this.requestDraw();
                return;
            }
            if (this.selection.size) {
                this.selection.clear();
                this.refreshGrips();
                this.syncProps();
                this.requestDraw();
            }
        }
        down(e) {
            this.canvas.setPointerCapture(e.pointerId);
            const s = this.screenOf(e);
            this.pointers.set(e.pointerId, s);
            if (this.pointers.size === 2) {
                const [a, b] = [...this.pointers.values()];
                const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
                this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, ppm: this.view.ppm, world: (0, render_ts_1.s2w)(this.view, mid) };
                this.drag = null;
                return;
            }
            if (e.button === 1 || (this.waiter?.mode === "pan" && e.button === 0)) {
                this.pushView();
                this.pan = { x: e.clientX, y: e.clientY, cx: this.view.cx, cy: this.view.cy };
                this.canvas.classList.add("is-pan");
                return;
            }
            if (e.button === 2) {
                this.submitInput("");
                return;
            }
            if (e.button !== 0)
                return;
            this.moveCursor(s);
            if (this.waiter?.mode === "point") {
                if (this.cursor) {
                    this.last = this.cursor;
                    this.consumed.add(e.pointerId);
                    this.settle({ t: "point", p: this.cursor });
                }
                return;
            }
            if (this.waiter?.mode === "pick") {
                const tol = 10 / this.view.ppm;
                const ent = this.cursor ? (0, snaps_ts_1.entityUnder)(this.doc, this.index, (0, render_ts_1.s2w)(this.view, s), tol, (en) => (0, entities_ts_1.visibleEnt)(en, this.doc.layers) && this.canSelect(en)) : null;
                if (!ent) {
                    this.echo("Nothing there.");
                    return;
                }
                this.consumed.add(e.pointerId);
                this.settle({ t: "ent", ent, at: (0, render_ts_1.s2w)(this.view, s) });
                return;
            }
            if (this.waiter && this.waiter.mode !== "select")
                return;
            const grip = !this.waiter ? this.gripHit(s) : null;
            if (grip && this.cursor) {
                const ent = this.doc.get(grip.entId);
                if (ent) {
                    this.gripDrag = { grip, ent: (0, entities_ts_1.cloneEnt)(ent) };
                    return;
                }
            }
            this.drag = { sx: s.x, sy: s.y, world: (0, render_ts_1.s2w)(this.view, s), moved: false, shift: e.shiftKey };
        }
        move(e) {
            const s = this.screenOf(e);
            this.pointers.set(e.pointerId, s);
            if (this.pinch && this.pointers.size >= 2) {
                const pts = [...this.pointers.values()];
                const a = pts[0];
                const b = pts[1];
                const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
                const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
                this.view.ppm = Math.min(8000, Math.max(0.002, this.pinch.ppm * (d / this.pinch.d)));
                this.view.cx = this.pinch.world.x - (mid.x - this.view.w / 2) / this.view.ppm;
                this.view.cy = this.pinch.world.y + (mid.y - this.view.h / 2) / this.view.ppm;
                this.requestDraw();
                return;
            }
            if (this.pan) {
                this.view.cx = this.pan.cx - (e.clientX - this.pan.x) / this.view.ppm;
                this.view.cy = this.pan.cy + (e.clientY - this.pan.y) / this.view.ppm;
                this.requestDraw();
                return;
            }
            if (this.drag && Math.hypot(s.x - this.drag.sx, s.y - this.drag.sy) > 4)
                this.drag.moved = true;
            this.moveCursor(s);
        }
        up(e) {
            this.pointers.delete(e.pointerId);
            if (this.pointers.size < 2)
                this.pinch = null;
            if (this.consumed.has(e.pointerId)) {
                this.consumed.delete(e.pointerId);
                return;
            }
            if (this.pan && (e.button === 1 || this.waiter?.mode === "pan")) {
                this.pan = null;
                this.canvas.classList.remove("is-pan");
                return;
            }
            if (this.gripDrag && e.button === 0 && this.cursor) {
                const grip = this.gripDrag.grip;
                const ent = this.doc.get(grip.entId);
                const to = this.cursor;
                this.gripDrag = null;
                this.previewEnts = [];
                if (ent) {
                    this.transact(() => this.doc.replace((0, entities_ts_1.applyGrip)(ent, grip, to)));
                    this.last = to;
                }
                this.refreshGrips();
                return;
            }
            if (!this.drag || e.button !== 0)
                return;
            const drag = this.drag;
            this.drag = null;
            this.rubber = null;
            const selecting = !this.waiter || this.waiter.mode === "select";
            if (!selecting) {
                this.requestDraw();
                return;
            }
            const world = this.cursor ?? (0, render_ts_1.s2w)(this.view, this.screenOf(e));
            let ids = [];
            if (drag.moved) {
                const box = (0, math_ts_1.boxFromCorners)(drag.world, world);
                const crossing = world.x < drag.world.x;
                ids = this.index
                    .query(this.doc, box)
                    .filter((en) => this.canSelect(en) && (0, entities_ts_1.hitsRect)(en, box, this.doc.ctx(), crossing ? "crossing" : "window"))
                    .map((en) => en.id);
            }
            else {
                const tol = 8 / this.view.ppm;
                const ent = (0, snaps_ts_1.entityUnder)(this.doc, this.index, world, tol, (en) => this.canSelect(en));
                if (ent)
                    ids = [ent.id];
            }
            if (this.waiter?.mode === "select" && this.waiter.picked) {
                const set = this.waiter.picked;
                if (e.shiftKey || drag.shift)
                    for (const id of ids)
                        if (set.has(id))
                            set.delete(id);
                        else
                            set.add(id);
                else
                    for (const id of ids)
                        set.add(id);
                this.selection = new Set(set);
                if (ids.length)
                    this.echo(`${set.size} selected, ${ids.length} found`);
                this.refreshGrips();
                this.requestDraw();
                return;
            }
            if (e.shiftKey || drag.shift) {
                for (const id of ids)
                    if (this.selection.has(id))
                        this.selection.delete(id);
                    else
                        this.selection.add(id);
            }
            else if (drag.moved || ids.length)
                this.selection = new Set(ids);
            else
                this.selection.clear();
            this.refreshGrips();
            this.syncProps();
            this.requestDraw();
        }
        wheel(e) {
            e.preventDefault();
            if (!this.wheelTimer)
                this.pushView();
            window.clearTimeout(this.wheelTimer);
            this.wheelTimer = window.setTimeout(() => {
                this.wheelTimer = 0;
            }, 250);
            const rect = this.canvas.getBoundingClientRect();
            const screen = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * this.view.h : e.deltaY;
            (0, render_ts_1.zoomAt)(this.view, screen, Math.exp(-dy * 0.0014));
            this.moveCursor(screen);
        }
        gripHit(screen) {
            for (let i = this.grips.length - 1; i >= 0; i--) {
                const g = this.grips[i];
                const s = (0, render_ts_1.w2s)(this.view, g.p);
                if (Math.hypot(s.x - screen.x, s.y - screen.y) <= 8)
                    return g;
            }
            return null;
        }
    }
    function normPt(p, origin) {
        return (0, math_ts_1.norm)((0, math_ts_1.mul)({ x: p.x - origin.x, y: p.y - origin.y }, 1));
    }
    function round4(n) {
        return Math.round(n * 1e4) / 1e4;
    }
    function same(values) {
        if (!values.length)
            return null;
        return values.every((v) => v === values[0]) ? values[0] : null;
    }
    function parsePoint(raw, last) {
        let s = raw.trim();
        if (!s)
            return null;
        let abs = true;
        if (s.startsWith("@")) {
            abs = false;
            s = s.slice(1);
        }
        else if (s.startsWith("#"))
            s = s.slice(1);
        if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s))
            return null;
        const polar = s.split("<");
        if (polar.length === 2) {
            const d = Number(polar[0]);
            const a = (Number(polar[1]) * Math.PI) / 180;
            if (!Number.isFinite(d) || !Number.isFinite(a))
                return "bad";
            const v = { x: Math.cos(a) * d, y: Math.sin(a) * d };
            if (!abs) {
                if (!last)
                    return "bad";
                return { x: last.x + v.x, y: last.y + v.y };
            }
            return v;
        }
        const parts = s.split(/[, ]+/).filter(Boolean);
        if (parts.length !== 2)
            return "bad";
        const x = Number(parts[0]);
        const y = Number(parts[1]);
        if (!Number.isFinite(x) || !Number.isFinite(y))
            return "bad";
        if (!abs) {
            if (!last)
                return "bad";
            return { x: last.x + x, y: last.y + y };
        }
        return { x, y };
    }
    const SHELL = `
    <div class="nl" data-theme="ink">
      <header class="nl-top">
        <div class="nl-brand"><span class="nl-mark"></span><div><strong>Northline</strong><em class="nl-filename">untitled.dxf</em></div></div>
        <nav class="nl-menus"></nav>
        <label class="nl-layerpick">Layer <select class="nl-layerselect" aria-label="Current layer"></select></label>
      </header>
      <div class="nl-body">
        <nav class="nl-tools" aria-label="Draw and modify"></nav>
        <div class="nl-stage">
          <canvas class="nl-canvas"></canvas>
          <div class="nl-snapcap" hidden></div>
        </div>
        <aside class="nl-side">
          <div class="nl-layers"></div>
          <div class="nl-props"></div>
        </aside>
      </div>
      <section class="nl-cmd" aria-label="Command line">
        <div class="nl-log"></div>
        <form class="nl-form">
          <span class="nl-prompt">Command:</span>
          <input class="nl-input" aria-label="Command" autocomplete="off" spellcheck="false" />
        </form>
      </section>
      <footer class="nl-status">
        <span class="nl-coord">0.0000, 0.0000</span>
      </footer>
      <input class="nl-file" type="file" accept=".dxf,application/dxf" hidden />
    </div>`;

  };


  var app = req("./app.ts");
  var selfcheck = req("./selfcheck.ts");
  var api = {
    mount: app.mountNorthline,
    runSelfCheck: selfcheck.runSelfCheck
  };
  root.Northline = api;
  if (typeof document !== "undefined") {
    var host = document.getElementById("cad-root");
    if (host) api.mount(host);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
