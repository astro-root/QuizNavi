# Root Account移行メモ（QuizNavi）

QuizNavi独自のSupabaseプロジェクトをやめ、るーとの研究室 共通アカウント基盤(root-accountリポジトリ)の
Supabaseプロジェクトを参照するように変更した。

## コードの変更点

- `lib/supabase/client.ts` / `server.ts`、`middleware.ts`、`lib/supabase/middleware.ts`：
  接続先を `NEXT_PUBLIC_SUPABASE_URL` → `NEXT_PUBLIC_ROOT_ACCOUNT_URL` に変更し、
  cookieのdomainを `.astro-root.com` に設定（サブドメイン間SSOのため）
- `app/account/actions.ts`：アカウント削除時のSupabase Admin Clientも同様に向き先変更
- `lib/root-account/entitlements.ts`：新規追加。JWTから`plan`(学士/修士/博士)を判定する。
  `@rootlab/account-sdk`をnpm配布するまでの暫定コピー
- `lib/auth.ts`：`getCurrentEntitlements()` / `requirePlan()` を追加。`requireAdmin()`と同じ使い方

**`getCurrentUser()`（`lib/auth.ts`）自体は変更していない。** 元々 `authId` でRoot Account側の
`auth.users.id`を参照する設計に既になっていたため、参照先のSupabaseプロジェクトを差し替えるだけで
そのまま機能する。

## 手動で必要な作業（コードの外）

1. **Root Account側のSupabaseダッシュボードでGoogle Providerを設定する。**
   QuizNavi独自プロジェクトで設定していたGoogle OAuthクライアントの認証情報を、
   Root Accountプロジェクト側に移す。許可オリジン/リダイレクトURIにQuizNaviの
   実際のドメインを追加すること。
2. **QuizNaviのデプロイ先ドメインを`*.astro-root.com`のサブドメインに変更する。**
   `quiznavi.vercel.app`のままだとcookieのdomain共有(`.astro-root.com`)が機能せず、
   Root AccountでログインしてもQuizNavi側はログイン状態にならない。これは今回の変更の
   前提条件なので、他の作業より先に済ませておくこと。
3. **既存のテストユーザーデータの扱い。**
   QuizNaviはまだ本番公開前のため、既存の`User`テーブルの`authId`は旧Supabase
   プロジェクトのIDを指したままで無効になる。複雑な移行スクリプトは不要で、
   開発DBの`User`テーブルをリセット（またはRoot Account側で同じテストアカウントを
   作り直してログインし直す＝`getCurrentUser()`が自動でRoot Account基準の新しい
   `User`レコードを作る）で十分。
4. **`.env`を`.env.example`に沿って再設定する。** 特に`ROOT_ACCOUNT_SERVICE_ROLE_KEY`は
   Root Account側のSupabaseプロジェクトのservice_role keyであり、QuizNavi独自プロジェクトの
   ものとは別物なので注意。

## 未着手（今回のスコープ外）

- `requirePlan()`を実際の機能（AI機能など）に組み込む作業はまだ行っていない。導入箇所は
  今後の機能追加のタイミングで決める
- バッジ付与（`user_badges`への書き込み）はまだQuizNavi側から一切行っていない
