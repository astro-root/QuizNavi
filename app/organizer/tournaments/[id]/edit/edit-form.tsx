"use client";

import { useActionState, useState } from "react";
import { updateTournament } from "../../actions";
import type { CreateTournamentState } from "../../actions";
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
import { FileUploadField } from "@/components/organizer/file-upload-field";
import { AddressAutocomplete } from "@/components/organizer/address-autocomplete";
import { Loader2 } from "lucide-react";
import { PREFECTURE_LABELS } from "@/lib/utils";
import type { Tournament } from "@prisma/client";

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

const ELIGIBILITY_LEVELS = [
  ["ANYONE", "誰でも参加可能"],
  ["MIDDLE_SCHOOL", "中学生"],
  ["HIGH_SCHOOL", "高校生"],
  ["MIDDLE_AND_HIGH", "中高生"],
  ["BEGINNER_WELCOME", "初心者歓迎"],
];

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

function toLocalInputValue(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function EditTournamentForm({ tournament }: { tournament: Tournament }) {
  const updateWithId = updateTournament.bind(null, tournament.id);
  const [state, formAction, pending] = useActionState(updateWithId, initialState);

  const [format, setFormat] = useState<string>(tournament.format);
  const [region, setRegion] = useState(tournament.region ?? "");
  const [prefecture, setPrefecture] = useState(tournament.prefecture ?? "");
  const [eligibilityLevel, setEligibilityLevel] = useState<string>(
    tournament.eligibilityLevel
  );
  const [venueName, setVenueName] = useState(tournament.venueName ?? "");

  const availablePrefectures = region ? REGION_PREFECTURES[region] ?? [] : [];

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setPrefecture("");
  };

  return (
    <>
      {state.error && (
        <p className="mb-6 animate-in fade-in-0 slide-in-from-top-1 rounded-md bg-destructive/10 p-3 text-sm text-destructive duration-200">
          {state.error}
        </p>
      )}

      <form action={formAction} className="space-y-8">
        <Section title="基本情報">
          <Field label="大会名" error={state.fieldErrors?.name} required>
            <Input name="name" defaultValue={tournament.name} required />
          </Field>

          <Field label="概要" error={state.fieldErrors?.description}>
            <Textarea
              name="description"
              rows={4}
              defaultValue={tournament.description ?? ""}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="開催日時" error={state.fieldErrors?.startAt} required>
              <Input
                type="datetime-local"
                name="startAt"
                defaultValue={toLocalInputValue(tournament.startAt)}
                required
              />
            </Field>
            <Field label="終了日時" error={state.fieldErrors?.endAt}>
              <Input
                type="datetime-local"
                name="endAt"
                defaultValue={toLocalInputValue(tournament.endAt)}
              />
            </Field>
          </div>

          <Field label="参加締切" error={state.fieldErrors?.entryDeadline}>
            <Input
              type="datetime-local"
              name="entryDeadline"
              defaultValue={toLocalInputValue(tournament.entryDeadline)}
            />
          </Field>

          <Field label="開催形式" error={state.fieldErrors?.format} required>
            <Select name="format" value={format} onValueChange={setFormat}>
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
              onValueChange={setPrefecture}
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
            <Input name="city" defaultValue={tournament.city ?? ""} />
          </Field>

          <Field label="会場名" error={state.fieldErrors?.venueName}>
            <Input
              name="venueName"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />
          </Field>

          <Field label="住所" error={state.fieldErrors?.address}>
            <AddressAutocomplete
              name="address"
              defaultValue={tournament.address ?? ""}
              onPlaceSelected={(details) => {
                if (details.venueName) setVenueName(details.venueName);
              }}
            />
          </Field>
        </Section>

        <Section title="参加条件">
          <Field label="定員" error={state.fieldErrors?.capacity}>
            <Input
              type="number"
              name="capacity"
              min={1}
              defaultValue={tournament.capacity ?? ""}
            />
          </Field>

          <Field label="参加資格" error={state.fieldErrors?.eligibility} required>
            <Input name="eligibility" defaultValue={tournament.eligibility} required />
          </Field>

          <Field label="対象レベル" error={state.fieldErrors?.eligibilityLevel}>
            <Select
              name="eligibilityLevel"
              value={eligibilityLevel}
              onValueChange={setEligibilityLevel}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ELIGIBILITY_LEVELS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="参加費" error={state.fieldErrors?.fee} required>
            <Input name="fee" defaultValue={tournament.fee} required />
          </Field>

          <Field label="持ち物" error={state.fieldErrors?.belongings}>
            <Input name="belongings" defaultValue={tournament.belongings ?? ""} />
          </Field>

          <Field label="問い合わせ先" error={state.fieldErrors?.contact} required>
            <Input name="contact" defaultValue={tournament.contact} required />
          </Field>
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
            <Input name="timetableUrl" defaultValue={tournament.timetableUrl ?? ""} />
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
            <Input name="officialSite" defaultValue={tournament.officialSite ?? ""} />
          </Field>
          <Field label="公式X" error={state.fieldErrors?.officialX}>
            <Input name="officialX" defaultValue={tournament.officialX ?? ""} />
          </Field>
          <Field label="エントリーフォームURL" error={state.fieldErrors?.entryFormUrl}>
            <Input name="entryFormUrl" defaultValue={tournament.entryFormUrl ?? ""} />
          </Field>
          <Field label="その他" error={state.fieldErrors?.others}>
            <Textarea name="others" rows={3} defaultValue={tournament.others ?? ""} />
          </Field>
        </Section>

        <Button
          type="submit"
          disabled={pending}
          className="w-full transition-transform active:scale-[0.98]"
        >
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "保存中..." : "変更を保存する"}
        </Button>
      </form>
    </>
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
