import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, Mail, ShieldCheck, Trash2, UserCheck } from 'lucide-react';
import Header from '@/components/Header';
import { useI18n } from '@/contexts/i18nContext';

const contentByLanguage = {
  es: {
    title: 'Política de Privacidad · TaxNomad',
    updatedAt: 'Última actualización: 20 de abril de 2026',
    heading: 'Política de Privacidad',
    intro: 'Transparencia total sobre el tratamiento de tus datos personales.',
    quickSummaryTitle: 'Resumen rápido',
    quickSummary: [
      {
        icon: Lock,
        title: 'Pagos seguros',
        description: 'Procesados 100% por Stripe. No accedemos a tus datos bancarios.',
      },
      {
        icon: Eye,
        title: 'Sin almacenamiento',
        description: 'Nombre e identificación solo se usan para generar el PDF y no se guardan.',
      },
      {
        icon: Trash2,
        title: 'Eliminación inmediata',
        description: 'Los datos se borran de memoria tras la descarga del PDF.',
      },
      {
        icon: UserCheck,
        title: 'Tus derechos',
        description: 'Acceso, rectificación y supresión disponibles en todo momento.',
      },
      {
        icon: Mail,
        title: 'Contacto DPO',
        description: 'hola@regla183.com',
        mailto: true,
      },
    ],
    sections: [
      {
        title: '1. Responsable del Tratamiento',
        body: [
          'En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), el Responsable del Tratamiento es:',
        ],
        list: [
          ['Nombre / Razón social', 'Antonio Ballesteros Alonso'],
          ['Dirección', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)'],
          ['NIF', '08997554T'],
          ['Email', 'hola@regla183.com'],
        ],
      },
      {
        title: '2. Datos que recopilamos y finalidad',
        blocks: [
          {
            title: '2.1 Datos de uso de la calculadora',
            body: 'Los rangos de fechas introducidos se procesan localmente en tu navegador para calcular días de presencia física. No se envían a ningún servidor.',
          },
          {
            title: '2.2 Datos del informe PDF',
            body: 'Para generar el informe personalizado recopilamos nombre completo y número de identificación (pasaporte o NIE). Estos datos se usan exclusivamente para insertar tu información en el PDF generado.',
            note: 'Base jurídica: Art. 6.1.b RGPD — ejecución de contrato.',
          },
          {
            title: '2.3 Datos de pago',
            body: 'Los pagos son procesados íntegramente por Stripe, Inc. No almacenamos ni accedemos a datos de tarjetas bancarias.',
            note: 'Base jurídica: Art. 6.1.b RGPD — ejecución de contrato.',
            link: { href: 'https://stripe.com/es/privacy', label: 'stripe.com/es/privacy' },
          },
          {
            title: '2.4 Datos técnicos y cookies de publicidad',
            body: 'Si activas publicidad mediante Google AdSense, Google puede utilizar cookies para mostrar anuncios personalizados en función de tu historial de navegación.',
            note: 'Base jurídica: Art. 6.1.a RGPD — consentimiento del interesado.',
            link: { href: 'https://adssettings.google.com', label: 'adssettings.google.com' },
          },
        ],
      },
      {
        title: '3. Plazo de conservación',
        body: [
          'Los datos personales del informe no se almacenan de forma persistente por nuestra parte. Se procesan durante la generación del PDF y se descartan después.',
          'Los datos de transacción pueden ser conservados por Stripe conforme a sus obligaciones legales y políticas de retención.',
        ],
      },
      {
        title: '4. Transferencias internacionales',
        body: [
          'Los datos de pago son gestionados por Stripe, Inc. (EE.UU.), bajo mecanismos de transferencia internacional adecuados como el Data Privacy Framework y las Cláusulas Contractuales Tipo.',
          'No realizamos ninguna otra transferencia internacional de datos personales.',
        ],
      },
      {
        title: '5. Tus derechos (Arts. 15-22 RGPD)',
        body: ['Puedes ejercer en cualquier momento los siguientes derechos:'],
        bulletList: [
          ['Acceso (Art. 15)', 'Solicitar información sobre qué datos tuyos tratamos.'],
          ['Rectificación (Art. 16)', 'Corregir datos inexactos o incompletos.'],
          ['Supresión (Art. 17)', 'Solicitar la eliminación de tus datos.'],
          ['Limitación (Art. 18)', 'Pedir que restrinjamos el tratamiento de tus datos.'],
          ['Portabilidad (Art. 20)', 'Recibir tus datos en formato estructurado y legible.'],
          ['Oposición (Art. 21)', 'Oponerte al tratamiento basado en interés legítimo.'],
        ],
        footer: [
          'Para ejercer tus derechos, escríbenos a hola@regla183.com indicando el derecho que deseas ejercer y una prueba de identidad.',
          'También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD): www.aepd.es.',
        ],
      },
      {
        title: '6. Cookies',
        body: ['Utilizamos exclusivamente los siguientes mecanismos locales o de terceros:'],
        plainList: [
          'localStorage para guardar tu preferencia de idioma y tema visual. No contiene datos personales sensibles.',
          'Cookies de Google AdSense, solo si se activa publicidad y siempre sujetas a consentimiento previo cuando resulte exigible.',
        ],
      },
    ],
    commitmentTitle: 'Compromiso de privacidad',
    commitment:
      'No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales propios. Tu informe PDF es de tu exclusiva propiedad.',
  },
  en: {
    title: 'Privacy Policy · TaxNomad',
    updatedAt: 'Last updated: April 20, 2026',
    heading: 'Privacy Policy',
    intro: 'Full transparency about how your personal data is processed.',
    quickSummaryTitle: 'Quick summary',
    quickSummary: [
      {
        icon: Lock,
        title: 'Secure payments',
        description: 'Handled 100% by Stripe. We do not access your banking details.',
      },
      {
        icon: Eye,
        title: 'No retention',
        description: 'Name and identification are only used to generate the PDF and are not stored permanently.',
      },
      {
        icon: Trash2,
        title: 'Immediate deletion',
        description: 'Report data is cleared from working memory after delivery.',
      },
      {
        icon: UserCheck,
        title: 'Your rights',
        description: 'Access, rectification and erasure rights are available at any time.',
      },
      {
        icon: Mail,
        title: 'Privacy contact',
        description: 'hola@regla183.com',
        mailto: true,
      },
    ],
    sections: [
      {
        title: '1. Data controller',
        body: ['In accordance with Regulation (EU) 2016/679 (GDPR), the data controller is:'],
        list: [
          ['Name', 'Antonio Ballesteros Alonso'],
          ['Address', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca, Spain'],
          ['Tax ID', '08997554T'],
          ['Email', 'hola@regla183.com'],
        ],
      },
      {
        title: '2. Data we collect and why',
        blocks: [
          {
            title: '2.1 Calculator usage data',
            body: 'The date ranges you enter are processed locally in your browser to calculate physical presence days. They are not sent to a server during the standard calculator flow.',
          },
          {
            title: '2.2 PDF report data',
            body: 'To generate the personalised report we collect your full name and identification number (passport or NIE). This information is used solely to populate your PDF report.',
            note: 'Legal basis: Article 6(1)(b) GDPR — performance of a contract.',
          },
          {
            title: '2.3 Payment data',
            body: 'Payments are processed entirely by Stripe, Inc. We do not store or access your card data.',
            note: 'Legal basis: Article 6(1)(b) GDPR — performance of a contract.',
            link: { href: 'https://stripe.com/privacy', label: 'stripe.com/privacy' },
          },
          {
            title: '2.4 Technical data and advertising cookies',
            body: 'If advertising is enabled through Google AdSense, Google may use cookies to personalise ads based on your browsing history.',
            note: 'Legal basis: Article 6(1)(a) GDPR — consent.',
            link: { href: 'https://adssettings.google.com', label: 'adssettings.google.com' },
          },
        ],
      },
      {
        title: '3. Retention period',
        body: [
          'Report personal data is not stored persistently by us. It is processed for delivery and then discarded.',
          'Transaction data may be retained by Stripe according to its legal obligations and retention policies.',
        ],
      },
      {
        title: '4. International transfers',
        body: [
          'Payment data is handled by Stripe, Inc. in the United States under recognised international transfer mechanisms such as the EU-U.S. Data Privacy Framework and Standard Contractual Clauses.',
          'We do not perform any other international transfers of personal data.',
        ],
      },
      {
        title: '5. Your rights (Articles 15-22 GDPR)',
        body: ['You may exercise the following rights at any time:'],
        bulletList: [
          ['Access (Art. 15)', 'Request information about what personal data we process about you.'],
          ['Rectification (Art. 16)', 'Correct inaccurate or incomplete data.'],
          ['Erasure (Art. 17)', 'Request deletion of your personal data.'],
          ['Restriction (Art. 18)', 'Request restricted processing of your data.'],
          ['Portability (Art. 20)', 'Receive your data in a structured, machine-readable format.'],
          ['Objection (Art. 21)', 'Object to processing based on legitimate interest.'],
        ],
        footer: [
          'To exercise any of these rights, email hola@regla183.com and specify the request together with proof of identity.',
          'You may also file a complaint with the Spanish Data Protection Agency (AEPD): www.aepd.es.',
        ],
      },
      {
        title: '6. Cookies',
        body: ['We only rely on the following local or third-party mechanisms:'],
        plainList: [
          'localStorage to remember language and theme preferences. It does not contain sensitive personal data.',
          'Google AdSense cookies, only if advertising is enabled and subject to prior consent when legally required.',
        ],
      },
    ],
    commitmentTitle: 'Privacy commitment',
    commitment:
      'We do not sell, rent or share your personal information with third parties for our own commercial purposes. Your PDF report remains exclusively yours.',
  },
} as const;

export default function PrivacyPolicy() {
  const { language, t } = useI18n();
  const content = contentByLanguage[language];

  return (
    <div className="premium-gradient min-h-screen text-foreground">
      <Helmet>
        <title>{content.title}</title>
      </Helmet>
      <Header />
      <main className="premium-section py-10">
        <Link to="/" className="metric-chip mb-8 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {t('legalBack')}
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <span className="premium-eyebrow">{content.updatedAt}</span>
            <h1 className="text-4xl font-[650] tracking-[-0.06em] sm:text-5xl">{content.heading}</h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{content.intro}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
            <aside className="space-y-6">
              <div className="double-shell lg:sticky lg:top-28">
                <div className="double-shell-core space-y-5 p-6">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                    {content.quickSummaryTitle}
                  </h2>
                  <div className="space-y-4">
                    {content.quickSummary.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex gap-3 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div className="text-sm leading-6 text-muted-foreground">
                            <strong className="text-foreground">{item.title}:</strong>{' '}
                            {item.mailto ? (
                              <a href={`mailto:${item.description}`} className="text-primary underline underline-offset-4">
                                {item.description}
                              </a>
                            ) : (
                              item.description
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              {content.sections.map((section) => (
                <section key={section.title} className="double-shell">
                  <div className="double-shell-core space-y-4 p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>

                    {section.body?.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}

                    {section.list ? (
                      <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
                          {section.list.map(([label, value]) => (
                            <p key={label}>
                              <strong className="text-foreground">{label}:</strong> {value}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {section.blocks?.map((block) => (
                      <div key={block.title} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 text-sm leading-7 text-muted-foreground">
                        <p className="font-semibold text-foreground">{block.title}</p>
                        <p className="mt-2">{block.body}</p>
                        {block.note ? <p className="mt-3 font-medium text-foreground/90">{block.note}</p> : null}
                        {block.link ? (
                          <p className="mt-3">
                            <a
                              href={block.link.href}
                              className="text-primary underline underline-offset-4"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {block.link.label}
                            </a>
                          </p>
                        ) : null}
                      </div>
                    ))}

                    {section.bulletList ? (
                      <div className="space-y-3">
                        {section.bulletList.map(([label, value]) => (
                          <div key={label} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-muted-foreground">
                            <strong className="text-foreground">{label}:</strong> {value}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {section.plainList ? (
                      <div className="space-y-3">
                        {section.plainList.map((item) => (
                          <div key={item} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-muted-foreground">
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {section.footer?.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                        {paragraph.includes('hola@regla183.com') ? (
                          <>
                            {paragraph.split('hola@regla183.com')[0]}
                            <a href="mailto:hola@regla183.com" className="text-primary underline underline-offset-4">
                              hola@regla183.com
                            </a>
                            {paragraph.split('hola@regla183.com')[1]}
                          </>
                        ) : paragraph.includes('www.aepd.es') ? (
                          <>
                            {paragraph.split('www.aepd.es')[0]}
                            <a
                              href="https://www.aepd.es"
                              className="text-primary underline underline-offset-4"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              www.aepd.es
                            </a>
                            {paragraph.split('www.aepd.es')[1]}
                          </>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="double-shell">
                <div className="double-shell-core space-y-4 p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-primary">{content.commitmentTitle}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{content.commitment}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
