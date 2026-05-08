"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ConsentState = {
  terms: boolean;
  data: boolean;
  kvkk: boolean;
  marketing: boolean;
};

type Props = {
  onValid: (valid: boolean, state: ConsentState) => void;
};

export function ConsentCheckboxes({ onValid }: Props) {
  const locale = useLocale();
  const t = useTranslations("auth");
  const isTR = locale === "tr";

  const [state, setState] = useState<ConsentState>({
    terms: false,
    data: false,
    kvkk: false,
    marketing: false,
  });

  useEffect(() => {
    const required = state.terms && state.data && (!isTR || state.kvkk);
    onValid(required, state);
  }, [state, isTR, onValid]);

  function toggle(key: keyof ConsentState) {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const CheckItem = ({
    id,
    checked,
    onChange,
    label,
    required,
  }: {
    id: string;
    checked: boolean;
    onChange: () => void;
    label: string;
    required?: boolean;
  }) => (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--gold)]"
      />
      <Label htmlFor={id} className={cn("font-ui text-sm leading-snug cursor-pointer", !required && "text-[var(--brown)]")}>
        {label}
        {required && <span className="ml-1 text-[var(--danger)]">*</span>}
      </Label>
    </div>
  );

  return (
    <div className="space-y-2">
      <CheckItem
        id="consent-terms"
        checked={state.terms}
        onChange={() => toggle("terms")}
        label={t("termsConsent")}
        required
      />
      <CheckItem
        id="consent-data"
        checked={state.data}
        onChange={() => toggle("data")}
        label={t("dataConsent")}
        required
      />
      {isTR && (
        <CheckItem
          id="consent-kvkk"
          checked={state.kvkk}
          onChange={() => toggle("kvkk")}
          label="KVKK kapsamında verilerimin işlenmesine açık rıza veriyorum"
          required
        />
      )}
      <CheckItem
        id="consent-marketing"
        checked={state.marketing}
        onChange={() => toggle("marketing")}
        label={t("marketingConsent")}
      />
    </div>
  );
}
