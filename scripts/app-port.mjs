/**
 * The ONE port MAWS is allowed to serve on — dev, supervisor and the standalone
 * production server all answer here, and nothing may override it.
 *
 * Why it is a constant and not configurable: the browser keys `localStorage` by
 * ORIGIN, and the whole workspace lives there (layout, chart + app settings,
 * templates, drawings, watchlist, paper account). A launcher that passes
 * `PORT=0` (or any other port) used to make the app bind a different port each
 * run, which is a different origin — so every start came up with empty storage
 * and looked like nothing had been saved. 3000 is the address the app is opened
 * on, so it is the address the state is stored under.
 */

export const APP_PORT = 3000;
