/**
 * Jest manual mock for @luxalgo/vela.
 * Returns a stub Vela class so component tests never touch the real chart DOM.
 */

const mockDrawings = {
  supported: false,
  setTool: jest.fn(),
  getTool: jest.fn(() => null),
  setSnapMode: jest.fn(),
  getSnapMode: jest.fn(() => "off"),
  setStayMode: jest.fn(),
  getStayMode: jest.fn(() => false),
  setMode: jest.fn(),
  getMode: jest.fn(() => null),
  showToolbar: jest.fn(),
  setToolbar: jest.fn(),
  setToolShortcuts: jest.fn(),
  setExternalGhost: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeAll: jest.fn(),
  select: jest.fn(),
  getSelected: jest.fn(() => null),
  all: jest.fn(() => []),
  toJSON: jest.fn(() => ({ drawings: [] })),
  fromJSON: jest.fn(),
  undo: jest.fn(),
  redo: jest.fn(),
  canUndo: jest.fn(() => false),
  canRedo: jest.fn(() => false),
  clone: jest.fn(),
  duplicate: jest.fn(),
  copyToClipboard: jest.fn(),
  paste: jest.fn(),
  lock: jest.fn(),
  show: jest.fn(),
  updateMany: jest.fn(),
  removeMany: jest.fn(),
  openSettings: jest.fn(),
  bringToFront: jest.fn(),
  sendToBack: jest.fn(),
  favorites: jest.fn(() => []),
  isFavorite: jest.fn(() => false),
  setFavorite: jest.fn(),
  setFavorites: jest.fn(),
};

const mockMarks = {
  add: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  remove: jest.fn().mockReturnThis(),
  clear: jest.fn().mockReturnThis(),
  all: jest.fn(() => []),
  defineGroup: jest.fn().mockReturnThis(),
  groups: jest.fn(() => []),
  setGroupVisible: jest.fn().mockReturnThis(),
  isGroupVisible: jest.fn(() => true),
  supported: true,
};

const mockReplay = {
  start: jest.fn(() => Promise.resolve()),
  step: jest.fn(() => false),
  stepUpdate: jest.fn(() => false),
  play: jest.fn().mockReturnThis(),
  pause: jest.fn().mockReturnThis(),
  stop: jest.fn().mockReturnThis(),
  setTicks: jest.fn().mockReturnThis(),
  state: { active: false, playing: false, cursorTime: null, remaining: 0, nextTime: null, intervalMs: 1000 },
  bounds: null,
};

const mockData = {
  registerProvider: jest.fn().mockReturnThis(),
  unregisterProvider: jest.fn().mockReturnThis(),
  providers: jest.fn(() => []),
  resolve: jest.fn(() => null),
  symbols: jest.fn(() => []),
  symbolInfo: jest.fn(() => Promise.resolve(undefined)),
  displayPrefix: jest.fn(() => null),
  canonicalSymbol: jest.fn(() => null),
  providerInstance: jest.fn(() => undefined),
  symbolIcon: jest.fn(() => undefined),
};

const mockRenderer = {
  set: jest.fn().mockReturnThis(),
  get: jest.fn(() => ({})),
  setSettingsVisibility: jest.fn(),
};

class MockVela {
  drawings = mockDrawings;
  marks = mockMarks;
  replay = mockReplay;
  data = mockData;
  renderer = mockRenderer;

  registerEngine = jest.fn().mockReturnThis();
  addIndicator = jest.fn(() => ({ id: "mock-indicator", remove: jest.fn() }));
  runIndicator = jest.fn(() => Promise.resolve({ ok: true, handle: null, error: null, context: null }));
  addNativeIndicator = jest.fn(() => ({ id: "mock-native", remove: jest.fn() }));
  on = jest.fn(() => () => undefined);
  off = jest.fn(() => () => undefined);
  ready = jest.fn(() => Promise.resolve());
  destroy = jest.fn();
}

module.exports = {
  Vela: MockVela,
  NativeRenderer: jest.fn(),
  MultiProviderFeed: jest.fn(() => ({ registerProvider: jest.fn() })),
  CachingDataFeed: jest.fn(),
  BarStore: jest.fn(),
  sharedBarStore: {},
  timeframeToMs: jest.fn(() => 60000),
  DataControl: jest.fn(),
  DrawingsControl: jest.fn(),
  MarksControl: jest.fn(),
  ReplayControl: jest.fn(),
  DrawingToolbar: jest.fn(() => ({
    setVisible: jest.fn(),
    setDefinition: jest.fn(),
    setTheme: jest.fn(),
    setActiveTool: jest.fn(),
    setMagnetMode: jest.fn(),
    setStayMode: jest.fn(),
    setMeasureActive: jest.fn(),
    setEraserActive: jest.fn(),
    destroy: jest.fn(),
  })),
  DARK_THEME: {},
  LIGHT_THEME: {},
  resolveTheme: jest.fn((t) => t ?? "dark"),
  TypedEventBus: jest.fn(),
  registerNativeIndicator: jest.fn(),
  unregisterNativeIndicator: jest.fn(),
  getNativeIndicator: jest.fn(),
  nativeIndicatorTypes: [],
  nativeIndicatorDescriptors: [],
  stableSeriesId: jest.fn(({ instanceId, kind, title, ordinal }) => `${instanceId}:${kind}:${title}#${ordinal}`),
};
