import { SITE_NAME } from "@/lib/utils";

export const metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold">利用規約</h1>
      <p className="mb-8 text-xs text-muted-foreground">最終更新日: 2026年7月22日</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">第1条(適用)</h2>
          <p>
            本規約は、{SITE_NAME}(以下「本サービス」といいます)の利用条件を定めるものです。
            利用者は本サービスを利用することにより、本規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第2条(サービス内容)</h2>
          <p>
            本サービスは、クイズ大会に関する情報の掲載・検索を目的とした情報提供サービスです。
            大会情報は主催者自身が登録するものであり、運営者が内容を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第3条(アカウント登録)</h2>
          <p>
            本サービスの一部機能(大会の登録・お気に入り登録等)の利用にはGoogleアカウントによるログインが必要です。
            利用者は、自身のアカウントの管理について責任を負うものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第4条(禁止事項)</h2>
          <p className="mb-2">利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>虚偽の大会情報、または実在しない大会の登録</li>
            <li>法令または公序良俗に違反する行為</li>
            <li>他の利用者、第三者、または運営者の権利・利益を侵害する行為</li>
            <li>本サービスのサーバーやネットワークに過度な負荷をかける行為、不正アクセス</li>
            <li>本サービスを通じて取得した情報を、無断で商業目的に利用する行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第5条(投稿内容の取り扱い)</h2>
          <p>
            利用者が登録した大会情報等のコンテンツは、本サービス上での表示・検索のために利用者の許諾のもと掲載されます。
            運営者は、本規約に違反する、または不適切と判断したコンテンツを、事前の通知なく非公開化・削除できるものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第6条(免責事項)</h2>
          <p>
            本サービスに掲載される大会情報の正確性・最新性・完全性について、運営者は保証するものではありません。
            利用者は、大会への参加を検討するにあたり、必ず主催者の公式情報をご確認ください。
            本サービスの利用により利用者に生じた損害について、運営者は法令上許容される範囲で責任を負わないものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第7条(サービスの変更・中断・終了)</h2>
          <p>
            運営者は、利用者への事前の通知なく、本サービスの内容を変更し、または提供を中断・終了することができるものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第8条(規約の変更)</h2>
          <p>
            運営者は、必要と判断した場合には、利用者への事前の通知なく本規約を変更できるものとします。
            変更後の規約は、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">第9条(準拠法・管轄)</h2>
          <p>
            本規約の解釈にあたっては日本法を準拠法とします。本サービスに関して紛争が生じた場合には、
            運営者の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </section>
      </div>
    </div>
  );
}
