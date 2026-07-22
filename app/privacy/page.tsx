import { SITE_NAME } from "@/lib/utils";

export const metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold">プライバシーポリシー</h1>
      <p className="mb-8 text-xs text-muted-foreground">最終更新日: 2026年7月22日</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">1. 取得する情報</h2>
          <p className="mb-2">本サービスでは、以下の情報を取得します。</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Googleアカウントでのログイン時: 氏名、メールアドレス、プロフィール画像URL</li>
            <li>大会情報の登録時: 入力された大会名・日時・会場・参加費等の大会情報、アップロードされたロゴ画像・企画書PDF</li>
            <li>お問い合わせフォーム送信時: 氏名、メールアドレス、お問い合わせ内容</li>
            <li>サービス利用状況: アクセスログ、Cookie等の技術的情報</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">2. 利用目的</h2>
          <p className="mb-2">取得した情報は、以下の目的の範囲内で利用します。</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>本サービスの提供・維持・改善のため</li>
            <li>ログイン状態の維持、利用者本人の識別のため</li>
            <li>お問い合わせへの対応のため</li>
            <li>不正利用の防止、利用規約違反への対応のため</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">3. 第三者提供・委託先</h2>
          <p className="mb-2">
            本サービスは、以下の外部サービスを利用しており、利用目的の達成に必要な範囲で情報を取り扱います。
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Supabase(認証基盤・データベース・ファイルストレージ)</li>
            <li>Google(ログイン認証、OAuth)</li>
            <li>Vercel(ホスティングインフラ)</li>
            <li>OpenStreetMap Nominatim(住所検索、送信した検索文字列が第三者に送信されます)</li>
          </ul>
          <p className="mt-2">
            法令に基づく場合を除き、本人の同意なく取得した情報を第三者へ提供することはありません。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">4. 公開される情報</h2>
          <p>
            登録された大会情報のうち、公開設定にしたものは本サービス上で誰でも閲覧できる状態になります。
            大会の問い合わせ先として入力した情報は、大会詳細ページに表示される場合があります。
            個人情報を大会情報として入力する際はご注意ください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">5. 情報の保存期間・削除</h2>
          <p>
            利用者は、アカウント設定ページからアカウントの削除を行うことができます。
            アカウント削除に伴い、登録された個人情報は削除されます。
            ただし、主催した大会情報が残っている場合はアカウントを削除できません。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">6. Cookieの利用</h2>
          <p>
            本サービスは、ログイン状態の維持のためにCookieを利用します。
            ブラウザの設定によりCookieを無効化した場合、一部機能が正常に利用できない場合があります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">7. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーの内容は、必要に応じて予告なく変更されることがあります。
            変更後のポリシーは、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">8. お問い合わせ</h2>
          <p>
            {SITE_NAME} の個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームよりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
