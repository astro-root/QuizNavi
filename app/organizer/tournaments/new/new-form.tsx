"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { createTournamentDraft, type CreateTournamentState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { PREFECTURE_LABELS } from "@/lib/utils";
import { FileUploadField } from "@/components/organizer/file-upload-field";
import { AddressAutocomplete } from "@/components/organizer/address-autocomplete";
import { TagPicker } from "@/components/organizer/tag-picker";

const REGION_PREFECTURES: Record<string, string[]> = {
  HOKKAIDO: ["HOKKAIDO"],
  TOHOKU: ["AOMORI", "IWATE", "MIYAGI", "AKITA", "YAMAGATA", "FUKUSHIMA"],
  KANTO: ["IBARAKI", "TOCHIGI", "GUNMA", "SAITAMA", "CHIBA", "TOKYO", "KANAGAWA"],
  CHUBU: [
    "NIIGATA",
    "TOYAMA",
    "ISHIKAWA",
    "FUKUI",
    "YAMANASHI",
    "NAGANO",
    "GIFU",
    "SHIZUOKA",
    "AICHI",
  ],
  KINKI: ["MIE", "SHIGA", "KYOTO", "OSAKA", "HYOGO", "NARA", "WAKAYAMA"],
  CHUGOKU: ["TOTTORI", "SHIMANE", "OKAYAMA", "HIROSHIMA", "YAMAGUCHI"],
  SHIKOKU: ["TOKUSHIMA", "KAGAWA", "EHIME", "KOCHI"],
  KYUSHU_OKINAWA: [
    "FUKUOKA",
    "SAGA",
    "NAGASAKI",
    "KUMAMOTO",
    "OITA",
    "MIYAZAKI",
    "KAGOSHIMA",
    "OKINAWA",
  ],
  ONLINE_ONLY: [],
};

const initialState: CreateTournamentState = {};

const REGIONS = [
  ["HOKKAIDO", "北海道"],
  ["TOHOKU", "東北"],
  ["KANTO", "関東"],
  ["CHUBU", "中部"],
  ["KINKI", "近畿"],
  ["CHUGOKU", "中国"],
  ["SHIKOKU", "四国"],
  ["KYUSHU_OKINAWA", "九州・沖縄"],
  ["ONLINE_ONLY", "オンライン限定"],
];

type Tag = { id: string; name: string; category: string };

export function NewTournamentForm({ tags }: { tags: Tag[] }) {
  const [state, formAction, pending] = useActionState(
    createTournamentDraft,
    initialState
  );
  const [format, setFormat] = useState("");
  const [region, setRegion] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagNames, setNewTagNames] = useState<string[]>([]);
  const [venueName, setVenueName] = useState("");
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const availablePrefectures = region ? REGION_PREFECTURES[region] ?? [] : [];

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setPrefecture("");
    setDirty(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">大会を登録する</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          必須項目は「大会名」のみです。他の項目は後からいつでも編集できます。公開する際に必要な項目が揃っているかを確認します。
        </p>
      </div>

      {state.error && (
        <p className="mb-6 animate-in fade-in-0 slide-in-from-top-1 rounded-md bg-destructive/10 p-3 text-sm text-destructive duration-200">
          {state.error}
        </p>
      )}

      <form
        ref={formRef}
        action={formAction}
        onChange={() => setDirty(true)}
        onSubmit={() => setDirty(false)}
        className="space-y-8"
      >
        {selectedTagIds.map((id) => (
          <input key={id} type="hidden" name="tagIds" value={id} />
        ))}
        {newTagNames.map((name) => (
          <input key={name} type="hidden" name="newTagNames" value={name} />
        ))}

        <Section title="基本情報">
          <Field label="大会名" error={state.fieldErrors?.name} required>
            <Input name="name" required />
          </Field>

          <Field label="概要" error={state.fieldErrors?.description}>
            <Textarea name="description" rows={4} />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="開催日時" error={state.fieldErrors?.startAt}>
              <Input type="datetime-local" name="startAt" />
            </Field>
            <Field label="終了日時" error={state.fieldErrors?.endAt}>
              <Input type="datetime-local" name="endAt" />
            </Field>
            <Field label="参加締切" error={state.fieldErrors?.entryDeadline}>
              <Input type="datetime-local" name="entryDeadline" />
            </Field>
          </div>

          <Field label="開催形式" error={state.fieldErrors?.format}>
            <Select
              name="format"
              value={format}
              onValueChange={(v) => {
                setFormat(v);
                setDirty(true);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OFFLINE">オフライン</SelectItem>
                <SelectItem value="ONLINE">オンライン</SelectItem>
                <SelectItem value="HYBRID">ハイブリッド</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <Section title="開催場所">
          <Field label="地域" error={state.fieldErrors?.region}>
            <Select name="region" value={region} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="選択しない" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="都道府県" error={state.fieldErrors?.prefecture}>
            <Select
              name="prefecture"
              value={prefecture}
              onValueChange={(v) => {
                setPrefecture(v);
                setDirty(true);
              }}
              disabled={availablePrefectures.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    region
                      ? availablePrefectures.length === 0
                        ? "この地域は都道府県の指定不要です"
                        : "選択してください"
                      : "先に地域を選択してください"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availablePrefectures.map((value) => (
                  <SelectItem key={value} value={value}>
                    {PREFECTURE_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="市区町村" error={state.fieldErrors?.city}>
            <Input name="city" />
          </Field>

          <Field label="会場名" error={state.fieldErrors?.venueName}>
            <Input
              name="venueName"
              value={venueName}
              onChange={(e) => {
                setVenueName(e.target.value);
                setDirty(true);
              }}
            />
          </Field>

          <Field label="住所" error={state.fieldErrors?.address}>
            <AddressAutocomplete
              name="address"
              onPlaceSelected={(details) => {
                if (details.venueName) setVenueName(details.venueName);
                setDirty(true);
              }}
            />
          </Field>
        </Section>

        <Section title="参加条件">
          <Field label="定員" error={state.fieldErrors?.capacity}>
            <Input type="number" name="capacity" min={1} />
          </Field>

          <Field label="参加資格" error={state.fieldErrors?.eligibility}>
            <Input name="eligibility" />
          </Field>

          <Field label="対象レベル" error={state.fieldErrors?.eligibilityLevel}>
            <Input
              name="eligibilityLevel"
              placeholder="例: 高校生以下、初心者歓迎、経験者向け など"
            />
          </Field>

          <Field label="参加費" error={state.fieldErrors?.fee}>
            <Input name="fee" />
          </Field>

          <Field label="持ち物" error={state.fieldErrors?.belongings}>
            <Input name="belongings" />
          </Field>

          <Field label="問い合わせ先" error={state.fieldErrors?.contact}>
            <Input name="contact" />
          </Field>
        </Section>

        <Section title="タグ">
          <TagPicker
            tags={tags}
            selectedTagIds={selectedTagIds}
            onSelectedTagIdsChange={(ids) => {
              setSelectedTagIds(ids);
              setDirty(true);
            }}
            newTagNames={newTagNames}
            onNewTagNamesChange={(names) => {
              setNewTagNames(names);
              setDirty(true);
            }}
          />
        </Section>

        <Section title="関連リンク">
          <FileUploadField
            label="大会ロゴ"
            name="logoUrl"
            bucket="tournament-logos"
            accept="image/*"
            kind="image"
            error={state.fieldErrors?.logoUrl}
          />
          <Field label="タイムテーブルURL" error={state.fieldErrors?.timetableUrl}>
            <Input name="timetableUrl" placeholder="https://" />
          </Field>
          <FileUploadField
            label="企画書"
            name="pdfUrl"
            bucket="tournament-documents"
            accept="application/pdf"
            kind="document"
            error={state.fieldErrors?.pdfUrl}
          />
          <Field label="公式サイト" error={state.fieldErrors?.officialSite}>
            <Input name="officialSite" placeholder="https://" />
          </Field>
          <Field label="公式X" error={state.fieldErrors?.officialX}>
            <Input name="officialX" placeholder="https://" />
          </Field>
          <Field label="エントリーフォームURL" error={state.fieldErrors?.entryFormUrl}>
            <Input name="entryFormUrl" placeholder="https://" />
          </Field>
          <Field label="その他" error={state.fieldErrors?.others}>
            <Textarea name="others" rows={3} />
          </Field>
        </Section>

        <Button
          type="submit"
          disabled={pending}
          className="w-full transition-transform active:scale-[0.98]"
        >
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "保存中..." : "下書きとして保存"}
        </Button>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="animate-in fade-in-0 text-xs text-destructive duration-150">
          {error}
        </p>
      )}
    </div>
  );
}
