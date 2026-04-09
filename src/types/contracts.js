// @ts-check

/**
 * @typedef {Object} RenalRecommendation
 * @property {number} g
 * @property {string} r
 */

/**
 * @typedef {Object} InfusionPreset
 * @property {string} l
 * @property {number | null} v
 */

/**
 * @typedef {Object} TargetLine
 * @property {number} lo
 * @property {number} hi
 */

/**
 * @typedef {Object} Drug
 * @property {string} l
 * @property {string} cat
 * @property {number} dose
 * @property {number} int
 * @property {number} inf
 * @property {number} mic
 * @property {number} vdkg
 * @property {number} hl
 * @property {number} fr
 * @property {number} pb
 * @property {string} pk
 * @property {string} tgt
 * @property {'tmic' | 'auc' | 'cmax' | 'trough'} tt
 * @property {string} col
 * @property {number} dMin
 * @property {number} dMax
 * @property {number} dStep
 * @property {number[]} ints
 * @property {number[]} doses
 * @property {InfusionPreset[]} infP
 * @property {string} std
 * @property {RenalRecommendation[]} ren
 * @property {string} info
 * @property {string=} warn
 * @property {number=} mgkg
 * @property {number=} defLd
 * @property {number=} defLdInt
 * @property {TargetLine | null=} tl
 */

/**
 * @typedef {Object} ScenarioPatch
 * @property {number=} dose
 * @property {number=} int
 * @property {number=} inf
 * @property {number=} mic
 * @property {number=} gfr
 * @property {number=} wt
 * @property {number=} ld
 * @property {number=} ldc
 * @property {number=} ldi
 */

/**
 * @typedef {Object} Scenario
 * @property {string} l
 * @property {string} d
 * @property {ScenarioPatch} p
 * @property {string} desc
 */

/**
 * @typedef {Object} UIState
 * @property {string} sel
 * @property {number} dose
 * @property {number} int
 * @property {number} inf
 * @property {number} mic
 * @property {number} gfr
 * @property {number} wt
 * @property {number} ld
 * @property {number} ldc
 * @property {number} ldi
 * @property {boolean} ldOpen
 */

/**
 * @typedef {Object} SimulationPoint
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} ScheduleEntry
 * @property {number} t
 * @property {number} d
 */

/**
 * @typedef {Object} SimulationResult
 * @property {SimulationPoint[]} pts
 * @property {SimulationPoint[]} fpts
 * @property {number} cmax
 * @property {number} cmin
 * @property {number} pctMIC
 * @property {number} auc24
 * @property {number} aucMic
 * @property {number} adjHL
 * @property {number} totalH
 * @property {number} cmaxMic
 * @property {number} intH
 * @property {number} ssStart
 * @property {ScheduleEntry[]} schedule
 */

/**
 * @typedef {Object} AlertViewModel
 * @property {'warn' | 'danger' | 'ok'} level
 * @property {string[]} sections
 */

/**
 * @typedef {Object} PkInfoCell
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {Object} PkInfoViewModel
 * @property {string} title
 * @property {PkInfoCell[]} cells
 * @property {string} target
 * @property {string} reference
 * @property {string | undefined} warning
 */

/**
 * @typedef {Object} ThemeTokens
 * @property {'dark' | 'light'} theme
 * @property {string} themeColor
 * @property {string} axisColor
 * @property {string} gridColor
 * @property {string} borderColor
 * @property {string} tooltipBackground
 * @property {string} tooltipTitle
 * @property {string} tooltipBody
 * @property {string} tooltipBorder
 * @property {string} narrativeSurface
 * @property {string} warningSurface
 * @property {string} warningOutline
 * @property {string} warningText
 * @property {string} success
 * @property {string} warning
 * @property {string} error
 */

export {};
