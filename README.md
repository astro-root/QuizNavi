# QuizNavi

全国のクイズ大会情報を検索できるWebサービスです。中学生・高校生に限らず、誰でも大会の検索・登録ができます。

本番環境: https://quiznavi.astro-root.com

## 主な機能

### 参加者向け
- 大会の検索(キーワード・地域・開催形式・タグによる絞り込み)
- 大会詳細ページ(日時、開催地、参加費、参加資格、関連リンクなど)
- Googleカレンダーへの登録、Googleマップでの開催地確認
- 終了した大会の結果閲覧
- お問い合わせフォーム

### 主催者向け(要ログイン)
- Googleアカウントによるログイン
- 大会の新規登録(下書き保存)
- 登録した大会の一覧・詳細・編集
- 大会の公開/非公開の切り替え
- 大会ロゴ・企画書PDFのアップロード
- 会場住所のオートコンプリート入力(OpenStreetMap Nominatim)
- 終了した大会の結果報告

### 管理者向け(要ADMIN権限)
- 登録ユーザー一覧
- お問い合わせ一覧・既読管理
- 全大会・公開中大会の一覧

### その他
- ダークモード対応
- SEO対応(動的メタデータ、OGP画像、サイトマップ)

## 技術スタック

- Next.js (App Router, Turbopack)
- Prisma + PostgreSQL
- Supabase(認証・ストレージ・DB ホスティング)
- Tailwind CSS + shadcn/ui
- Zod(バリデーション)
- Vercel(ホスティング)

## セットアップ

### 環境変数

`.env.example` を参考に `.env` を作成してください。

    cp .env.example .env

以下の値が必要です。

| 変数名 | 説明 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseの匿名キー |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseのサービスロールキー(サーバー専用) |
| `DATABASE_URL` | Supabase Postgres接続文字列(pgbouncer経由) |
| `DIRECT_URL` | Supabase Postgres直接接続文字列(マイグレーション用) |
| `NEXT_PUBLIC_SITE_URL` | サイトのベースURL |
| `NEXT_PUBLIC_SITE_NAME` | サイト名 |

### Supabase側の設定

1. Authentication → Sign In / Up → Auth Providers で Google を有効化
2. Authentication → URL Configuration で Site URL / Redirect URLs を設定
3. Storage で `tournament-logos`(Public)、`tournament-documents`(Public)の2バケットを作成し、RLSポリシーを設定

### Google Cloud Console側の設定

1. OAuthクライアントIDを発行し、承認済みリダイレクトURIにSupabaseのコールバックURLを設定
2. 住所オートコンプリートはOpenStreetMap Nominatim(https://nominatim.openstreetmap.org)を利用しており、APIキーは不要

> 注意: Nominatimの利用ポリシーはタイプアヘッド/オートコンプリート用途での直接利用を推奨していません。個人開発・低トラフィックでの利用を想定していますが、本番運用でアクセス数が増える場合はセルフホストまたは商用ジオコーディングサービスへの移行を検討してください。

### インストールと起動

    npm install
    npx prisma db push
    npx prisma db seed
    npm run dev

http://localhost:3000 で確認できます。

## データベーススキーマの変更

このプロジェクトは `prisma db push` でスキーマを直接反映する運用です(マイグレーション履歴は管理していません)。

    npx prisma db push

## デプロイ

Vercelにリポジトリを連携し、上記の環境変数を登録してデプロイします。

    npx vercel --prod

## ディレクトリ構成(抜粋)

    app/
      admin/            管理者向けページ
      organizer/         主催者向けページ(大会登録・編集・公開管理)
      tournaments/        大会検索・詳細ページ
      account/          アカウント設定
      auth/callback/       Supabase認証コールバック
      login/            ログインページ
      contact/          お問い合わせフォーム
    lib/
      auth.ts           認証・ユーザー取得ヘルパー
      prisma.ts          Prismaクライアント
      validations/        Zodバリデーションスキーマ
      security/          サニタイズ処理
    prisma/
      schema.prisma        DBスキーマ
