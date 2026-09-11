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
import { MOCK_START_BALANCE } from "@/lib/brokers";
import { useAppStore } from "@/lib/store";
import { DEFAULT_PAPER_ACCOUNT, type PaperAccountSettings } from "@/types";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

const LEVERAGE_OPTS = [1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100, 125];

function LeverageSelect({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <SettingsFieldStack label={label}>
      <SettingsSelectWrap>
        <select
          className={`${settingsUi.select} w-full ${disabled ? "opacity-45" : ""}`}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {LEVERAGE_OPTS.map((n) => (
            <option key={n} value={n}>
              {n}x
            </option>
          ))}
        </select>
      </SettingsSelectWrap>
    </SettingsFieldStack>
  );
}

export function AccountSettingsModal() {
  const open = useAppStore((s) => s.accountSettingsOpen);
  const setOpen = useAppStore((s) => s.setAccountSettingsOpen);
  const balance = useAppStore((s) => s.mockBalance);
  const paper = useAppStore((s) => s.paperAccount);
  const setMockBalance = useAppStore((s) => s.setMockBalance);
  const setPaperAccount = useAppStore((s) => s.setPaperAccount);
  const resetPaperAccount = useAppStore((s) => s.resetPaperAccount);
  const patchChartSettings = useAppStore((s) => s.patchChartSettings);
  const addBalanceHistory = useAppStore((s) => s.addBalanceHistory);

  const [draftBalance, setDraftBalance] = useState(String(balance));
  const [draft, setDraft] = useState<PaperAccountSettings>(paper);

  useEffect(() => {
    if (!open) return;
    setDraftBalance(String(balance));
    setDraft({
      ...paper,
      leverage: { ...paper.leverage },
    });
  }, [open, balance, paper]);

  if (!open) return null;

  const setLev = (key: keyof PaperAccountSettings["leverage"], value: number) => {
    setDraft((d) => ({
      ...d,
      leverage: { ...d.leverage, [key]: value },
    }));
  };

  const save = () => {
    const nextBal = Number(String(draftBalance).replace(/,/g, ""));
    if (Number.isFinite(nextBal) && nextBal >= 0) {
      const prev = useAppStore.getState().mockBalance;
      setMockBalance(nextBal);
      if (nextBal !== prev) {
        addBalanceHistory({
          time: Date.now(),
          type: nextBal > prev ? "deposit" : "withdrawal",
          amount: Math.abs(nextBal - prev),
          balanceAfter: nextBal,
          note: "Account settings",
        });
      }
    }
    setPaperAccount(draft);
    patchChartSettings({ defaultLeverage: draft.leverage.crypto });
    setOpen(false);
  };

  const reset = () => {
    resetPaperAccount();
    addBalanceHistory({
      time: Date.now(),
      type: "deposit",
      amount: MOCK_START_BALANCE,
      balanceAfter: MOCK_START_BALANCE,
      note: "Account reset",
    });
    setDraftBalance(String(MOCK_START_BALANCE));
    setDraft({
      ...DEFAULT_PAPER_ACCOUNT,
      leverage: { ...DEFAULT_PAPER_ACCOUNT.leverage },
    });
  };

  return (
    <SettingsOverlay onClose={() => setOpen(false)}>
      <SettingsPanel width={440}>
        <SettingsHeader title="Account settings" onClose={() => setOpen(false)} />
        <SettingsBody>
          <SettingsFieldStack label="Balance">
            <input
              className={`${settingsUi.input} w-full`}
              value={draftBalance}
              onChange={(e) => setDraftBalance(e.target.value)}
              inputMode="decimal"
            />
          </SettingsFieldStack>

          <div className="mt-6">
            <SettingsSection title="LEVERAGE" hint>
              <SettingsCheck
                label="Margin control"
                checked={draft.marginControl}
                onChange={(marginControl) => setDraft((d) => ({ ...d, marginControl }))}
                extra={<Info size={13} className="text-[#4c525e]" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <LeverageSelect
                  label="Stocks"
                  value={draft.leverage.stocks}
                  disabled={!draft.marginControl}
                  onChange={(v) => setLev("stocks", v)}
                />
                <LeverageSelect
                  label="Futures"
                  value={draft.leverage.futures}
                  disabled={!draft.marginControl}
                  onChange={(v) => setLev("futures", v)}
                />
                <LeverageSelect
                  label="Crypto"
                  value={draft.leverage.crypto}
                  disabled={!draft.marginControl}
                  onChange={(v) => setLev("crypto", v)}
                />
                <div className="col-span-2 mx-auto w-[calc(50%-6px)]">
                  <LeverageSelect
                    label="Others"
                    value={draft.leverage.others}
                    disabled={!draft.marginControl}
                    onChange={(v) => setLev("others", v)}
                  />
                </div>
              </div>
            </SettingsSection>
          </div>

          <SettingsSection title="COMMISSION">
            <SettingsCheck
              label="Futures and options"
              checked={draft.futuresCommissionOn}
              onChange={(futuresCommissionOn) =>
                setDraft((d) => ({ ...d, futuresCommissionOn }))
              }
            />
            <div className="pl-6">
              <SettingsFieldStack label="Commission per contract" hint>
                <input
                  className={`${settingsUi.input} w-full`}
                  value={draft.commissionPerContract}
                  disabled={!draft.futuresCommissionOn}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      commissionPerContract: Number(e.target.value) || 0,
                    }))
                  }
                />
              </SettingsFieldStack>
            </div>
            <SettingsCheck
              label="Others"
              checked={draft.othersCommissionOn}
              onChange={(othersCommissionOn) =>
                setDraft((d) => ({ ...d, othersCommissionOn }))
              }
            />
            <div className="grid grid-cols-2 gap-3 pl-6">
              <SettingsFieldStack label="Commission">
                <input
                  className={`${settingsUi.input} w-full`}
                  value={draft.othersCommission}
                  disabled={!draft.othersCommissionOn}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      othersCommission: Number(e.target.value) || 0,
                    }))
                  }
                />
              </SettingsFieldStack>
              <SettingsFieldStack label="Commission type">
                <SettingsSelectWrap>
                  <select
                    className={`${settingsUi.select} w-full`}
                    value={draft.othersCommissionType}
                    disabled={!draft.othersCommissionOn}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        othersCommissionType: e.target.value as "fixed" | "percent",
                      }))
                    }
                  >
                    <option value="fixed">Fixed</option>
                    <option value="percent">Percent</option>
                  </select>
                </SettingsSelectWrap>
              </SettingsFieldStack>
            </div>
          </SettingsSection>
        </SettingsBody>
        <SettingsFooter left={<SettingsBtn variant="ghost" onClick={reset}>Reset account</SettingsBtn>}>
          <SettingsBtn variant="primary" onClick={save}>
            Save
          </SettingsBtn>
        </SettingsFooter>
      </SettingsPanel>
    </SettingsOverlay>
  );
}
