export default function PrivacyPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold">プライバシーポリシー</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">取得する情報</h2>
          <p>
            本サービスでは、ログイン時にGoogleアカウントの氏名・メールアドレス・プロフィール画像を取得します。
            また、お問い合わせフォームからは氏名・メールアドレス・お問い合わせ内容を取得します。
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-foreground">利用目的</h2>
          <p>
            取得した情報は、本サービスの提供、お問い合わせへの対応の目的でのみ利用します。
          </p>
        </section>
      </div>
    </div>
  );
}
