"use client";

import {
  SettingsBody,
  SettingsBtn,
  SettingsCheck,
  SettingsFieldStack,
  SettingsFooter,
  SettingsHeader,
  SettingsOverlay,
  SettingsPanel,
  SettingsSection,
  SettingsSelectWrap,
  settingsUi,
} from "@/components/settings/settings-ui";
import { resolveSymbolTrading } from "@/lib/trading/symbol-settings";
import { useAppStore } from "@/lib/store";
import { DEFAULT_SYMBOL_TRADING, type SymbolTradingSettings } from "@/types";
import { useEffect, useState } from "react";

const LEVERAGE_OPTS = [1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100, 125];

type NumTexts = {
  margin: string;
  marginPercent: string;
  tpPercent: string;
  slPercent: string;
};

function textsFromSettings(t: SymbolTradingSettings): NumTexts {
  return {
    margin: String(t.margin),
    marginPercent: String(t.marginPercent),
    tpPercent: String(t.tpPercent),
    slPercent: String(t.slPercent),
  };
}

/** Allow empty / partial numeric typing (e.g. "", ".", "1.", "0.5"). */
function isNumericDraft(raw: string) {
  return raw === "" || raw === "." || raw === "-" || /^-?\d*\.?\d*$/.test(raw);
}

function parsePositive(raw: string, fallback: number, min = 0.01) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, n);
}

function parseNonNeg(raw: string, fallback: number) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, n);
}

export function TradingSettingsModal() {
  const symbol = useAppStore((s) => s.tradingSettingsSymbol);
  const setSymbol = useAppStore((s) => s.setTradingSettingsSymbol);
  const setSymbolTrading = useAppStore((s) => s.setSymbolTrading);
  const [draft, setDraft] = useState<SymbolTradingSettings>(DEFAULT_SYMBOL_TRADING);
  const [texts, setTexts] = useState<NumTexts>(() => textsFromSettings(DEFAULT_SYMBOL_TRADING));

  useEffect(() => {
    if (!symbol) return;
    const next = resolveSymbolTrading(symbol);
    setDraft(next);
    setTexts(textsFromSettings(next));
  }, [symbol]);

  if (!symbol) return null;

  const isPercent = draft.sizingMode === "percent";
  const marginText = isPercent ? texts.marginPercent : texts.margin;

  const setSizingMode = (sizingMode: SymbolTradingSettings["sizingMode"]) => {
    setDraft((d) => ({ ...d, sizingMode }));
  };

  const setMarginUsed = (raw: string) => {
    if (!isNumericDraft(raw)) return;
    setTexts((t) =>
      isPercent ? { ...t, marginPercent: raw } : { ...t, margin: raw },
    );
  };

  const setTp = (raw: string) => {
    if (!isNumericDraft(raw)) return;
    setTexts((t) => ({ ...t, tpPercent: raw }));
  };

  const setSl = (raw: string) => {
    if (!isNumericDraft(raw)) return;
    setTexts((t) => ({ ...t, slPercent: raw }));
  };

  const save = () => {
    setSymbolTrading(symbol, {
      ...draft,
      margin: parsePositive(texts.margin, DEFAULT_SYMBOL_TRADING.margin),
      marginPercent: parsePositive(texts.marginPercent, DEFAULT_SYMBOL_TRADING.marginPercent),
      leverage: Math.max(1, Number(draft.leverage) || DEFAULT_SYMBOL_TRADING.leverage),
      tpPercent: parseNonNeg(texts.tpPercent, DEFAULT_SYMBOL_TRADING.tpPercent),
      slPercent: parseNonNeg(texts.slPercent, DEFAULT_SYMBOL_TRADING.slPercent),
    });
    setSymbol(null);
  };

  const reset = () => {
    const next = {
      ...DEFAULT_SYMBOL_TRADING,
      leverage: useAppStore.getState().chartSettings.defaultLeverage,
    };
    setDraft(next);
    setTexts(textsFromSettings(next));
  };

  return (
    <SettingsOverlay onClose={() => setSymbol(null)}>
      <SettingsPanel width={420}>
        <SettingsHeader title={`Trading settings · ${symbol}`} onClose={() => setSymbol(null)} />
        <SettingsBody>
          <SettingsSection title="POSITION SIZING">
            <SettingsFieldStack label="Default order type">
              <SettingsSelectWrap>
                <select
                  className={`${settingsUi.select} w-full`}
                  value={draft.defaultOrderType}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      defaultOrderType: e.target
                        .value as SymbolTradingSettings["defaultOrderType"],
                    }))
                  }
                >
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                </select>
              </SettingsSelectWrap>
            </SettingsFieldStack>
            <SettingsFieldStack label="Sizing mode">
              <SettingsSelectWrap>
                <select
                  className={`${settingsUi.select} w-full`}
                  value={draft.sizingMode}
                  onChange={(e) =>
                    setSizingMode(e.target.value as SymbolTradingSettings["sizingMode"])
                  }
                >
                  <option value="fixed">Fixed margin</option>
                  <option value="percent">% of equity</option>
                </select>
              </SettingsSelectWrap>
            </SettingsFieldStack>
            <SettingsFieldStack label="Margin used">
              <div className="relative">
                <input
                  className={`${settingsUi.input} w-full ${isPercent ? "pr-8" : ""}`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  value={marginText}
                  onChange={(e) => setMarginUsed(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                />
                {isPercent ? (
                  <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[13px] text-[#787b86]">
                    %
                  </span>
                ) : null}
              </div>
            </SettingsFieldStack>
          </SettingsSection>

          <SettingsSection title="TRADE MANAGEMENT">
            <SettingsFieldStack label={`Default leverage (${symbol})`}>
              <SettingsSelectWrap>
                <select
                  className={`${settingsUi.select} w-full`}
                  value={draft.leverage}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, leverage: Number(e.target.value) }))
                  }
                >
                  {LEVERAGE_OPTS.map((n) => (
                    <option key={n} value={n}>
                      {n}x
                    </option>
                  ))}
                </select>
              </SettingsSelectWrap>
            </SettingsFieldStack>
            <SettingsCheck
              label="Attach take profit / stop loss"
              checked={draft.attachBrackets}
              onChange={(attachBrackets) => setDraft((d) => ({ ...d, attachBrackets }))}
            />
            <div className="grid grid-cols-2 gap-3 pl-1">
              <SettingsFieldStack label="Take profit (%)">
                <input
                  className={`${settingsUi.input} w-full`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={!draft.attachBrackets}
                  value={texts.tpPercent}
                  onChange={(e) => setTp(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                />
              </SettingsFieldStack>
              <SettingsFieldStack label="Stop loss (%)">
                <input
                  className={`${settingsUi.input} w-full`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={!draft.attachBrackets}
                  value={texts.slPercent}
                  onChange={(e) => setSl(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                />
              </SettingsFieldStack>
            </div>
            <SettingsCheck
              label="Confirm before sending orders"
              checked={draft.confirmOrders}
              onChange={(confirmOrders) => setDraft((d) => ({ ...d, confirmOrders }))}
            />
          </SettingsSection>
        </SettingsBody>
        <SettingsFooter
          left={
            <SettingsBtn variant="ghost" onClick={reset}>
              Reset
            </SettingsBtn>
          }
        >
          <SettingsBtn onClick={() => setSymbol(null)}>Cancel</SettingsBtn>
          <SettingsBtn variant="primary" onClick={save}>
            Save
          </SettingsBtn>
        </SettingsFooter>
      </SettingsPanel>
    </SettingsOverlay>
  );
}
