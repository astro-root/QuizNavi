export default function TermsPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold">利用規約</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">第1条(適用)</h2>
          <p>本規約は、本サービスの利用条件を定めるものです。</p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-foreground">第2条(禁止事項)</h2>
          <p>
            利用者は、本サービスの利用にあたり、虚偽の大会情報の登録、その他法令に違反する行為を行ってはなりません。
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-foreground">第3条(免責事項)</h2>
          <p>
            本サービスに掲載される大会情報の正確性について、運営者は保証するものではありません。
          </p>
        </section>
      </div>
    </div>
  );
}
